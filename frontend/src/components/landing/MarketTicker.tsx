"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function MarketTicker() {
  const { isAr } = useLanguage();

  const signals = isAr
    ? [
        {
          id: 'sig-1',
          entity: 'Vodafone Egypt',
          action: 'توظف مهندسي ومحللي بيانات',
          metric: 'القرية الذكية',
          isLive: true,
        },
        {
          id: 'sig-2',
          entity: 'سوق العمل المصري',
          action: '+1,240 فرصة عمل تقنية نشطة',
          metric: 'محدث اليوم',
          isLive: true,
        },
        {
          id: 'sig-3',
          entity: 'Python • SQL • React',
          action: 'الأعلى طلباً في إعلانات التوظيف',
          metric: '+81% طلب',
          isLive: false,
        },
        {
          id: 'sig-4',
          entity: 'Valeo Egypt',
          action: 'توسع في فرق الـ Deep Learning & AI',
          metric: 'القاهرة',
          isLive: true,
        },
        {
          id: 'sig-5',
          entity: 'سد فجوة المهارات',
          action: 'يرفع معدل قبول المقابلات بنسبة 3.6x',
          metric: 'أثر مباشر',
          isLive: false,
        },
        {
          id: 'sig-6',
          entity: 'Paymob & Fawry',
          action: 'توظيف نشط لمهندسي Backend & DevOps',
          metric: 'مصر',
          isLive: true,
        },
      ]
    : [
        {
          id: 'sig-1',
          entity: 'Vodafone Egypt',
          action: 'Hiring Data Engineers & Analysts',
          metric: 'Smart Village',
          isLive: true,
        },
        {
          id: 'sig-2',
          entity: 'Egyptian Market',
          action: '+1,240 active tech openings live',
          metric: 'Updated Today',
          isLive: true,
        },
        {
          id: 'sig-3',
          entity: 'Python • SQL • React',
          action: 'Leading demand across job listings',
          metric: '+81% Share',
          isLive: false,
        },
        {
          id: 'sig-4',
          entity: 'Valeo Egypt',
          action: 'Expanding Autonomous & ML teams',
          metric: 'Cairo Hub',
          isLive: true,
        },
        {
          id: 'sig-5',
          entity: 'Closing Skill Gap',
          action: 'Boosts interview callbacks by 3.6x',
          metric: 'Proven ROI',
          isLive: false,
        },
        {
          id: 'sig-6',
          entity: 'Paymob & Fawry',
          action: 'Active recruiting for Backend & DevOps',
          metric: 'Egypt',
          isLive: true,
        },
      ];

  const duplicatedSignals = [...signals, ...signals, ...signals];

  return (
    <div 
      className="relative w-full overflow-hidden py-3 bg-transparent select-none"
      aria-label={isAr ? "مؤشرات السوق المباشرة" : "Live Market Ticker"}
    >
      {/* Delicate Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-[#F8FAFC] dark:from-[#060913] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-[#F8FAFC] dark:from-[#060913] to-transparent" />

      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-3 shrink-0"
          animate={{
            x: isAr ? ['0%', '33.333%'] : ['0%', '-33.333%'],
          }}
          transition={{
            duration: 34,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedSignals.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs hover:border-blue-500/40 dark:hover:border-blue-500/30 hover:bg-slate-50/90 dark:hover:bg-white/[0.06] transition-all duration-200 shrink-0 cursor-default"
            >
              {/* Subtle Live Dot Indicator */}
              {item.isLive ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              )}

              {/* Entity Title */}
              <span className="text-[12px] font-bold text-slate-900 dark:text-white whitespace-nowrap">
                {item.entity}
              </span>

              <span className="text-slate-300 dark:text-white/20 text-[10px]">•</span>

              {/* Action / Statement */}
              <span className="text-[12px] font-normal text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {item.action}
              </span>

              {/* Minimalist Metric Tag */}
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">
                {item.metric}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
