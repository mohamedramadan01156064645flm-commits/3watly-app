"use client";

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ScoreRing } from './ScoreRing';
import { InfoTip } from '../ui/InfoTip';
import { BAND_COLORS, SCORE_LEGEND, type Analysis } from '../../utils/atsAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScoreOverviewProps {
  analysis: Analysis;
  runKey: number;
}

export function ScoreOverview({ analysis, runKey }: ScoreOverviewProps) {
  const { isAr } = useLanguage();
  const colors = BAND_COLORS[analysis.band];

  return (
    <section
      aria-label="ATS compatibility score"
      className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-card"
    >
      <div className="flex flex-col gap-8 xl:flex-row xl:items-center">
        <div className="flex flex-1 flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-9">
          <ScoreRing
            score={analysis.score}
            band={analysis.band}
            runKey={runKey}
          />

          <div className="min-w-0 flex-1 text-center sm:text-left rtl:sm:text-right">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isAr ? analysis.headlineAr : analysis.headline}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {isAr ? analysis.descriptionAr : analysis.description}
            </p>
            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 ${colors.soft} dark:bg-emerald-950/40 ${colors.border} dark:border-emerald-800/40`}
            >
              <TrendingUp className={`h-4 w-4 ${colors.text} dark:text-emerald-400`} aria-hidden="true" />
              <span className={`text-[13px] font-bold ${colors.text} dark:text-emerald-300`}>
                {isAr
                  ? `أفضل ${analysis.percentile}% من المتقدمين لوظائف ${analysis.keywords.role}`
                  : `Top ${analysis.percentile}% of candidates in ${analysis.keywords.role} roles`}
              </span>
              <InfoTip
                align={isAr ? "left" : "right"}
                label={
                  isAr
                    ? `مقارنة مع سير ذاتية لوظائف ${analysis.keywords.role} في السوق المصري خلال الـ 90 يوماً الماضية.`
                    : `Benchmarked against ${analysis.keywords.role} CVs in the Egyptian market over the last 90 days.`
                }
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-white/5 pt-6 xl:border-t-0 xl:border-l rtl:xl:border-l-0 rtl:xl:border-r xl:border-slate-100 dark:xl:border-white/5 xl:pt-0 xl:pl-8 rtl:xl:pr-8 rtl:xl:pl-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isAr ? "ماذا تعني هذه النتيجة؟" : "What does this score mean?"}
          </h3>
          <ul className="mt-3 space-y-2 text-xs">
            {SCORE_LEGEND.map((row) => (
              <li key={row.band} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${BAND_COLORS[row.band].dot}`} />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{isAr ? row.labelAr : row.label}</span>
                </div>
                <span className="font-mono text-slate-400 dark:text-slate-500">{row.range}</span>
                <span className="text-slate-500 dark:text-slate-400">{isAr ? row.noteAr : row.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
