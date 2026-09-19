import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/requireUser';
import { CopilotRequestSchema } from '@/lib/copilot/schemas';
import { checkRateLimit } from '@/lib/copilot/rate-limit';
import { buildCopilotContext } from '@/lib/copilot/context-builder';
import { buildSystemPrompt } from '@/lib/copilot/prompt';
import { parseCopilotAIResponse } from '@/lib/copilot/response-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = CopilotRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;
    const userMessage = (body.message || body.text || '').trim();
    const attachment = body.attachment;

    if (!userMessage && !attachment) {
      return NextResponse.json(
        { error: 'Message content or attachment is required.' },
        { status: 400 }
      );
    }

    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anon';
    const rateLimit = checkRateLimit(ip, 30, 5 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'rate_limit_exceeded',
          message: 'تم تجاوز الحد المسموح من الرسائل مؤقتاً. يرجى الانتظار دقيقة والمحاولة مجدداً.',
        },
        { status: 429 }
      );
    }

    // 2. Resolve Authenticated User (gracefully fall back to guest if unauthenticated)
    const { user } = await requireUser();
    const effectiveUserId = user?.id || body.userId || (typeof body.user?.id === 'string' ? body.user.id : 'guest-user');
    const supabase = await createClient();

    const userName: string =
      body.user?.fullName ||
      body.user?.name ||
      user?.email?.split('@')[0] ||
      'المستخدم';

    let effectiveUserMessage = userMessage;
    if (attachment) {
      const attachContent = body.attachmentText || body.attachmentData?.rawText || body.activeCv?.rawText;
      const snippet = attachContent 
        ? `\n\n[محتوى ونصوص الملف المرفق «${attachment}»]:\n"""\n${attachContent.slice(0, 8000)}\n"""`
        : `\n\n[الملف المرفق: «${attachment}»]`;

      effectiveUserMessage = userMessage 
        ? `${userMessage}\n${snippet}`
        : `يرجى مراجعة وتحليل سيرتي الذاتية والملف المرفق بالتفصيل: «${attachment}»\n${snippet}`;
    }

    // 3. Build Rich Context (Deterministic Job Ranking, User CV, Skills)
    const context = await buildCopilotContext(supabase, effectiveUserId, userName, rawBody);
    const systemInstruction = buildSystemPrompt(context);

    // 4. Save User Message to DB
    if (supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
      try {
        await supabase.from('copilot_messages').insert({
          user_id: effectiveUserId,
          role: 'user',
          content: effectiveUserMessage,
        });
      } catch (e) {
        console.warn('Could not save user message:', e);
      }
    }

    // 5. Build multi-turn chat contents for Gemini
    const geminiContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    if (Array.isArray(rawBody.recentMessages) && rawBody.recentMessages.length > 0) {
      const recent = rawBody.recentMessages.slice(-6);
      for (const m of recent) {
        const role = m.role === 'user' ? 'user' : 'model';
        const msgText = typeof m.content === 'string' ? m.content : typeof m.text === 'string' ? m.text : '';
        if (msgText && msgText.trim()) {
          geminiContents.push({
            role,
            parts: [{ text: msgText.trim() }],
          });
        }
      }
    }
    // Append current user message
    geminiContents.push({
      role: 'user',
      parts: [{ text: effectiveUserMessage }],
    });

    // 6. Generate AI Response via Gemini Fast Models
    const apiKey = process.env.GEMINI_API_KEY;
    let rawOutputText = '';

    if (apiKey) {
      const candidateModels = [
        'models/gemini-3.5-flash-lite',
        'models/gemini-3.6-flash',
        'models/gemini-3.7-flash',
        'gemini-3.5-flash-lite',
        'gemini-3.6-flash',
      ];
      const ai = new GoogleGenAI({ apiKey });

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: geminiContents,
            config: {
              systemInstruction,
              temperature: 0.5,
              responseMimeType: 'application/json',
            },
          });
          if (response.text) {
            rawOutputText = response.text;
            break;
          }
        } catch (modelErr: unknown) {
          const errMsg = modelErr instanceof Error ? modelErr.message : String(modelErr);
          console.warn(`Gemini model ${model} call notice:`, errMsg);
        }
      }
    }

    // 7. If API call failed, provide contextual fallback
    if (!rawOutputText) {
      const topJob = context.topRankedJobs[0];
      const hasJobAdvice = topJob
        ? `\n\n📌 **أقرب فرصة مطابقة لمهاراتك حالياً:**\n- وظيفة **${topJob.title}** في **${topJob.company}** بنسبة تطابق **${topJob.matchScore}%**.\n- المهارات المتوافقة: ${topJob.matchingSkills.join(', ') || 'أساسيات المجال'}.\n- المهارات المقترحة للتطوير: ${topJob.missingSkills.join(', ') || 'أدوات السحاب والنشر'}.`
        : '';

      if (context.attachedDocumentText) {
        rawOutputText = JSON.stringify({
          message: `قمت بمراجعة وقراءة الملف المرفق **«${context.attachmentName || 'السيرة الذاتية'}»** 📄.\n\n` +
            `📊 **توصيات التحسين لسوق العمل المصري:**\n` +
            `1. **هيكل السيرة الذاتية (ATS Structure):** تأكد من استخدام نسق العمود الواحد وتنسيق واضح للأقسام.\n` +
            `2. **قياس الأثر الكمي (Quantified Impact):** احرص على صياغة الإنجازات بأرقام ونسب مئوية دقيقة.\n` +
            `3. **الربط مع الوظائف:** ركز على المهارات الأكثر طلباً في السوق.` +
            hasJobAdvice,
          navigation: [{ path: '/jobs', label: 'استعراض الوظائف المطابقة', priority: 'primary' }],
          followUps: ['كيف أرفع الـ Match Score للوظائف؟', 'ما هي أكثر المهارات طلباً في القاهرة؟']
        });
      } else {
        rawOutputText = JSON.stringify({
          message: `أهلاً بك يا ${userName}! يسعدني مساعدتك في تطوير مسارك المهني كـ **${context.targetRole}** في السوق المصري.\n\n` +
            `💡 **أبرز التوصيات العملية:**\n` +
            `1. **تطوير المهارات المطلوبة:** ركز على المهارات العملية والمشاريع الواقعية.\n` +
            `2. **تحسين السيرة الذاتية (ATS):** صياغة الإنجازات بأرقام محددة.\n` +
            `3. **التقديم المباشر:** استكشاف الشواغر الجديدة في الشركات التقنية.` +
            hasJobAdvice,
          navigation: [{ path: '/jobs', label: 'استعراض الوظائف المطابقة', priority: 'primary' }],
          followUps: ['ما هي خطة تطوير المهارات المناسبة لي؟', 'كيف أجهز نفسي لمقابلات العمل؟']
        });
      }
    }

    // 7. Parse & Validate into Structured CopilotResponse
    const structuredResponse = parseCopilotAIResponse(rawOutputText, context.targetRole);

    // 8. Save Assistant Response to DB
    if (supabase && effectiveUserId && !effectiveUserId.startsWith('guest')) {
      try {
        await supabase.from('copilot_messages').insert({
          user_id: effectiveUserId,
          role: 'assistant',
          content: structuredResponse.message,
        });
      } catch (dbErr) {
        console.warn('Failed to save assistant response in DB:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: structuredResponse,
    });
  } catch (err: unknown) {
    console.error('Error in /api/copilot/chat:', err);
    return NextResponse.json({ error: 'Failed to process Career Copilot request.' }, { status: 500 });
  }
}
