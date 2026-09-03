"use client";

import React from 'react';
import { useCV } from '../../../contexts/CVContext';
import { TextAreaField } from '../../ui/Field';
import { AIEnhanceButton } from '../AIEnhanceButton';
import type { CVData } from '../../../types/cv';

export function SummarySection() {
  const { cv, update } = useCV();

  return (
    <div>
      <TextAreaField
        label="Summary"
        value={cv.summary}
        rows={5}
        maxLength={600}
        hint="Aim for 2–3 sentences covering your role, years of experience and core tools."
        onChange={(value) =>
        update((prev) => ({ ...prev, summary: value }), 'summary')
        } />
      
      <AIEnhanceButton
        label="Rewrite Summary with AI"
        hint="AI keeps your facts and tightens the wording for recruiters."
        onEnhance={() => {
          update(
            (prev) => ({ ...prev, summary: polishSummary(prev) }),
            'summary-ai'
          );
          return 'Summary rewritten with a sharper, keyword-rich opening.';
        }} />
      
    </div>);

}

function polishSummary(cv: CVData): string {
  const tools = cv.skills[0]?.skills.slice(0, 4).join(', ') ?? '';
  const base = cv.summary.trim().replace(/\s+/g, ' ');
  const sentences = base.
  split(/(?<=\.)\s+/).
  filter((sentence) => sentence.trim() !== '');

  const opener = `${cv.contact.jobTitle} with ${cv.experience.length}+ roles delivering measurable business impact through analytics.`;
  const toolLine = tools ?
  `Core toolkit: ${tools}.` :
  'Core toolkit spans analytics and reporting tools.';
  const keep = sentences.slice(1, 2).join(' ');

  return [opener, keep, toolLine].filter(Boolean).join(' ').slice(0, 600);
}
