"use client";

import React from 'react';
import { Briefcase, BarChart3, Brain, Target, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ITEMS_AR = [
  {
    title: 'مطابقة وظيفية دقيقة',
    description: 'وظائف تناسب مهاراتك وخبرتك',
    Icon: Briefcase,
    accent: 'blue',
    isAi: false,
  },
  {
    title: 'بيانات سوق العمل',
    description: 'أرقام وإحصائيات موثوقة',
    Icon: BarChart3,
    accent: 'blue',
    isAi: false,
  },
  {
    title: 'توصيات بالذكاء الاصطناعي',
    description: 'خطة تطوير تناسب أهدافك',
    Icon: Brain,
    accent: 'green',
    isAi: true,
  },
  {
    title: 'تحليل فجوات المهارات',
    description: 'اعرف بالضبط اللي ناقصك',
    Icon: Target,
    accent: 'blue',
    isAi: false,
  },
  {
    title: 'متابعة ذكية ومتكاملة',
    description: 'كل ما تحتاجه في مكان واحد',
    Icon: LayoutDashboard,
    accent: 'blue',
    isAi: false,
  },
];

const ITEMS_EN = [
  {
    title: 'Accurate Job Matching',
    description: 'Jobs fit to your skills & experience',
    Icon: Briefcase,
    accent: 'blue',
    isAi: false,
  },
  {
    title: 'Egyptian Market Data',
    description: 'Trusted numbers & metrics',
    Icon: BarChart3,
    accent: 'blue',
    isAi: false,
  },
  {
    title: 'AI-Powered Guidance',
    description: 'Tailored growth plans for your goals',
    Icon: Brain,
    accent: 'green',
    isAi: true,
  },
  {
    title: 'Skill Gap Diagnostics',
    description: 'Know exactly what to learn next',
    Icon: Target,
    accent: 'blue',
    isAi: false,
  },
  {
    title: 'All-in-One Dashboard',
    description: 'Everything you need in one place',
    Icon: LayoutDashboard,
    accent: 'blue',
    isAi: false,
  },
];

export function FeatureStrip() {
  const { isAr } = useLanguage();
  const items = isAr ? ITEMS_AR : ITEMS_EN;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1440px] xl:max-w-[1480px]">
        {/* Container: pill / card row */}
        <div
          className={`
            grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5
            rounded-2xl sm:rounded-[22px]
            border border-slate-200/80 dark:border-white/10
            bg-white/85 dark:bg-[#030C1E]/80
            
            px-3 sm:px-4 py-3
            shadow-[0_8px_30px_-4px_rgba(0,0,0,0.07),0_0_1px_rgba(0,0,0,0.04)]
            dark:shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]
          `}
        >
          {items.map((item, idx) => {
            const { Icon, accent, isAi, title, description } = item;

            const iconBg = isAi
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)] dark:shadow-[0_0_16px_rgba(0,245,160,0.25)]'
              : 'bg-blue-600 dark:bg-[#1a3fa8] border border-blue-500/70 dark:border-blue-400/30 shadow-[0_0_12px_rgba(37,99,235,0.25)] dark:shadow-[0_0_14px_rgba(59,130,246,0.3)]';

            const iconColor = isAi
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-white';

            /* hide 5th card on 2-col grid (sm<lg) so we have 2+2+1 → cleaner: show all but wrap */
            return (
              <div
                key={idx}
                className={`
                  flex items-center gap-2.5 sm:gap-3
                  px-2 sm:px-2.5 py-2 sm:py-2.5
                  rounded-xl
                  hover:bg-slate-50/80 dark:hover:bg-white/[0.04]
                  transition-colors duration-200
                  group cursor-default
                  ${idx === 4 ? 'col-span-2 sm:col-span-3 lg:col-span-1' : ''}
                `}
              >
                {/* Icon square */}
                <div
                  className={`
                    flex h-10 w-10 sm:h-11 sm:w-11 shrink-0
                    items-center justify-center
                    rounded-[13px] sm:rounded-[14px]
                    transition-transform duration-300 group-hover:scale-[1.06]
                    ${iconBg}
                  `}
                >
                  <Icon className={`h-[18px] w-[18px] sm:h-5 sm:w-5 ${iconColor}`} />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1" dir={isAr ? 'rtl' : 'ltr'}>
                  <p className="text-[11.5px] sm:text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                    {title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-[3px] leading-tight line-clamp-1">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
