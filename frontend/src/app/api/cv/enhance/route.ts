import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRONGER_VERBS: Record<string, string> = {
  Supported: 'Facilitated',
  Helped: 'Contributed to',
  Assisted: 'Collaborated on',
  Created: 'Designed and built',
  Cleaned: 'Standardized and preprocessed',
  Worked: 'Delivered',
  Made: 'Developed',
  Did: 'Executed',
  Used: 'Leveraged',
  Got: 'Achieved',
  Managed: 'Orchestrated',
  Wrote: 'Authored and deployed',
  Fixed: 'Resolved and optimized',
  Ran: 'Executed',
};

const IMPACT_SUFFIXES = [
  'resulting in a 25% improvement in processing efficiency.',
  'reducing manual operational effort by 30%.',
  'improving data reliability and reporting accuracy across teams.',
  'delivering deliverables ahead of scheduled milestones.',
  'optimizing turnaround time for cross-functional stakeholders.',
];

function fallbackEnhanceBullet(bullet: string, index: number): string {
  if (!bullet.trim()) return bullet;
  let text = bullet.trim();
  const firstWord = text.split(/\s+/)[0];
  if (STRONGER_VERBS[firstWord]) {
    text = STRONGER_VERBS[firstWord] + text.slice(firstWord.length);
  } else if (!/^[A-Z][a-z]+ed\b/.test(firstWord) && !/^[A-Z][a-z]+ing\b/.test(firstWord)) {
    text = 'Developed and executed ' + text.charAt(0).toLowerCase() + text.slice(1);
  }
  if (!/\d/.test(text)) {
    text = text.replace(/[.]+$/, '') + ', ' + IMPACT_SUFFIXES[index % IMPACT_SUFFIXES.length];
  }
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, content, bullets, role, company, skills } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // ─── 1. Bullets Enhancement ───
    if (type === 'bullets' || Array.isArray(bullets)) {
      const inputBullets: string[] = (Array.isArray(bullets) ? bullets : [content]).filter(
        b => typeof b === 'string' && b.trim().length > 0
      );
      if (!inputBullets.length) {
        return NextResponse.json({ bullets: [] });
      }

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const roleCtx = role ? `Role: "${role}"${company ? ` at "${company}"` : ''}.` : '';
          const prompt = `You are an executive tech resume specialist in the Egyptian and international tech market.
Rewrite the following CV experience bullets into concise (15-25 words), high-impact achievement statements.
Start each with a strong past-tense action verb (Engineered, Implemented, Spearheaded, Automated, etc.) and quantify results where natural.
${roleCtx}

Original bullets:
${JSON.stringify(inputBullets, null, 2)}

Return strict JSON:
{"bullets": ["enhanced bullet 1", "enhanced bullet 2", ...]}`;

          const res = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            }
          });

          const rawText = res.text?.trim() || '';
          const parsed = JSON.parse(rawText);
          const resultBullets = parsed.bullets || parsed;

          if (Array.isArray(resultBullets) && resultBullets.length > 0) {
            const finalBullets = inputBullets.map((orig, i) => resultBullets[i] || orig);
            return NextResponse.json({
              bullets: finalBullets.map(b => String(b).replace(/^[•\-\*]\s*/, '').replace(/\*\*/g, '').trim()),
              enhancedBy: 'gemini-ai'
            });
          }
        } catch (aiError: any) {
          console.warn('[CV Enhance API] Gemini bullets fallback:', aiError?.message || aiError);
        }
      }

      // Algorithmic Fallback
      const enhanced = inputBullets.map((b, i) => fallbackEnhanceBullet(b, i));
      return NextResponse.json({ bullets: enhanced, enhancedBy: 'heuristic-fallback' });
    }

    // ─── 2. Summary Enhancement ───
    if (type === 'summary') {
      const summaryText: string = String(content || '').trim();
      if (!summaryText) {
        return NextResponse.json({ summary: summaryText });
      }

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const roleCtx = role ? `Target Role: "${role}".` : '';
          const skillsCtx = Array.isArray(skills) && skills.length > 0 ? `Key Skills: ${skills.join(', ')}.` : '';
          const prompt = `Rewrite this candidate's CV professional summary into 2-3 concise, impactful sentences highlighting their core identity, technical expertise, and career value.
${roleCtx} ${skillsCtx}

Candidate's current draft:
"${summaryText}"

Return strict JSON:
{"summary": "your polished 2-3 sentence summary"}`;

          const res = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            }
          });

          const rawText = res.text?.trim() || '';
          const parsed = JSON.parse(rawText);
          if (parsed && typeof parsed.summary === 'string' && parsed.summary.trim().length > 20) {
            return NextResponse.json({
              summary: parsed.summary.trim().replace(/\*\*/g, ''),
              enhancedBy: 'gemini-ai'
            });
          }
        } catch (aiError: any) {
          console.warn('[CV Enhance API] Gemini summary fallback:', aiError?.message || aiError);
        }
      }

      // Algorithmic Fallback for Summary
      const enhancedSummary = `Results-driven ${role || 'professional'} with proven technical expertise. ${summaryText}`;
      return NextResponse.json({ summary: enhancedSummary, enhancedBy: 'heuristic-fallback' });
    }

    return NextResponse.json({ error: 'Invalid enhancement type specified' }, { status: 400 });
  } catch (err: any) {
    console.error('[CV Enhance API] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
