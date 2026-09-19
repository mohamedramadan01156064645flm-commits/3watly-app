"use client";

import React from 'react';
import { BarChart3, TrendingUp, Users, FileText, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminAnalyticsPage() {
  const { isAr } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          {isAr ? 'التحليلات' : 'Analytics'}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {isAr ? 'إحصائيات مفصلة حول أداء المنصة.' : 'Detailed insights about platform performance.'}
        </p>
      </div>

      {/* Coming Soon placeholder */}
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
          <BarChart3 className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-lg font-bold text-white mb-2">
            {isAr ? 'قريباً...' : 'Coming Soon'}
          </h2>
          <p className="text-sm text-slate-400">
            {isAr
              ? 'سيتم إضافة رسوم بيانية ولوحات تحليل متقدمة قريباً لمراقبة نشاط المستخدمين وتحليلات الكورسات والسيرة الذاتية.'
              : 'Advanced charts and analytics dashboards for user activity, CV analyses, and course engagement are coming soon.'}
          </p>
        </div>

        {/* Teaser stat strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mt-4">
          {[
            { icon: Users, label: isAr ? 'المستخدمون النشطون' : 'Active Users', color: 'text-cyan-400', border: 'border-cyan-500/15' },
            { icon: FileText, label: isAr ? 'تحليلات السيرة الذاتية' : 'CV Analyses', color: 'text-emerald-400', border: 'border-emerald-500/15' },
            { icon: Briefcase, label: isAr ? 'الوظائف المطابقة' : 'Job Matches', color: 'text-amber-400', border: 'border-amber-500/15' },
            { icon: TrendingUp, label: isAr ? 'معدل التحسن' : 'Improvement Rate', color: 'text-purple-400', border: 'border-purple-500/15' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/3 border ${item.border} opacity-50`}
              >
                <Icon className={`w-6 h-6 ${item.color}`} />
                <p className="text-[11px] text-center text-slate-400 font-medium">{item.label}</p>
                <div className="h-5 w-12 rounded-lg bg-white/10 animate-pulse" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
