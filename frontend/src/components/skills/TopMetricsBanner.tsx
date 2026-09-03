"use client";

import React from 'react';
import { Target, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SkillPlan } from '@/types/skills';

interface TopMetricsBannerProps {
  plan: SkillPlan;
  onChangeTarget: () => void;
}

export function TopMetricsBanner({ plan, onChangeTarget }: TopMetricsBannerProps) {
  const { isAr } = useLanguage();

  const totalCore = plan.role?.coreSkills?.length || 10;
  const coveredCount = plan.covered?.length || 0;
  const gapsCount = (plan.priorities?.length || 0) + (plan.future?.length || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Target Role Card */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs transition-colors">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
            <Target className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {isAr ? "المسمى المستهدف" : "Target Role"}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
              {plan.role?.name || "Data Engineer"}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeTarget}
          className="shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/30 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
        >
          {isAr ? "تغيير" : "Change"}
        </button>
      </div>

      {/* 2. Market Demands Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs transition-colors">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
          <Briefcase className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {isAr ? "متطلبات السوق" : "Market Demands"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalCore}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "مهارات أساسية" : "Core Skills"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. You Have Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs transition-colors">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {isAr ? "تمتلك منها" : "You Have"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {coveredCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "مهارات مكتسبة" : "Acquired"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Gaps Identified Card */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs transition-colors">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {isAr ? "الفجوات المحددة" : "Gaps Identified"}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {gapsCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "مهارات للتطوير" : "To Develop"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
