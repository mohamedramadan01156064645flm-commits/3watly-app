"use client";

import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CircleCheckIcon, SparklesIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StepFooterProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  variant?: 'next' | 'finish';
  hint?: string;
  showBack?: boolean;
}

export function StepFooter({
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
  variant = 'next',
  hint,
  showBack = true
}: StepFooterProps) {
  const { isAr } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131C31] px-5 text-[14px] font-medium text-[#475569] dark:text-slate-300 shadow-sm transition-[background-color,border-color] duration-150 ease-smooth hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#18243E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
        >
          <ArrowLeftIcon className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} strokeWidth={2} aria-hidden="true" />
          {isAr ? "رجوع" : "Back"}
        </button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-4">
        {hint && <span className="text-[12.5px] font-light text-slate-400 dark:text-slate-500">{hint}</span>}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`flex h-12 items-center gap-2.5 rounded-xl px-6 text-[15px] font-bold text-white transition-[transform,filter,background-color] duration-150 ease-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 cursor-pointer ${
            nextDisabled
              ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600'
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-[#3B82F6] dark:hover:bg-blue-600 shadow-[0_14px_28px_-14px_rgba(27,87,224,0.75)] hover:brightness-105 active:translate-y-[1px]'
          }`}
        >
          {variant === 'finish' && (
            <CircleCheckIcon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
          )}
          {nextLabel}
          {variant === 'finish' ? (
            <SparklesIcon className="h-[17px] w-[17px]" strokeWidth={2} aria-hidden="true" />
          ) : (
            <ArrowRightIcon className={`h-[17px] w-[17px] ${isAr ? "rotate-180" : ""}`} strokeWidth={2.1} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}