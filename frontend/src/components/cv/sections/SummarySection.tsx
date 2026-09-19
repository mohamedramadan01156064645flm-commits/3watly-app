"use client";

import React from 'react';
import { useCV } from '../../../contexts/CVContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { TextAreaField } from '../../ui/Field';
import { AIEnhanceButton } from '../AIEnhanceButton';
import type { CVData } from '../../../types/cv';

export function SummarySection() {
  const { cv, update } = useCV();
  const { isAr } = useLanguage();

  return (
    <div>
      <TextAreaField
        label={isAr ? "الملخص المهني" : "Summary"}
        value={cv.summary}
        rows={5}
        maxLength={600}
        hint={
          isAr
            ? "يُفضل من 2 إلى 3 جمل تغطي مجالك وسنوات خبرتك وأهم مهاراتك التقنية."
            : "Aim for 2–3 sentences covering your role, years of experience and core tools."
        }
        onChange={(value) =>
          update((prev) => ({ ...prev, summary: value }), 'summary')
        }
      />
      
      <AIEnhanceButton
        label={isAr ? "إعادة صياغة الملخص بالذكاء الاصطناعي" : "Rewrite Summary with AI"}
        hint={
          isAr
            ? "يحافظ الذكاء الاصطناعي على حقائقك ويصيغها بأسلوب احترافي قوي يجذب مسؤولي التوظيف."
            : "AI keeps your facts and tightens the wording for recruiters."
        }
        onEnhance={async () => {
          try {
            const res = await fetch('/api/cv/enhance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'summary',
                content: cv.summary,
                role: cv.contact.jobTitle,
                skills: cv.skills.flatMap((g) => g.skills).slice(0, 8),
              }),
            });
            const data = await res.json();
            if (data?.summary) {
              update((prev) => ({ ...prev, summary: data.summary }), 'summary-ai');
              if (data.enhancedBy === 'gemini-ai') {
                return isAr
                  ? 'تمت إعادة صياغة الملخص المهني بالذكاء الاصطناعي (Gemini) لتحقيق أعلى تأثير لدى مسؤولي التوظيف! 🎯'
                  : 'Summary rewritten with AI (Gemini) for maximum recruiter impact.';
              }
              return isAr
                ? 'تم تحسين الملخص بالكلمات المفتاحية والتنسيق المهني المعتمد.'
                : 'Summary optimized with keywords and professional structure.';
            }
          } catch (e) {
            console.error('Enhance summary failed:', e);
          }
          // Fallback to local polish
          update((prev) => ({ ...prev, summary: polishSummary(prev) }), 'summary-ai');
          return isAr
            ? 'تم تحسين صياغة الملخص واستهلاله بأهم مهاراتك وخبراتك.'
            : 'Summary rewritten with a sharper, keyword-rich opening.';
        }}
      />
    </div>
  );
}

function polishSummary(cv: CVData): string {
  const tools = cv.skills[0]?.skills.slice(0, 4).join(', ') ?? '';
  const base = cv.summary.trim().replace(/\s+/g, ' ');
  const sentences = base
    .split(/(?<=\.)\s+/)
    .filter((sentence) => sentence.trim() !== '');

  const opener = `${cv.contact.jobTitle} with ${cv.experience.length}+ roles delivering measurable business impact through analytics.`;
  const toolLine = tools
    ? `Core toolkit: ${tools}.`
    : 'Core toolkit spans analytics and reporting tools.';
  const keep = sentences.slice(1, 2).join(' ');

  return [opener, keep, toolLine].filter(Boolean).join(' ').slice(0, 600);
}
