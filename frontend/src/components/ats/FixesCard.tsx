"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
  Loader2,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';
import type { FixId } from '../../types/cv';
import type { Analysis } from '../../utils/atsAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

interface FixesCardProps {
  analysis: Analysis;
  onApply: (id: FixId) => Promise<string> | string;
}

export function FixesCard({ analysis, onApply }: FixesCardProps) {
  const { isAr } = useLanguage();
  const [applying, setApplying] = useState<string | null>(null);
  const fixes = analysis.fixes;

  const apply = async (fix: Analysis['fixes'][number], key: string) => {
    if (applying) return;
    setApplying(key);
    try {
      const message = await onApply(fix.id);
      toast.success(message);
    } catch (err: any) {
      toast.error(err?.message || (isAr ? 'حدث خطأ أثناء تطبيق الإصلاح' : 'Failed to apply fix'));
    } finally {
      setApplying(null);
    }
  };

  const getCategoryLabel = (id: string) => {
    if (id.includes('keyword')) return isAr ? 'كلمات مفتاحية' : 'Keywords';
    if (id.includes('summary')) return isAr ? 'الملخص المهني' : 'Summary';
    if (id.includes('skills')) return isAr ? 'المهارات التقنية' : 'Skills';
    if (id.includes('metrics') || id.includes('bullets')) return isAr ? 'الخبرات والإنجازات' : 'Experience';
    if (id.includes('linkedin')) return isAr ? 'بيانات التواصل' : 'Contact';
    return isAr ? 'تحسين عام' : 'Optimization';
  };

  return (
    <section
      aria-label="Recommended fixes"
      className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-card overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4.5 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
            {fixes.length === 0
              ? (isAr ? 'حالة السيرة الذاتية: معايير الـ ATS الأساسية مكتملة' : 'ATS Status: Core Standards Satisfied')
              : (isAr ? `أهم ${fixes.length} إصلاحات ذكية موصى بها لتحسين السيرة الذاتية` : `Top ${fixes.length} Recommended AI Fixes to Maximize ATS Score`)}
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
            <Bot className="w-3 h-3" />
            {isAr ? 'مدعوم بـ Gemini AI' : 'Gemini AI'}
          </span>
        </div>

        <Link
          href="/cv-builder"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline"
        >
          <span>{isAr ? 'فتح محرر الـ CV' : 'Open CV Builder'}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>


      {fixes.length > 0 ? (
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
                  className="flex flex-wrap items-center justify-between gap-4 p-4.5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-[#070C18] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-start gap-3.5 min-w-0 max-w-2xl">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70 text-[12px] font-bold text-[#1B57E0] dark:text-[#60A5FA]">
                      #{index + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                          {getCategoryLabel(fix.id)}
                        </span>
                        <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">
                          {isAr ? fix.titleAr || fix.title : fix.title}
                        </h4>
                      </div>

                      {fix.highlight && (
                        <div className="flex flex-wrap gap-1.5 py-1">
                          {fix.highlight.split(',').map((h, hIdx) => (
                            <span
                              key={hIdx}
                              className="px-2 py-0.5 rounded-md text-[11.5px] font-bold bg-blue-100/70 dark:bg-blue-900/40 text-[#1B57E0] dark:text-[#93C5FD]"
                            >
                              + {h.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isAr ? fix.whyAr || fix.why : fix.why}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 ltr:ml-auto rtl:mr-auto">
                    <button
                      type="button"
                      onClick={() => apply(fix, key)}
                      disabled={Boolean(applying)}
                      aria-busy={isApplying}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[12.5px] font-bold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {isApplying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span>{isApplying ? (isAr ? 'جاري التطبيق والتحديث...' : 'Applying…') : (isAr ? 'تطبيق الإصلاح فوراً' : 'Apply Fix')}</span>
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-[16px] font-bold text-slate-900 dark:text-white">
              {isAr ? 'سيرتك الذاتية مستوفية لجميع معايير الـ ATS الأساسية' : 'Your CV meets all core ATS benchmarks'}
            </h4>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'تم تطبيق المعايير الموصى بها لهيكل السيرة، الكلمات المفتاحية، وبيانات الاتصال. يمكنك الآن تخصيصها لوظيفة محددة بواسطة المساعد الذكي.'
                : 'Structure, essential keywords, and parser requirements are fully aligned. Use the AI Copilot to tailor it for a specific dream role.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/copilot"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-bold shadow-sm transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>{isAr ? 'استشارة المساعد المهني الذكي (Copilot)' : 'Consult AI Copilot'}</span>
            </Link>

            <Link
              href="/cv-builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-[13px] font-bold transition-all"
            >
              <span>{isAr ? 'معاينة وتعديل في محرر الـ CV' : 'Open in CV Builder'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#070C18] px-6 py-3.5 border-t border-slate-100 dark:border-white/5">
        <p className="inline-flex items-center gap-2 text-[12.5px] text-slate-500 dark:text-slate-400">
          <Info className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span>
            {isAr
              ? 'يتم تحديث السيرة الذاتية النشطة فورياً عند الضغط على "تطبيق الإصلاح" ومزامنتها مع المحرر وتحليلات الوظائف.'
              : 'Clicking "Apply Fix" immediately updates your active CV and synchronizes with CV Builder and Job matching.'}
          </span>
        </p>
      </div>
    </section>
  );
}
