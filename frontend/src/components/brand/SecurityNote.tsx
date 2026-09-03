"use client";

import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SecurityNoteProps {
  subtext?: string;
  align?: 'center' | 'left';
}

export function SecurityNote({ subtext, align = 'center' }: SecurityNoteProps) {
  const { isAr } = useLanguage();
  return (
    <div
      className={`flex gap-2 ${
      align === 'center' ? 'items-center justify-center' : 'items-start justify-start'}`
      }>
      
      <ShieldCheckIcon
        className="h-4 w-4 shrink-0 text-brand-indigo"
        strokeWidth={1.9}
        aria-hidden="true" />
      
      <div>
        <p className="text-[12.5px] font-medium leading-4 text-brand-indigo">
          {isAr ? "بياناتك محمية وتخضع لأعلى معايير الخصوصية" : "Your data is secure and confidential"}
        </p>
        {subtext && <p className="mt-1 text-[11.5px] font-light text-ink-muted">{subtext}</p>}
      </div>
    </div>);
}