"use client";

import React from 'react';
import { CalendarSearch, BarChart3, Flame, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function FeatureStrip() {
  const { isAr } = useLanguage();

  const stripItems = isAr
    ? [
        {
          title: 'مطابقة وظيفية ذكية',
          description: 'وظائف تناسب مهاراتك الفعلية',
          icon: <CalendarSearch className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
          badgeBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20'
        },
        {
          title: 'بيانات حية لسوق العمل المصري',
          description: 'أرقام وإحصائيات دقيقة وموثوقة',
          icon: <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
          badgeBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
        },
        {
          title: 'تحليل فجوات المهارات',
          description: 'اعرف ايه اللي ناقصك بالظبط لتترقى',
          icon: <Flame className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
          badgeBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20'
        },
        {
          title: 'صانع سيرة ذاتية ذكي',
          description: 'نماذج متوافقة 100% مع أنظمة ATS',
          icon: <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />,
          badgeBg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20'
        }
      ]
    : [
        {
          title: 'AI-Powered Career Matching',
          description: 'Find jobs that truly fit your skills',
          icon: <CalendarSearch className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
          badgeBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20'
        },
        {
          title: 'Real-time Egypt Market Insights',
          description: 'Real data you can rely on',
          icon: <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
          badgeBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
        },
        {
          title: 'Skill Gap Diagnostics',
          description: 'Know exactly what skills to learn next',
          icon: <Flame className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
          badgeBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20'
        },
        {
          title: 'Smart ATS CV Builder',
          description: 'Create resumes that pass ATS scans',
          icon: <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />,
          badgeBg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20'
        }
      ];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#0B1120]/80 backdrop-blur-xl p-4 sm:p-5 shadow-xl shadow-slate-200/40 dark:shadow-2xl dark:shadow-black/90">
          {stripItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3.5 p-1.5 group">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${item.badgeBg} group-hover:scale-105 transition-transform duration-300`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
