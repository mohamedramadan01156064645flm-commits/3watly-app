"use client";

import React from 'react';
import {
  AlertTriangleIcon,
  BotIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  CodeIcon,
  GraduationCapIcon,
  UserIcon,
  XCircleIcon } from
'lucide-react';
import { DiagnosticCard } from './DiagnosticCard';
import type { Analysis, ParserIcon } from '../../utils/atsAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

const ROW_ICONS: Record<ParserIcon, React.ComponentType<{className?: string;}>> =
{
  contact: UserIcon,
  experience: BriefcaseIcon,
  education: GraduationCapIcon,
  skills: CodeIcon
};

export function ParserCard({ analysis }: {analysis: Analysis;}) {
  const { isAr } = useLanguage();
  const { items, passed, total } = analysis.parser;
  const allPassed = passed === total;

  return (
    <DiagnosticCard
      index={2}
      title={isAr ? "اختبار الاستخراج الآلي" : "Parser Extraction Test"}
      pill={{
        label: isAr ? `${passed}/${total} مستخرج` : `${passed}/${total} Passed`,
        tone: allPassed ? 'emerald' : 'amber'
      }}
      subtitle={
        isAr
          ? "التحقق من قدرة برامج الـ ATS على استخراج بياناتك بدون أخطاء."
          : "Checking how well ATS systems can extract your information."
      }
      footer={{
        tone: allPassed ? 'emerald' : 'amber',
        icon: allPassed ? CircleCheckBigIcon : AlertTriangleIcon,
        art: BotIcon,
        text: allPassed
          ? isAr
            ? 'ممتاز! أنظمة الـ ATS تستخرج كافة بياناتك الرئيسية بسلاسة.'
            : 'Excellent! ATS can easily parse your key information.'
          : isAr
            ? 'بعض الحقول لم يتم التعرف عليها — أكملها لتجنب الاستبعاد.'
            : 'Some fields could not be extracted — complete them to avoid being filtered out.'
      }}>
      
      <ul className="space-y-3.5">
        {items.map((item) => {
          const Icon = ROW_ICONS[item.icon ?? 'contact'];
          return (
            <li key={item.id} className="flex items-center gap-2.5">
              <Icon
                className="h-[18px] w-[18px] shrink-0 text-slate-500 dark:text-slate-400"
                aria-hidden="true" />
              
              <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-200">
                {isAr ? (item.labelAr || item.label) : item.label}
              </span>
              {(item.detailAr || item.detail) && (
                <span className="shrink-0 text-[13px] text-slate-500 dark:text-slate-400">
                  {isAr ? (item.detailAr || item.detail) : item.detail}
                </span>
              )}
              {item.passed ? (
                <CheckCircle2Icon
                  className="h-[18px] w-[18px] shrink-0 text-emerald-500"
                  aria-label={isAr ? "تم الكشف" : "Detected"} />
              ) : (
                <XCircleIcon
                  className="h-[18px] w-[18px] shrink-0 text-amber-500"
                  aria-label={isAr ? "لم يتم الكشف" : "Not detected"} />
              )}
            </li>);

        })}
      </ul>
    </DiagnosticCard>);

}
