"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Building2, Zap, ArrowRight, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatSet } from '../../utils/marketData';

type BottomRowProps = {
  stats: StatSet;
  onGetPlan: () => void;
};

export function BottomRow({ stats, onGetPlan }: BottomRowProps) {
  const router = useRouter();
  const { isAr } = useLanguage();

  const insights = [
    {
      icon: Clock,
      bg: 'bg-[#E8F8F0] dark:bg-emerald-950/70',
      color: 'text-[#12B76A] dark:text-[#34D399]',
      to: '/jobs',
      text: isAr ? (
        <>
          وظائف مهندس البيانات نمت بنسبة <strong className="font-bold text-[#0B132B] dark:text-white">18%</strong> خلال آخر 90 يوماً
        </>
      ) : (
        <>
          Data Engineer roles grew by <strong className="font-bold text-[#0B132B] dark:text-white">18%</strong> in the last 90 days
        </>
      )
    },
    {
      icon: Building2,
      bg: 'bg-[#EEF4FF] dark:bg-blue-950/70',
      color: 'text-[#1B57E0] dark:text-[#60A5FA]',
      to: '/jobs',
      text: isAr ? (
        <>
          <strong className="font-bold text-[#0B132B] dark:text-white">مايكروسوفت، فودافون و INSTABASE</strong> هي أكثر الشركات توظيفاً
        </>
      ) : (
        <>
          <strong className="font-bold text-[#0B132B] dark:text-white">Microsoft, Vodafone & INSTABASE</strong> are the top hiring companies
        </>
      )
    },
    {
      icon: Zap,
      bg: 'bg-[#FFF7ED] dark:bg-amber-950/70',
      color: 'text-[#F97316] dark:text-[#FB923C]',
      to: '/skills',
      text: isAr ? (
        <>
          رواتب مهندسي البيانات ارتفعت بنسبة <strong className="font-bold text-[#0B132B] dark:text-white">12%</strong> (مقارنة سنوية)
        </>
      ) : (
        <>
          Salaries for Data Engineers increased by <strong className="font-bold text-[#0B132B] dark:text-white">12%</strong> (YoY)
        </>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left: Market Insights (7 Columns) */}
      <section className="lg:col-span-7 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <h2 className="flex items-center gap-2.5 text-[17px] font-bold text-[#0B132B] dark:text-white">
          <Zap className="h-5 w-5 text-[#1B57E0] dark:text-[#60A5FA]" strokeWidth={2.2} />
          {isAr ? 'رؤى وتحليلات السوق' : 'Market Insights'}
        </h2>

        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {insights.map((item, idx) => (
            <li
              key={idx}
              onClick={() => router.push(item.to)}
              className="flex flex-col justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color} mb-3.5 transition-transform group-hover:scale-105`}>
                <item.icon className="h-5 w-5 stroke-[2.2]" />
              </div>
              <p className="text-[12.5px] text-slate-600 dark:text-slate-300 leading-snug">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Right: Personalized Plan CTA Card (5 Columns) */}
      <section className="lg:col-span-5 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="max-w-[280px]">
          <h3 className="text-[17px] font-bold text-[#0B132B] dark:text-white leading-tight">
            {isAr ? 'هل تحتاج إلى خطة مخصصة؟' : 'Need a personalized plan?'}
          </h3>
          <p className="mt-2 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'احصل على توصيات مهارات مبنية على طلب السوق الحقيقي وأهدافك المهنية.'
              : 'Get skill recommendations based on real market demand and your career goals.'}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={onGetPlan}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-[13px] shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <span>{isAr ? 'احصل على خطتي' : 'Get My Plan'}</span>
              <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Circular Target Graphic matching image */}
        <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-blue-100/60 dark:bg-blue-900/30" />
          <div className="absolute inset-2.5 rounded-full bg-white dark:bg-[#0B1120] border-4 border-blue-500/40" />
          <div className="absolute inset-5 rounded-full bg-blue-500/20" />
          <Target className="h-9 w-9 text-[#1B57E0] dark:text-[#60A5FA] relative z-10" strokeWidth={2.2} />
        </div>
      </section>
    </div>
  );
}
