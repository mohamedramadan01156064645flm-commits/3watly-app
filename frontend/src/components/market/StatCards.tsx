"use client";

import React from 'react';
import { Briefcase, Building2, Monitor, Star, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatSet } from '../../utils/marketData';

type StatCardsProps = {
  stats: StatSet;
  onSelect: (id: string) => void;
};

export function StatCards({ stats, onSelect }: StatCardsProps) {
  const { isAr } = useLanguage();

  const cards = [
    {
      id: 'jobs',
      label: isAr ? 'إجمالي الوظائف المحللة' : 'Total Analyzed Jobs',
      value: stats.jobs.toLocaleString('en-US'),
      delta: `${stats.jobsDelta}%`,
      sub: isAr ? 'مقارنة بآخر 30 يوم' : 'vs last 30 days',
      icon: Briefcase,
      iconBg: 'bg-[#EEF4FF] dark:bg-blue-950/70',
      iconColor: 'text-[#1B57E0] dark:text-[#60A5FA]',
      sparkColor: '#1B57E0',
      sparkD: 'M0 24 Q20 28 35 15 T65 18 T85 8 T100 4'
    },
    {
      id: 'companies',
      label: isAr ? 'الشركات الموظفة' : 'Hiring Companies',
      value: stats.companies.toLocaleString('en-US'),
      delta: `${stats.companiesDelta}%`,
      sub: isAr ? 'مقارنة بآخر 30 يوم' : 'vs last 30 days',
      icon: Building2,
      iconBg: 'bg-[#E8F8F0] dark:bg-emerald-950/70',
      iconColor: 'text-[#12B76A] dark:text-[#34D399]',
      sparkColor: '#12B76A',
      sparkD: 'M0 26 Q25 28 40 16 T70 20 T88 8 T100 4'
    },
    {
      id: 'remote',
      label: isAr ? 'نسبة العمل عن بُعد/هجين' : 'Remote/Hybrid Ratio',
      value: `${stats.remote}%`,
      delta: `${stats.remoteDelta}%`,
      sub: isAr ? 'مقارنة بآخر 30 يوم' : 'vs last 30 days',
      icon: Monitor,
      iconBg: 'bg-[#F3E8FF] dark:bg-purple-950/70',
      iconColor: 'text-[#9333EA] dark:text-[#C084FC]',
      sparkColor: '#9333EA',
      sparkD: 'M0 24 Q25 18 45 22 T75 10 T90 15 T100 4'
    },
    {
      id: 'skill',
      label: isAr ? 'المهارة الأكثر طلباً' : 'Top In-Demand Skill',
      value: stats.topSkill.name,
      sub: isAr ? `${stats.topSkill.share}% من وظائف البيانات` : `${stats.topSkill.share}% of data roles`,
      icon: Star,
      iconBg: 'bg-[#FFF7ED] dark:bg-amber-950/70',
      iconColor: 'text-[#F97316] dark:text-[#FB923C]',
      bars: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-4.5">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onSelect(card.id)}
          className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-4 sm:p-4.5 xl:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-all flex items-center justify-between gap-2.5 sm:gap-3 xl:gap-3.5 cursor-pointer group text-left rtl:text-right min-w-0"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 xl:gap-3.5 min-w-0 flex-1">
            {/* Squircle Icon Box */}
            <div className={`flex h-10 w-10 sm:h-11 sm:w-11 xl:h-12 xl:w-12 shrink-0 items-center justify-center rounded-[14px] sm:rounded-2xl ${card.iconBg} ${card.iconColor} transition-transform group-hover:scale-105 shadow-2xs`}>
              <card.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 xl:w-6 xl:h-6 stroke-[2.2]" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[11.5px] sm:text-[12px] xl:text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {card.label}
              </span>
              <p className={`${card.id === 'skill' ? 'text-[14.5px] sm:text-[16px] xl:text-[19px] 2xl:text-[22px] leading-[1.2] break-words line-clamp-2' : 'text-[20px] sm:text-[22px] xl:text-[26px] leading-tight truncate'} font-black text-[#0B132B] dark:text-white mt-0.5 tracking-tight`}>
                {card.value}
              </p>
              <div className="mt-0.5 sm:mt-1 flex items-center gap-1 text-[11px] sm:text-[11.5px] xl:text-[12px] font-bold text-[#12B76A] truncate">
                {card.delta && (
                  <span className="flex items-center gap-0.5 shrink-0">
                    <ArrowUp className="w-3 h-3 stroke-[3]" />
                    {card.delta}
                  </span>
                )}
                <span className="font-normal text-slate-400 dark:text-slate-500 text-[10.5px] sm:text-[11px] truncate">
                  {card.sub}
                </span>
              </div>
            </div>
          </div>

          {/* Right Sparkline or Bars */}
          {card.sparkD && (
            <div className="h-7 sm:h-8 xl:h-9 w-12 sm:w-15 xl:w-20 shrink-0 ltr:ml-1 sm:ltr:ml-2 rtl:mr-1 sm:rtl:mr-2">
              <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible">
                <path
                  d={card.sparkD}
                  fill="none"
                  stroke={card.sparkColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {card.bars && (
            <div className="flex items-end gap-1 sm:gap-1.5 h-6.5 sm:h-7 xl:h-8 shrink-0 ltr:ml-1 sm:ltr:ml-2 rtl:mr-1 sm:rtl:mr-2 self-center">
              <span className="w-1 sm:w-1.5 xl:w-2 h-2 sm:h-2.5 rounded-full bg-[#F97316]/30" />
              <span className="w-1 sm:w-1.5 xl:w-2 h-3 sm:h-4 rounded-full bg-[#F97316]/50" />
              <span className="w-1 sm:w-1.5 xl:w-2 h-4 sm:h-5.5 rounded-full bg-[#F97316]/70" />
              <span className="w-1 sm:w-1.5 xl:w-2 h-5.5 sm:h-7 rounded-full bg-[#F97316]/90" />
              <span className="w-1 sm:w-1.5 xl:w-2 h-6.5 sm:h-8 rounded-full bg-[#F97316]" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
