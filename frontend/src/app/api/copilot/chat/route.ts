import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
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

    // 2. Resolve Authenticated User
    const supabase = await createClient();
    let authUser: { id: string; email?: string } | null = null;
    if (supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) authUser = data.user;
      } catch (e) {
        console.warn('Supabase auth session check notice:', e);
      }
    }

    const effectiveUserId: string =
      authUser?.id ||
      body.userId ||
      (body.user?.id ? String(body.user.id) : null) ||
      (body.user?.email ? `user_${body.user.email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'guest_user');

    const userName: string =
      body.user?.fullName ||
      body.user?.name ||
      authUser?.email?.split('@')[0] ||
      'المستخدم';

    const effectiveUserMessage = userMessage || `Review my CV: ${attachment}`;

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

    // 5. Generate AI Response via Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    let rawOutputText = '';

    if (apiKey) {
      const candidateModels = ['gemini-3.6-flash', 'gemini-3.7-flash'];
      const ai = new GoogleGenAI({ apiKey });

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: effectiveUserMessage }] }],
            config: {
              systemInstruction,
              temperature: 0.6,
            },
          });
          if (response.text) {
            rawOutputText = response.text;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Gemini model ${model} call notice:`, modelErr.message || modelErr);
        }
      }
    }

    // 6. If no API key or call failed, use intelligent contextual response
    if (!rawOutputText) {
      const topJob = context.topRankedJobs[0];
      const hasJobAdvice = topJob
        ? `\n\n📌 **أقرب فرصة مطابقة لمهاراتك حالياً:**\n- وظيفة **${topJob.title}** في **${topJob.company}** بنسبة تطابق **${topJob.matchScore}%**.\n- المهارات المتوافقة: ${topJob.matchingSkills.join(', ') || 'أساسيات المجال'}.\n- المهارات المقترحة للتطوير: ${topJob.missingSkills.join(', ') || 'أدوات السحاب والنشر'}.`
        : '';

      rawOutputText =
        `أهلاً بك يا ${userName}! يسعدني مساعدتك في تطوير مسارك المهني كـ **${context.targetRole}** في السوق المصري.\n\n` +
        `💡 **أبرز التوصيات العملية:**\n` +
        `1. **تطوير المهارات المطلوبة:** ركز على المهارات العملية والمشاريع الواقعية المرفوعة على GitHub.\n` +
        `2. **تحسين السيرة الذاتية (ATS):** تأكد من صياغة الإنجازات بنسب مئوية وأرقام محددة (Quantifiable Impact).\n` +
        `3. **التقديم المباشر:** تابع باستمرار الشواغر الجديدة في الشركات التقنية الرائدة في القاهرة والإسكندرية.` +
        hasJobAdvice;
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
    const message = err instanceof Error ? err.message : 'Failed to process Career Copilot request.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
