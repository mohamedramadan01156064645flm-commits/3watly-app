"use client";

import React from 'react';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  FileTextIcon,
  XCircleIcon } from
'lucide-react';
import { DiagnosticCard } from './DiagnosticCard';
import { InfoTip } from '../ui/InfoTip';
import type { Analysis } from '../../utils/atsAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

export function StructureCard({ analysis }: {analysis: Analysis;}) {
  const { isAr } = useLanguage();
  const { items, passed, total } = analysis.structure;
  const allPassed = passed === total;

  return (
    <DiagnosticCard
      index={1}
      title={isAr ? "هيكل المستند" : "Document Structure"}
      pill={{
        label: isAr ? `${passed}/${total} مكتمل` : `${passed}/${total} Passed`,
        tone: allPassed ? 'emerald' : 'amber'
      }}
      subtitle={
        isAr
          ? "تقييم البنية البرمجية وجودة القراءة الآلية لسيرتك الذاتية."
          : "Assessing the technical structure and readability of your CV."
      }
      footer={{
        tone: allPassed ? 'emerald' : 'amber',
        icon: allPassed ? CircleCheckBigIcon : AlertTriangleIcon,
        art: FileTextIcon,
        text: allPassed
          ? isAr
            ? 'ممتاز! هيكل سيرتك الذاتية متوافق تماماً مع أنظمة الـ ATS.'
            : 'Perfect! Your document structure is fully ATS compliant.'
          : isAr
            ? 'عدّل العناصر المحددة لتتمكن الأنظمة من قراءة كافة الأقسام.'
            : 'Resolve the flagged items so parsers can read every section.'
      }}>
      
      <ul className="space-y-3">
        {items.map((item) =>
        <li key={item.id} className="flex items-center gap-2.5">
            {item.passed ?
          <CheckCircle2Icon
            className="h-5 w-5 shrink-0 text-emerald-500"
            aria-hidden="true" /> :

          <XCircleIcon
            className="h-5 w-5 shrink-0 text-amber-500"
            aria-hidden="true" />
          }
            <span
            className={`text-sm ${
            item.passed ? 'text-slate-700 dark:text-slate-200' : 'font-medium text-amber-700'}`
            }>
              {isAr ? (item.labelAr || item.label) : item.label}
            </span>
            {(item.hintAr || item.hint) && (
              <InfoTip label={isAr ? (item.hintAr || item.hint!) : item.hint!} />
            )}
            <span className="sr-only">
              {item.passed ? 'Passed' : 'Needs attention'}
            </span>
          </li>
        )}
      </ul>
    </DiagnosticCard>);

}
