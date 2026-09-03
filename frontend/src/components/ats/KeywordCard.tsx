"use client";

import React, { useState } from 'react';
import { Lightbulb, PartyPopper } from 'lucide-react';
import { DiagnosticCard } from './DiagnosticCard';
import type { Analysis } from '../../utils/atsAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

const VISIBLE = 4;

export function KeywordCard({ analysis }: { analysis: Analysis }) {
  const { isAr } = useLanguage();
  const { found, missing, role } = analysis.keywords;
  const [showAllFound, setShowAllFound] = useState(false);
  const [showAllMissing, setShowAllMissing] = useState(false);

  const foundShown = showAllFound ? found : found.slice(0, VISIBLE);
  const missingShown = showAllMissing ? missing : missing.slice(0, 3);

  return (
    <DiagnosticCard
      index={3}
      title={isAr ? "تحسين الكلمات المفتاحية" : "Keyword Optimization"}
      tooltip={
        isAr
          ? "تتم مطابقة سيرتك الذاتية مع أكثر الكلمات المفتاحية تكراراً في إعلانات وظائف " + role + " في السوق المصري."
          : "Your CV is matched against the keywords that appear most often in " + role + " postings in the Egyptian market."
      }
      subtitle={isAr ? "مطابقة المهارات مع متطلبات السوق المصري لوظائف " + role + "." : "Match against Egyptian tech market for " + role + "."}
      footer={{
        tone: missing.length > 0 ? 'amber' : 'emerald',
        icon: missing.length > 0 ? Lightbulb : PartyPopper,
        text:
          missing.length > 0
            ? (isAr ? 'أضف هذه الكلمات المفتاحية لزيادة ظهورك في ترشيحات الـ ATS ومسؤولي التوظيف.' : 'Add these keywords to increase your visibility in ATS and recruiter search.')
            : (isAr ? 'سيرتك تغطي كافة الكلمات المفتاحية الأساسية المطلوبة لهذه الوظيفة!' : 'You cover every keyword recruiters search for in this role.')
      }}
    >
      <div>
        <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
          {isAr ? "الكلمات المفتاحية المكتشفة" : "Found Keywords"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {foundShown.map((keyword) => (
            <span
              key={keyword}
              className="rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-[12.5px] font-bold text-emerald-700 dark:text-emerald-400"
            >
              {keyword}
            </span>
          ))}
          {found.length > VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAllFound((v) => !v)}
              className="rounded-xl bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[12px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer"
            >
              {showAllFound ? (isAr ? 'عرض أقل' : 'Show less') : '+' + (found.length - VISIBLE) + (isAr ? ' المزيد' : ' more')}
            </button>
          )}
        </div>

        <p className="mt-4 text-[13px] font-bold text-amber-600 dark:text-amber-400">
          {isAr ? "الكلمات المفتاحية الناقصة الهامة" : "Missing Critical Keywords"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {missingShown.map((keyword) => (
            <span
              key={keyword}
              className="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 text-[12.5px] font-bold text-amber-700 dark:text-amber-400"
            >
              {keyword}
            </span>
          ))}
          {missing.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllMissing((v) => !v)}
              className="rounded-xl bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[12px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer"
            >
              {showAllMissing ? (isAr ? 'عرض أقل' : 'Show less') : '+' + (missing.length - 3) + (isAr ? ' المزيد' : ' more')}
            </button>
          )}
        </div>
      </div>
    </DiagnosticCard>
  );
}
