"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Target, 
  BarChart3, 
  Sparkles, 
  Shield,
  GitFork
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function FinalCta() {
  const { isAr } = useLanguage();

  const ctaHighlights = isAr
    ? [
        {
          title: 'توجيه مهني مخصص لخبرتك',
          icon: <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          tileBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-500/30'
        },
        {
          title: 'بيانات حقيقية لسوق العمل المصري',
          icon: <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          tileBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-500/30'
        },
        {
          title: 'توصيات ذكية بالذكاء الاصطناعي',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          tileBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-500/30'
        },
        {
          title: 'أمان وخصوصية تامة لبياناتك',
          icon: <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          tileBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-500/30'
        }
      ]
    : [
        {
          title: 'Personalized career insights',
          icon: <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          tileBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-500/30'
        },
        {
          title: 'Real Egyptian market data',
          icon: <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          tileBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-500/30'
        },
        {
          title: 'AI-powered recommendations',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          tileBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-500/30'
        },
        {
          title: 'Private & secure',
          icon: <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          tileBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-500/30'
        }
      ];

  return (
    <section className="w-full bg-white dark:bg-[#060913] pt-2 pb-6 px-4 sm:px-8 lg:px-12 transition-colors duration-300">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[26px] border border-slate-200/90 dark:border-white/10 bg-[#F4F8FF] dark:bg-gradient-to-r dark:from-[#0D1424] dark:via-[#111D35] dark:to-[#0A1F26] p-5 sm:p-7 lg:p-8 shadow-lg shadow-slate-200/40 dark:shadow-2xl dark:shadow-black/80">
        
        {/* Light Mode Background Image */}
        <div className="pointer-events-none absolute inset-0 select-none dark:hidden">
          <Image
            src="/images/cta-bg.png"
            alt="Career direction background"
            fill
            className="object-cover object-right opacity-90"
            priority
          />
        </div>

        {/* Content Layout */}
        <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-3.5">
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#0F172A] dark:text-white leading-[1.2] tracking-tight">
              {isAr ? (
                <>
                  مسارك المهني محتاج خطة واضحة.
                  <br />
                  <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">عواطلي</span> يساعدك توصل لها.
                </>
              ) : (
                <>
                  Your career needs a clear direction.<br />
                  <span className="bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">3WATLY</span> helps you reach it.
                </>
              )}
            </h2>

            <p className="text-[13.5px] text-[#475569] dark:text-slate-300 font-normal leading-relaxed max-w-lg">
              {isAr
                ? "افهم مهاراتك الفعلية، اكتشف متطلبات السوق المصري، وخد الخطوة الجاية بثقة."
                : "Understand your real skills, discover Egyptian job market demands, and take your next career step with confidence."}
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {ctaHighlights.map((item) => (
                <div 
                  key={item.title} 
                  className="flex items-center gap-2 bg-white/95 dark:bg-[#0B1120]/90 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-slate-200/80 dark:border-white/10 shadow-2xs"
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${item.tileBg}`}>
                    {item.icon}
                  </div>
                  <span className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Button & Trust checkpoint */}
            <div className="flex flex-wrap items-center gap-3 pt-1.5">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0052FF] hover:bg-[#0045D8] text-white text-[13.5px] font-bold shadow-md shadow-blue-600/25 hover:-translate-y-0.5 transition-all"
              >
                <span>{isAr ? "ابدأ مجاناً الآن" : "Get Started Free"}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </Link>
              
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-500/30 px-3 py-2 rounded-xl">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? "بدون أي رسوم أو بطاقة ائتمان" : "No fees or credit card required"}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Layered Floating Analytics Cards */}
          <div className="relative mx-auto w-full max-w-[500px] lg:h-[260px]">
            
            {/* 1. Career Match Score Card */}
            <div className="relative rounded-[22px] border border-white/95 dark:border-white/10 bg-white/95 dark:bg-[#0B1120] backdrop-blur-xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:absolute lg:ltr:left-0 lg:rtl:right-0 lg:top-0 lg:z-20 lg:w-[225px]">
              <h3 className="text-[12px] font-bold text-slate-900 dark:text-white">
                {isAr ? "مؤشر التوافق المهني" : "Career Match Score"}
              </h3>
              <div className="mt-2.5 flex justify-center py-0.5">
                <div className="relative h-[96px] w-[96px]">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8.5" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="8.5"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - 0.85)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[1.65rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                      85<span className="text-sm font-bold">%</span>
                    </p>
                    <p className="mt-0.5 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
                      {isAr ? "توافق ممتاز" : "Great Match"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Top Skills Card */}
            <div className="mt-3 rounded-[22px] border border-white/95 dark:border-white/10 bg-white/95 dark:bg-[#0B1120] backdrop-blur-xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:mt-0 lg:absolute lg:ltr:right-0 lg:rtl:left-0 lg:top-2 lg:z-10 lg:w-[275px] lg:ltr:pl-9 lg:rtl:pr-9">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-900 dark:text-white">
                <GitFork className="w-3 h-3 text-slate-500" />
                <span>{isAr ? "المهارات الأكثر طلباً" : "Top Skills"}</span>
              </div>
              
              <ul className="mt-3 flex flex-col gap-2">
                <li className="flex items-center justify-between gap-1.5">
                  <span className="w-[50px] shrink-0 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Python
                  </span>
                  <div className="h-[6px] w-[68px] rounded-full bg-emerald-500" />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                </li>

                <li className="flex items-center justify-between gap-1.5">
                  <span className="w-[50px] shrink-0 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    SQL
                  </span>
                  <div className="h-[6px] w-[58px] rounded-full bg-emerald-500" />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                </li>

                <li className="flex items-center justify-between gap-1.5">
                  <span className="w-[50px] shrink-0 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Power BI
                  </span>
                  <div className="h-[6px] w-[72px] rounded-full bg-emerald-500" />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                </li>
              </ul>
            </div>

            {/* 3. Salary Insight Card */}
            <div className="mt-3 rounded-[22px] border border-white/95 dark:border-white/10 bg-white/95 dark:bg-[#0B1120] backdrop-blur-xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:mt-0 lg:absolute lg:ltr:left-0 lg:rtl:right-0 lg:bottom-0 lg:z-10 lg:w-[345px]">
              <div className="grid grid-cols-[130px_1fr] items-center gap-2">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-900 dark:text-white">
                    {isAr ? "مؤشر الرواتب" : "Salary Insight"}
                  </h3>
                  <p className="mt-1 text-[1.25rem] font-black text-emerald-500 dark:text-emerald-400 leading-none">
                    {isAr ? "24,000 ج.م" : "EGP 24,000"}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-slate-400 font-medium">
                    {isAr ? "متوسط الراتب الشهري" : "Average Monthly Salary"}
                  </p>
                  
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
                      <ArrowUpRight className="h-3 w-3 stroke-[3]" />
                      {isAr ? "+18% عن العام السابق" : "18% vs last year"}
                    </span>
                  </div>
                </div>

                <div className="h-[70px] w-full">
                  <svg viewBox="0 0 170 80" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="cta-salary-fill-compact" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="0,75 0,70 24,58 48,64 72,48 96,56 120,32 144,38 168,18 168,75"
                      fill="url(#cta-salary-fill-compact)"
                    />
                    <polyline
                      points="0,70 24,58 48,64 72,48 96,56 120,32 144,38 168,18"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 4. Market Demand Card */}
            <div className="mt-3 rounded-[22px] border border-white/95 dark:border-white/10 bg-white/95 dark:bg-[#0B1120] backdrop-blur-xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90 lg:mt-0 lg:absolute lg:ltr:right-0 lg:rtl:left-0 lg:bottom-0 lg:z-20 lg:w-[210px]">
              <h3 className="text-[12px] font-bold text-slate-900 dark:text-white">
                {isAr ? "الطلب في السوق" : "Market Demand"}
              </h3>
              <p className="mt-1.5 flex items-center gap-1 text-[1.45rem] font-black text-emerald-500 dark:text-emerald-400 leading-none">
                {isAr ? "مرتفع" : "High"}
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">82 / 100</p>
              
              <div className="mt-2.5 relative h-[6px] w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{
                    width: '82%',
                    background: 'linear-gradient(to right, #EF4444 0%, #F59E0B 40%, #84CC16 70%, #10B981 100%)'
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
