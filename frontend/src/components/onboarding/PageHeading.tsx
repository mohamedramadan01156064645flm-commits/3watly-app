"use client";

import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeadingProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  aside?: React.ReactNode;
}

export function PageHeading({ icon, title, subtitle, aside }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {icon &&
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#E3EAFA] dark:border-white/10 bg-[#F1F5FE] dark:bg-[#111A2E]">
            {icon}
          </span>
        }
        <div>
          <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-ink dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-[14px] font-light text-ink-muted dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {aside}
    </div>);
}

export function SecureBadge() {
  const { isAr } = useLanguage();
  return (
    <span className="flex items-center gap-2">
      <ShieldCheckIcon
        className="h-[17px] w-[17px] text-brand-indigo dark:text-indigo-400"
        strokeWidth={1.8}
        aria-hidden="true" />
      
      <span className="text-[13px] font-medium text-brand-indigo dark:text-indigo-400">
        {isAr ? "بياناتك محمية وتخضع لأعلى معايير الخصوصية" : "Your data is secure and confidential"}
      </span>
    </span>);
}