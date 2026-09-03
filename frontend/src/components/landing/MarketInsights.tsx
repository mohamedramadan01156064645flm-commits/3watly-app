"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  ChevronDown, 
  Wallet, 
  Gauge, 
  Zap, 
  Building2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { DemandGauge } from './DemandGauge';
import { MarketSalaryChart } from './MarketSalaryChart';
import { 
  VodafoneLogo, 
  IbmLogo, 
  MicrosoftLogo 
} from '@/components/brand/CompanyLogos';
import { useLanguage } from '@/contexts/LanguageContext';

interface RoleInsightData {
  baseSalary: number;
  salaryGrowth: string;
  demandLevel: { ar: string; en: string };
  demandDescription: { ar: string; en: string };
  activeJobsCount: number;
  skills: { name: string; share: number; volume: string }[];
}

const roleDataMap: Record<string, RoleInsightData> = {
  'data-analyst': {
    baseSalary: 24000,
    salaryGrowth: '+18%',
    demandLevel: { ar: 'مرتفع جداً', en: 'Very High' },
    demandDescription: {
      ar: 'طلب قوي ومتزايد على محللي ومهندسي البيانات في السوق المصري حالياً.',
      en: 'Strong, growing demand for Data Analysts across Egyptian companies.'
    },
    activeJobsCount: 1247,
    skills: [
      { name: 'SQL', share: 88, volume: '950+' },
      { name: 'Python', share: 79, volume: '840+' },
      { name: 'Power BI', share: 72, volume: '720+' },
      { name: 'Data Visualization', share: 65, volume: '610+' },
      { name: 'Excel Advanced', share: 58, volume: '540+' }
    ]
  },
  'software-engineer': {
    baseSalary: 32000,
    salaryGrowth: '+24%',
    demandLevel: { ar: 'استثنائي ⚡', en: 'Exceptional ⚡' },
    demandDescription: {
      ar: 'أعلى معدلات التوظيف برواتب تنافسية محلياً وإقليمياً.',
      en: 'Highest hiring rates with competitive salaries locally and regionally.'
    },
    activeJobsCount: 2180,
    skills: [
      { name: 'TypeScript / JS', share: 92, volume: '1.8K+' },
      { name: 'React / Next.js', share: 85, volume: '1.5K+' },
      { name: 'Node.js / Python', share: 78, volume: '1.2K+' },
      { name: 'Docker / Cloud', share: 68, volume: '980+' },
      { name: 'System Design', share: 60, volume: '760+' }
    ]
  },
  'marketing-specialist': {
    baseSalary: 19500,
    salaryGrowth: '+12%',
    demandLevel: { ar: 'متوسط إلى مرتفع', en: 'Moderate to High' },
    demandDescription: {
      ar: 'طلب مستمر على خبراء الأداء الرقمي والتجارة الإلكترونية.',
      en: 'Consistent demand for digital performance & e-commerce marketers.'
    },
    activeJobsCount: 890,
    skills: [
      { name: 'Google Ads', share: 82, volume: '680+' },
      { name: 'SEO & Content', share: 74, volume: '590+' },
      { name: 'Meta Ads Manager', share: 71, volume: '540+' },
      { name: 'Data & Web Analytics', share: 62, volume: '480+' },
      { name: 'Email Automation', share: 54, volume: '390+' }
    ]
  },
  'product-manager': {
    baseSalary: 38500,
    salaryGrowth: '+20%',
    demandLevel: { ar: 'مرتفع ونادر', en: 'High & Niche' },
    demandDescription: {
      ar: 'فرص قيادية واعدة للشركات الناشئة والمؤسسات الرقمية الكبرى.',
      en: 'Promising leadership roles in tech startups and digital enterprises.'
    },
    activeJobsCount: 640,
    skills: [
      { name: 'Agile & Scrum', share: 90, volume: '580+' },
      { name: 'Product Roadmapping', share: 84, volume: '510+' },
      { name: 'User Analytics & KPI', share: 76, volume: '460+' },
      { name: 'Market Research', share: 70, volume: '420+' },
      { name: 'Jira & Wireframing', share: 65, volume: '380+' }
    ]
  }
};

