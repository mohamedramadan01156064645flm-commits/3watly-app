"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import type { FixId } from '../../types/cv';
import type { Analysis } from '../../utils/atsAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

interface FixesCardProps {
  analysis: Analysis;
  onApply: (id: FixId) => string;
}

export function FixesCard({ analysis, onApply }: FixesCardProps) {
  const { isAr } = useLanguage();
  const [applying, setApplying] = useState<string | null>(null);
  const fixes = analysis.fixes;

  const apply = (fix: Analysis['fixes'][number], key: string) => {
    if (applying) return;
    setApplying(key);
    window.setTimeout(() => {
      const message = onApply(fix.id);
      setApplying(null);
      toast.success(message);
    }, 650);
  };

  return (
    <section
      aria-label="Recommended fixes"
      className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-card overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-6 py-4.5 border-b border-slate-100 dark:border-white/5">
        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
        <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
          {fixes.length === 0
            ? (isAr ? 'لا توجد إصلاحات متبقية — سيرتك الذاتية متوافقة تماماً' : 'No fixes left — your CV is fully optimized')
            : (isAr ? 'أهم ' + fixes.length + ' إصلاحات موصى بها' : 'Top ' + fixes.length + ' Recommended ' + (fixes.length === 1 ? 'Fix' : 'Fixes'))}
        </h3>
      </div>

      {fixes.length > 0 && (
        <ul className="divide-y divide-slate-100 dark:divide-white/5 p-4 sm:p-6 space-y-3">
          <AnimatePresence initial={false}>
            {fixes.map((fix, index) => {
              const key = fix.id + '-' + index;
              const isApplying = applying === key;
              return (
                <motion.li
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-[#070C18] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-start gap-3.5 min-w-0 max-w-2xl">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70 text-[12px] font-bold text-[#1B57E0] dark:text-[#60A5FA]">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">
                        {isAr ? fix.titleAr || fix.title : fix.title}
                      </h4>
                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {isAr ? fix.whyAr || fix.why : fix.why}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ltr:ml-auto rtl:mr-auto">
                    <button
                      type="button"
                      onClick={() => apply(fix, key)}
                      disabled={Boolean(applying)}
                      aria-busy={isApplying}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[12.5px] font-bold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {isApplying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span>{isApplying ? (isAr ? 'جاري التطبيق...' : 'Applying…') : (isAr ? 'تطبيق الإصلاح' : 'Apply Fix')}</span>
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#070C18] px-6 py-3.5 border-t border-slate-100 dark:border-white/5">
        <p className="inline-flex items-center gap-2 text-[12.5px] text-slate-500 dark:text-slate-400">
          <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {isAr
            ? 'جميع الإصلاحات مقترحة بالذكاء الاصطناعي بناءً على بيانات سوق العمل المصري ومعايير الـ ATS.'
            : 'All fixes are AI-recommended based on Egyptian market data and ATS best practices.'}
        </p>
      </div>
    </section>
  );
}
