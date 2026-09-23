"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2,
  MapPin,
  GraduationCap,
  Download,
  RotateCcw,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/contexts/ChatContext';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { Dropdown } from '@/components/ui/Dropdown';
import { StatCards } from '@/components/market/StatCards';
import { TopSkillsCard } from '@/components/market/TopSkillsCard';
import { GrowthChart } from '@/components/market/GrowthChart';
import { BottomRow } from '@/components/market/BottomRow';
import { PremiumSkillPlanModal } from '@/components/skills/PremiumSkillPlanModal';
import {
  careerTracks,
  workModels,
  experienceLevels,
} from '@/data/market';
import {
  Filters,
  StatSet,
  defaultFilters,
  getStats,
  getTopSkills,
  getSkillRanking,
  buildReportCsv,
  downloadFile,
} from '@/utils/marketData';

export default function MarketPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { sendMessage } = useChat();

  const { plan } = useSkillPlan();

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedSkill, setSelectedSkill] = useState<string>('SQL');
  const [exporting, setExporting] = useState<boolean>(false);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [liveStats, setLiveStats] = useState<any>(null);

  // Synchronize initial track with user's target role
  useEffect(() => {
    if (plan?.role?.id) {
      const roleTrackMap: Record<string, string> = {
        'data-engineer': 'data-ai',
        'bi-developer': 'data-ai',
        'senior-data-analyst': 'data-ai',
        'analytics-engineer': 'data-ai',
        'ai-ml-engineer': 'data-ai',
        'frontend-developer': 'frontend',
        'backend-developer': 'backend',
        'flutter-developer': 'mobile',
        'fullstack-developer': 'all',
      };
      const matched = roleTrackMap[plan.role.id];
      if (matched) {
        setFilters((prev) => ({ ...prev, track: matched }));
      }
    }
  }, [plan?.role?.id]);

  // Fetch live market stats from /api/market/stats
  useEffect(() => {
    // Check localStorage cache on client after mount
    try {
      const cached = localStorage.getItem('3watly_market_live_stats_v2');
      if (cached && !liveStats) {
        setLiveStats(JSON.parse(cached));
      }
    } catch {}

    const params = new URLSearchParams({
      track: filters.track,
      workModel: filters.workModel,
      experience: filters.experience,
      role: plan?.role?.id || '',
    });
    fetch(`/api/market/stats?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.stats) {
          setLiveStats(data);
          try {
            localStorage.setItem('3watly_market_live_stats_v2', JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => {});
  }, [filters, plan?.role?.id]);

  const isFiltered =
    filters.track !== defaultFilters.track ||
    filters.workModel !== defaultFilters.workModel ||
    filters.experience !== defaultFilters.experience;

  // Active track object
  const activeTrackObj = careerTracks.find((t) => t.id === filters.track) || careerTracks[0];

  // Merge live stats with computed fallback
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
    ? liveStats.topSkills
    : computedTopSkills;

  const ranking = liveStats?.topSkills?.length > 0
    ? liveStats.topSkills
    : getSkillRanking(filters);

  // Automatically update selectedSkill when track changes
  useEffect(() => {
    if (topSkills && topSkills.length > 0) {
      setSelectedSkill(topSkills[0].name);
    }
  }, [filters.track]);

  const setFilter = (key: keyof Filters) => (value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const exportReport = () => {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => {
      const name = `3watly-tech-market-${filters.track}-${filters.workModel}-${filters.experience}.csv`;
      downloadFile(name, buildReportCsv(filters));
      setExporting(false);
      toast.success(isAr ? 'تم تصدير تقرير السوق بنجاح' : 'Market report exported successfully', {
        description: name,
      });
    }, 550);
  };

  const handleStatSelect = (id: string) => {
    if (id === 'jobs') {
      router.push('/jobs');
      return;
    }
    if (id === 'skill') {
      setSelectedSkill(ranking[0]?.name || 'SQL');
      toast.info(
        isAr
          ? `${ranking[0]?.name || 'SQL'} هي المهارة الأعلى طلباً (${ranking[0]?.value || 84}% من الوظائف).`
          : `${ranking[0]?.name || 'SQL'} is the top skill (${ranking[0]?.value || 84}% of postings require it).`
      );
      return;
    }
  };

  const getPlan = () => {
    setShowPlanModal(true);
  };

  return (
    <AppShell
      title={isAr ? "مؤشرات وتحليلات سوق العمل التقني" : "Tech Market Intelligence"}
      subtitle={
        isAr
          ? "رؤى حية ومباشرة لحجم الطلب في سوق العمل التقني المصري والمهارات الأكثر توظيفاً ونمواً."
          : "Real-time insights into Egyptian tech hiring demand, top required skills, and growth velocity."
      }
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Top Controls: 3 Smart Tech Dropdowns + Reset + Export Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3.5 flex-1">
            {/* Filter 1: Career Track / Specialization */}
            <Dropdown
              className="flex-1 min-w-[230px]"
              variant="filter"
              label={isAr ? "المسار المهني / التخصص" : "Career Track"}
              icon={Code2}
              options={careerTracks.map((t) => ({
                id: t.id,
                label: isAr ? t.labelAr : t.label,
                description: isAr ? t.descriptionAr : t.description,
              }))}
              value={filters.track}
              onChange={setFilter('track')}
            />

            {/* Filter 2: Work Model & Location */}
            <Dropdown
              className="flex-1 min-w-[210px]"
              variant="filter"
              label={isAr ? "نمط ومقر العمل" : "Work Model & Location"}
              icon={MapPin}
              options={workModels.map((w) => ({
                id: w.id,
                label: isAr ? w.labelAr : w.label,
                description: isAr ? w.descriptionAr : w.description,
              }))}
              value={filters.workModel}
              onChange={setFilter('workModel')}
            />

            {/* Filter 3: Experience Level */}
            <Dropdown
              className="flex-1 min-w-[200px]"
              variant="filter"
              label={isAr ? "مستوى الخبرة" : "Experience Level"}
              icon={GraduationCap}
              options={experienceLevels.map((e) => ({
                id: e.id,
                label: isAr ? e.labelAr : e.label,
                description: isAr ? e.descriptionAr : e.description,
              }))}
              value={filters.experience}
              onChange={setFilter('experience')}
            />
          </div>

          <div className="flex items-center gap-2.5">
            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setFilters(defaultFilters);
                  toast.info(isAr ? 'تمت إعادة تعيين الفلاتر للافتراضي' : 'Filters reset to default');
                }}
                className="flex h-[54px] items-center gap-2 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] px-4 text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{isAr ? "إعادة الضبط" : "Reset"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={exportReport}
              disabled={exporting}
              className="flex h-[54px] shrink-0 items-center gap-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] px-5 text-[13.5px] font-bold text-slate-800 dark:text-slate-100 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-white/5 transition-all disabled:opacity-70 cursor-pointer"
            >
              {exporting ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-[#1B57E0]" />
              ) : (
                <Download className="h-4.5 w-4.5 text-slate-600 dark:text-slate-300" />
              )}
              <span>
                {exporting
                  ? (isAr ? 'جاري التحضير...' : 'Preparing...')
                  : (isAr ? 'تصدير تقرير السوق (CSV)' : 'Export Report')}
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
              trackLabel={isAr ? activeTrackObj.labelAr : activeTrackObj.label}
            />
          </div>
          <div className="lg:col-span-6">
            <GrowthChart filters={filters} />
          </div>
        </div>

        {/* Bottom Row: Market Insights + Need a personalized plan */}
        <div>
          <BottomRow
            stats={stats}
            insights={liveStats?.insights || activeTrackObj.insights}
            onGetPlan={getPlan}
          />
        </div>

        {/* Premium Full Plan Modal */}
        <PremiumSkillPlanModal
          open={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onConsultCopilot={() => {
            setShowPlanModal(false);
            const trackLabel = isAr ? activeTrackObj.labelAr : activeTrackObj.label;
            sendMessage(
              isAr
                ? `ابنِ لي خطة مهارات ومسار تعلم مخصص لوظائف ${trackLabel} في سوق العمل المصري وفق أحدث متطلبات التوظيف.`
                : `Build me a personalized skill roadmap for ${trackLabel} roles in the Egyptian market based on current demand.`
            );
            router.push('/copilot');
          }}
        />
      </div>
    </AppShell>
  );
}