export function MarketInsights() {
  const { isAr } = useLanguage();

  const [roleKey, setRoleKey] = useState('data-analyst');
  const [cityKey, setCityKey] = useState('cairo');
  const [levelKey, setLevelKey] = useState('mid');
  const [isUpdating, setIsUpdating] = useState(false);
  const [liveStats, setLiveStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/market/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.stats) {
          setLiveStats(data);
        }
      })
      .catch(() => {});
  }, []);

  const currentData = roleDataMap[roleKey] || roleDataMap['data-analyst'];

  // Real active jobs count from database (fallback to 413)
  const realActiveJobs = liveStats?.stats?.totalJobs || 413;

  // Real skills from live database if available, otherwise role skills
  const displaySkills = (liveStats?.topSkills?.length > 0 && roleKey === 'data-analyst')
    ? liveStats.topSkills.slice(0, 5).map((s: any) => ({
        name: s.name,
        share: s.percentage || 75,
        volume: `+${s.count}`
      }))
    : currentData.skills;

  // Experience level multiplier
  const levelMultiplier = levelKey === 'fresh' ? 0.65 : levelKey === 'junior' ? 0.82 : levelKey === 'senior' ? 1.55 : 1.0;
  // City multiplier
  const cityMultiplier = cityKey === 'remote' ? 1.15 : cityKey === 'alex' ? 0.92 : cityKey === 'giza' ? 0.98 : 1.0;

  const effectiveSalary = Math.round(currentData.baseSalary * levelMultiplier * cityMultiplier);

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 250);
  };

  const arabicIndustries = [
    { name: 'تكنولوجيا المعلومات والبرمجيات', share: 45 },
    { name: 'الخدمات المصرفية والمالية', share: 22 },
    { name: 'الاتصالات والشبكات', share: 18 },
    { name: 'التجارة الإلكترونية واللوجستيات', share: 15 }
  ];

  const englishIndustries = [
    { name: 'IT & Software Development', share: 45 },
    { name: 'Banking & Financial Services', share: 22 },
    { name: 'Telecom & Networking', share: 18 },
    { name: 'E-Commerce & Logistics', share: 15 }
  ];

  const activeIndustries = isAr ? arabicIndustries : englishIndustries;

  return (
    <section id="insights" className="w-full bg-[#F8FAFC]/50 dark:bg-[#060913] py-16 px-6 sm:px-10 lg:px-16 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 text-[12px] font-bold tracking-wider uppercase border border-blue-100/80 dark:border-blue-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isAr ? "بيانات حية • تحليلات محلية" : "Real Data. Local Insights."}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
            {isAr ? (
              <>
                استكشف مؤشرات <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">سوق العمل المصري</span>
              </>
            ) : (
              <>
                Explore the <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">Egyptian Job Market</span>
              </>
            )}
          </h2>

          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr
              ? "اكتشف متوسط الرواتب، معدل الطلب، أهم المهارات، واتجاهات التوظيف لأي تخصص في محافظات مصر."
              : "Discover salaries, demand, top skills, and hiring trends for any role in any Egyptian city."}
          </p>
        </div>

        {/* Filter Bar Form */}
        <form
          className="mt-10 grid gap-4 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end"
          onSubmit={handleApplyFilter}
        >
          {/* 1. Target Role */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-role" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isAr ? "ما هو التخصص المستهدف؟" : "What role are you targeting?"}</span>
            </label>
            <div className="relative">
              <select
                id="filter-role"
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 text-[14px] font-semibold text-slate-800 dark:text-white transition-colors hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 cursor-pointer"
              >
                <option value="data-analyst">{isAr ? "محلل بيانات (Data Analyst)" : "Data Analyst"}</option>
                <option value="software-engineer">{isAr ? "مهندس برمجيات (Software Engineer)" : "Software Engineer"}</option>
                <option value="product-manager">{isAr ? "مدير منتج (Product Manager)" : "Product Manager"}</option>
                <option value="marketing-specialist">{isAr ? "أخصائي تسويق رقمي (Digital Marketing)" : "Digital Marketing Specialist"}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute ltr:right-4 rtl:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* 2. City */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-city" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isAr ? "المحافظة أو نطاق العمل" : "Location"}</span>
            </label>
            <div className="relative">
              <select
                id="filter-city"
                value={cityKey}
                onChange={(e) => setCityKey(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 text-[14px] font-semibold text-slate-800 dark:text-white transition-colors hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 cursor-pointer"
              >
                <option value="cairo">{isAr ? "القاهرة، مصر" : "Cairo, Egypt"}</option>
                <option value="giza">{isAr ? "الجيزة، مصر" : "Giza, Egypt"}</option>
                <option value="alex">{isAr ? "الإسكندرية، مصر" : "Alexandria, Egypt"}</option>
                <option value="remote">{isAr ? "عمل عن بُعد (مصر وخارجها)" : "Remote (Egypt & Global)"}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute ltr:right-4 rtl:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* 3. Experience Level */}
          <div className="flex flex-col gap-2">
            <label htmlFor="filter-level" className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isAr ? "مستوى الخبرة" : "Experience Level"}</span>
            </label>
            <div className="relative">
              <select
                id="filter-level"
                value={levelKey}
                onChange={(e) => setLevelKey(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 text-[14px] font-semibold text-slate-800 dark:text-white transition-colors hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 cursor-pointer"
              >
                <option value="mid">{isAr ? "متوسط الخبرة (2-5 سنوات)" : "Mid Level (2-5 yrs)"}</option>
                <option value="junior">{isAr ? "مبتدئ (0-2 سنة)" : "Junior (0-2 yrs)"}</option>
                <option value="senior">{isAr ? "خبير وسينيور (5+ سنوات)" : "Senior (5+ yrs)"}</option>
                <option value="fresh">{isAr ? "خريج جديد (Fresh Grad)" : "Fresh Graduate"}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute ltr:right-4 rtl:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className={`w-4 h-4 fill-white ${isUpdating ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تطبيق المؤشرات ⚡" : "Apply Insights ⚡"}</span>
          </button>
        </form>

        {/* Primary Insight Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          
          {/* Salary Trend (Span 2) */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                    <Wallet className="h-4 w-4" />
                  </span>
                  {isAr ? "متوسط الراتب الشهري التقديري" : "Estimated Monthly Salary"}
                </h3>
                <span className="rounded-lg bg-slate-100 dark:bg-[#0B1120]/5 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isAr ? "ج.م / شهرياً" : "EGP / month"}
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <p className="text-[2.6rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                  {effectiveSalary.toLocaleString('en-US')} {isAr ? "ج.م" : "EGP"}
                </p>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[12px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
                  {currentData.salaryGrowth} {isAr ? "عن العام السابق" : "vs last year"}
                </span>
              </div>
            </div>

            <MarketSalaryChart />
          </div>

          {/* Market Demand Gauge */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col justify-between">
            <div>
              <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30">
                  <Gauge className="h-4 w-4" />
                </span>
                {isAr ? "مستوى الطلب في السوق" : "Market Demand"}
              </h3>
              <p className="mt-5 flex items-center gap-2 text-[2rem] font-black leading-none text-emerald-500 dark:text-emerald-400">
                {isAr ? currentData.demandLevel.ar : currentData.demandLevel.en}
                <ArrowUpRight className="h-6 w-6 stroke-[3]" />
              </p>
              <p className="mt-2 text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {isAr ? currentData.demandDescription.ar : currentData.demandDescription.en}
              </p>
            </div>
            <DemandGauge />
          </div>

          {/* Most Requested Skills (Full Text, NO truncation) */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30">
                <Zap className="h-4 w-4" />
              </span>
              {isAr ? "المهارات الأكثر طلباً" : "Most Requested Skills"}
            </h3>

            <ol className="mt-5 flex flex-col gap-3.5 flex-1">
              {displaySkills.map((skill: { name: string; share: number; volume: string }, index: number) => (
                <li key={skill.name} className="flex items-center gap-2.5">
                  <span className="w-3 shrink-0 text-[12px] font-bold text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </span>
                  <span className="min-w-[130px] sm:min-w-[140px] text-[13px] font-bold text-slate-800 dark:text-slate-200 whitespace-normal">
                    {skill.name}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${index < 3 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-blue-600 dark:bg-blue-400'}`}
                      style={{ width: `${skill.share}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-[12px] font-bold text-slate-600 dark:text-slate-400">
                    {skill.volume}
                  </span>
                </li>
              ))}
            </ol>

            <Link
              href="/skills"
              className="mt-4 inline-flex items-center gap-1.5 self-end text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isAr ? "عرض كل المهارات ↗" : "View all skills ↗"}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>

        </div>

        {/* Secondary Insight Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          
          {/* Active Job Postings */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30">
                <Briefcase className="h-4 w-4" />
              </span>
              {isAr ? "الوظائف النشطة المتاحة" : "Active Job Postings"}
            </h3>
            <p className="mt-5 text-[2.4rem] font-black leading-none text-slate-900 dark:text-white">
              {realActiveJobs.toLocaleString('en-US')}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[12px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
              {isAr ? "+14% عن الشهر السابق" : "14% vs last month"}
            </p>
          </div>

          {/* Top Hiring Companies */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 flex flex-col">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30">
                <Building2 className="h-4 w-4" />
              </span>
              {isAr ? "أبرز الشركات الموظفة" : "Top Hiring Companies"}
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-4 flex-1">
              <VodafoneLogo className="scale-90 origin-left dark:text-slate-200" />
              <IbmLogo className="scale-90 origin-left dark:text-slate-200" />
              <MicrosoftLogo className="scale-90 origin-left dark:text-slate-200" />
            </div>
            <Link
              href="/jobs"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isAr ? "عرض كل الوظائف والشركات ↗" : "Explore All Jobs & Companies ↗"}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </div>

          {/* Top Industries (Full Text, NO truncation) */}
          <div className="rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:col-span-2">
            <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                <Building2 className="h-4 w-4" />
              </span>
              {isAr ? "القطاعات الأكثر نمواً" : "Top Industries"}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {activeIndustries.map((industry) => (
                <div key={industry.name} className="flex items-center gap-3">
                  <span className="min-w-[170px] sm:min-w-[190px] text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {industry.name}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 dark:bg-blue-400"
                      style={{ width: `${industry.share}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-[12px] font-bold text-slate-600 dark:text-slate-400">
                    {industry.share}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PREMIUM 3D REDESIGNED CTA BANNER CARD (Issue 8)                           */}
        {/* ========================================================================= */}
        <div className="relative mt-10 overflow-hidden rounded-[30px] border border-blue-500/20 dark:border-indigo-500/30 bg-gradient-to-br from-[#0F172E] via-[#0B132B] to-[#040814] text-white p-7 sm:p-9 shadow-[0_20px_50px_rgba(15,23,42,0.4),0_0_30px_rgba(27,87,224,0.15)]">
          {/* Ambient Glows */}
          <div className="absolute -top-24 ltr:-right-24 rtl:-left-24 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 ltr:-left-24 rtl:-right-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left Info & Badges */}
            <div className="space-y-3.5 max-w-2xl text-center lg:text-left rtl:lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[12px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>{isAr ? "تحليلات مدعومة بالذكاء الاصطناعي" : "AI-Powered Career Intelligence"}</span>
              </div>

              <h4 className="text-[22px] sm:text-[26px] font-black leading-tight text-white">
                {isAr 
                  ? "احصل على تحليلات سوق أعمق وأدق مع عواطلي" 
                  : "Unlock Deeper, Actionable Market Insights with 3WATLY"}
              </h4>

              <p className="text-[14px] text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? "اكتشف سلم رواتب الشركات الحقيقية، واتجاهات التوظيف الآنية، وتوصيات سد فجوة المهارات المخصصة لملفك الشخصي بنقرة واحدة."
                  : "Discover verified company salary scales, live hiring velocity, and personalized skill gap roadmaps tailored directly to your profile."}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-[12.5px] text-slate-300 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "بيانات رواتب موثقة" : "Verified Salaries"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "خطة تطوير مهارات فورية" : "Instant Skill Roadmap"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "مجاني 100%" : "100% Free"}</span>
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-[15px] font-extrabold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-200 group"
              >
                <span>{isAr ? "ابدأ التحليل مجاناً الآن" : "Start Free Analysis Now"}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
