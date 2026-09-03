"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  MapPin,
  Calendar,
  Download,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';
import { Dropdown } from '@/components/ui/Dropdown';
import { StatCards } from '@/components/market/StatCards';
import { TopSkillsCard } from '@/components/market/TopSkillsCard';
import { GrowthChart } from '@/components/market/GrowthChart';
import { BottomRow } from '@/components/market/BottomRow';
import {
  industries,
  regions,
  timeframes
} from '@/data/market';
import {
  Filters,
  StatSet,
  defaultFilters,
  getStats,
  getTopSkills,
  getSkillRanking,
  buildReportCsv,
  downloadFile
} from '@/utils/marketData';

const statTargets: Record<string, string> = {
  jobs: '/jobs',
  companies: '/jobs',
  remote: '/jobs',
  skill: '/skills'
};

export default function MarketPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { sendMessage } = useChat();

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedSkill, setSelectedSkill] = useState<string>('SQL');
  const [exporting, setExporting] = useState<boolean>(false);
  const [liveStats, setLiveStats] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('3watly_market_live_stats');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });

  // Fetch live market stats from /api/market/stats
  useEffect(() => {
    const params = new URLSearchParams({
      industry: filters.industry,
      region: filters.region,
      timeframe: filters.timeframe,
    });
    fetch(`/api/market/stats?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.stats) {
          setLiveStats(data);
          try {
            localStorage.setItem('3watly_market_live_stats', JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => {});
  }, [filters]);

  const isFiltered =
    filters.industry !== defaultFilters.industry ||
    filters.region !== defaultFilters.region ||
    filters.timeframe !== defaultFilters.timeframe;

  // Merge live stats from Supabase with computed fallback
  const computedStats = getStats(filters);
  const stats: StatSet = liveStats?.stats
    ? {
        ...computedStats,
        jobs: liveStats.stats.totalJobs || computedStats.jobs,
        companies: liveStats.stats.totalCompanies || computedStats.companies,
        remote: liveStats.stats.remoteJobsPercentage ?? computedStats.remote,
        topSkill: liveStats.stats.topSkillName
          ? { name: liveStats.stats.topSkillName, share: liveStats.stats.topSkillPercentage }
          : computedStats.topSkill,
      }
    : computedStats;

  // Merge live skills with computed ranking
  const computedTopSkills = getTopSkills(filters);
  const topSkills = liveStats?.topSkills?.length > 0
    ? liveStats.topSkills.map((s: any) => ({
        name: s.name,
        value: s.percentage || s.count,
        icon: '📊',
        color: '#3B82F6',
      }))
    : computedTopSkills;

  const ranking = getSkillRanking(filters);

  const setFilter = (key: keyof Filters) => (value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const exportReport = () => {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => {
      const name = `3watly-market-overview-${filters.industry}-${filters.region}-${filters.timeframe}d.csv`;
      downloadFile(name, buildReportCsv(filters));
      setExporting(false);
      toast.success(isAr ? 'تم تصدير تقرير السوق بنجاح' : 'Report exported successfully', {
        description: name
      });
    }, 550);
  };

  const handleStatSelect = (id: string) => {
    if (id === 'skill') {
      setSelectedSkill(ranking[0]?.name || 'SQL');
      toast.info(
        isAr
          ? `${ranking[0]?.name || 'SQL'} هي المهارة الأعلى طلباً (${ranking[0]?.value || 81}% من الوظائف).`
          : `${ranking[0]?.name || 'SQL'} is the top skill (${ranking[0]?.value || 81}% of postings require it).`
      );
      return;
    }
    router.push(statTargets[id] || '/jobs');
  };

  const getPlan = () => {
    const indObj = industries.find((i) => i.id === filters.industry);
    const regObj = regions.find((r) => r.id === filters.region);
    sendMessage(
      isAr
        ? `ابنِ لي خطة مهارات مخصصة لوظائف ${indObj?.label || 'التكنولوجيا'} في ${regObj?.label || 'مصر'} بناءً على بيانات السوق الحالية.`
        : `Build me a personalized skill plan for ${indObj?.label || 'Tech'} roles in ${regObj?.label || 'Egypt'} based on current market data.`
    );
    router.push('/copilot');
  };

  return (
    <AppShell
      title={isAr ? "مؤشرات وتحليلات سوق العمل" : "Market Overview"}
      subtitle={
        isAr
          ? "بيانات ورؤى حية وفورية حول حجم الطلب في سوق العمل المصري واتجاهات المهارات الأكثر نمواً."
          : "Real-time insights into job market demand and skill trends."
      }
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Top Controls: 3 Dropdowns + Export Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3.5 flex-1">
            <Dropdown
              className="flex-1 min-w-[210px]"
              variant="filter"
              label={isAr ? "القطاع / المجال" : "Industry"}
              icon={Briefcase}
              options={industries.map((i) => ({
                id: i.id,
                label: i.label,
                description: i.description
              }))}
              value={filters.industry}
              onChange={setFilter('industry')}
            />

            <Dropdown
              className="flex-1 min-w-[210px]"
              variant="filter"
              label={isAr ? "المنطقة" : "Region"}
              icon={MapPin}
              options={regions.map((r) => ({
                id: r.id,
                label: r.label,
                description: r.description
              }))}
              value={filters.region}
              onChange={setFilter('region')}
            />

            <Dropdown
              className="flex-1 min-w-[210px]"
              variant="filter"
              label={isAr ? "المدى الزمني" : "Timeframe"}
              icon={Calendar}
              options={timeframes.map((t) => ({
                id: t.id,
                label: t.label,
                description: t.description
              }))}
              value={filters.timeframe}
              onChange={setFilter('timeframe')}
            />
          </div>

          <div className="flex items-center gap-2.5">
            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setFilters(defaultFilters);
                  toast.info(isAr ? 'تمت إعادة تعيين الفلاتر للافتراضي' : 'Filters reset to default market');
                }}
                className="flex h-[52px] items-center gap-2 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] px-4 text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{isAr ? "إعادة الضبط" : "Reset"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={exportReport}
              disabled={exporting}
              className="flex h-[52px] shrink-0 items-center gap-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] px-5 text-[13.5px] font-bold text-slate-800 dark:text-slate-100 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-white/5 transition-all disabled:opacity-70 cursor-pointer"
            >
              {exporting ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-[#1B57E0]" />
              ) : (
                <Download className="h-4.5 w-4.5 text-slate-600 dark:text-slate-300" />
              )}
              <span>
                {exporting
                  ? (isAr ? 'جاري التحضير...' : 'Preparing...')
                  : (isAr ? 'تصدير التقرير (CSV)' : 'Export Report')}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards Row */}
        <div>
          <StatCards stats={stats} onSelect={handleStatSelect} />
        </div>

        {/* Middle Row: Top 8 In-Demand Skills (Left) + Fastest Growing Skills (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <TopSkillsCard
              skills={topSkills}
              ranking={ranking}
              selected={selectedSkill}
              onSelect={setSelectedSkill}
            />
          </div>
          <div className="lg:col-span-6">
            <GrowthChart filters={filters} />
          </div>
        </div>

        {/* Bottom Row: Market Insights + Need a personalized plan */}
        <div>
          <BottomRow stats={stats} onGetPlan={getPlan} />
        </div>
      </div>
    </AppShell>
  );
}
