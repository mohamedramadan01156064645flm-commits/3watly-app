"use client";

import React from 'react';
import { Briefcase, TrendingUp, Clock, Target, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import Link from 'next/link';

interface BottomInsightsRowProps {
  onOpenTargetRole?: () => void;
}

export function BottomInsightsRow({ onOpenTargetRole }: BottomInsightsRowProps) {
  const { isAr } = useLanguage();
  const { plan } = useSkillPlan();
  const role = plan?.role;

  const [liveStats, setLiveStats] = React.useState<{
    openJobs: number;
    yoyGrowth: number;
    timeToHireDays: number;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    const roleId = role?.id || '';
    fetch(`/api/market/stats?role=${encodeURIComponent(roleId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.roleStats) {
          setLiveStats(data.roleStats);
        } else if (data?.stats) {
          setLiveStats({
            openJobs: data.stats.openJobs || data.stats.totalJobs || 0,
            yoyGrowth: data.stats.yoyGrowth || 18,
            timeToHireDays: data.stats.timeToHireDays || 25,
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch live market stats:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [role?.id]);

  // Real data pulled from live database via API, with fallback to role definition
  const openJobs = liveStats
    ? liveStats.openJobs.toLocaleString('en-US')
    : (role?.openJobs?.toLocaleString('en-US') ?? '—');
  const yoyGrowth = liveStats ? liveStats.yoyGrowth : (role?.yoyGrowth ?? 18);
  const timeToHire = liveStats ? liveStats.timeToHireDays : (role?.timeToHireDays ?? 25);
  const city = isAr ? (role?.cityAr ?? role?.city ?? 'القاهرة') : (role?.city ?? 'Cairo');
  const roleName = isAr ? (role?.nameAr ?? role?.name ?? '') : (role?.name ?? '');

  const sectionTitle = isAr
    ? `مؤشرات سوق العمل لوظيفة "${roleName}" في ${city}`
    : `Market Insights · ${roleName} · ${city}`;

  const timeLabel = isAr ? `${timeToHire} يوماً` : `${timeToHire} Days`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* ── Market Insights Card ── */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs">

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
              {isAr ? 'بيانات سوق العمل · مُحدَّثة تلقائياً' : 'Live Market Data · Auto-updated'}
            </p>
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
              {sectionTitle}
            </h3>
          </div>
          <Link
            href="/jobs"
            className="shrink-0 hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all"
          >
            <span>{isAr ? 'تصفح الوظائف' : 'Browse Jobs'}</span>
            <ArrowRight className={`h-3.5 w-3.5 ${isAr ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Open Jobs */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#060C17] p-4 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shadow-2xs">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              {loading && !liveStats ? (
                <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 animate-pulse rounded my-0.5" />
              ) : (
                <p className="text-base font-black text-slate-900 dark:text-white tabular-nums">{openJobs}</p>
              )}
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {isAr ? 'وظيفة متاحة' : 'Open Jobs'}
              </p>
            </div>
          </div>

          {/* 2. YoY Growth */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#060C17] p-4 border border-slate-100 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              {loading && !liveStats ? (
                <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded my-0.5" />
              ) : (
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">+{yoyGrowth}%</p>
              )}
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {isAr ? 'نمو سنوي' : 'Growth YoY'}
              </p>
            </div>
          </div>

          {/* 3. Time to Hire */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-[#060C17] p-4 border border-slate-100 dark:border-white/5 hover:border-purple-200 dark:hover:border-purple-500/20 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              {loading && !liveStats ? (
                <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 animate-pulse rounded my-0.5" />
              ) : (
                <p className="text-base font-black text-slate-900 dark:text-white tabular-nums">{timeLabel}</p>
              )}
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {isAr ? 'متوسط التوظيف' : 'Time to Hire'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="lg:col-span-5 relative overflow-hidden flex flex-col justify-between gap-6 rounded-2xl p-6 shadow-md bg-[#0F172A] dark:bg-[#090F1D] border border-blue-900/40">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-xs">
            <Target className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-[15px] font-extrabold text-white leading-tight">
              {isAr ? 'سد الفجوة. ضاعف فرص قبولك.' : 'Close the Gap. Get Hired Faster.'}
            </h4>
            <p className="mt-1.5 text-[12.5px] text-slate-400 leading-relaxed max-w-xs">
              {isAr
                ? `إتقان المهارات الناقصة يُضاعف فرص ظهور ملفك في وظائف ${roleName} بنسبة تصل إلى 3.6×.`
                : `Completing your skill gaps can multiply your job match rate for ${roleName} roles by up to 3.6×.`}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenTargetRole?.()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white px-5 py-2.5 text-[13px] font-bold transition-all shadow-md shadow-blue-900/40 cursor-pointer"
          >
            <span>{isAr ? 'غيّر المسمى الوظيفي' : 'Change Target Role'}</span>
            <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
          </button>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-5 py-2.5 text-[13px] font-bold transition-all cursor-pointer"
          >
            {isAr ? 'استكشاف الوظائف' : 'Explore Jobs'}
          </Link>
        </div>
      </div>
    </div>
  );
}
