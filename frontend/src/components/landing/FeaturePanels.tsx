"use client";

import React from 'react';
import { Check, Sparkles, Send, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/* ========================================================================= */
/* 1. SKILL GAP PANEL                                                        */
/* ========================================================================= */
export function SkillGapPanel() {
  const { isAr } = useLanguage();

  const userSkills = [
    { name: 'Python', dots: 3 },
    { name: 'SQL', dots: 3 },
    { name: 'Power BI', dots: 3 },
    { name: 'Excel', dots: 3 },
    { name: 'Pandas', dots: 3 }
  ];

  const topGaps = isAr 
    ? ['Advanced SQL', 'Machine Learning', 'AWS Cloud']
    : ['Advanced SQL', 'Machine Learning', 'AWS Cloud'];

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#080D1A] p-4 text-slate-800 dark:text-slate-200">
      <p className="text-center text-[12px] font-bold text-slate-700 dark:text-slate-300">
        {isAr ? "نسبة توافق المهارات الكلية" : "Overall Skill Match"}
      </p>

      <div className="grid grid-cols-[1.1fr_1.1fr_1.1fr] items-center gap-2 my-auto">
        {/* Left/Right: Your Skills */}
        <div className="rounded-xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0D1527] p-2.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isAr ? "مهاراتك الحالية" : "Your Skills"}
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {userSkills.map((skill) => (
              <li key={skill.name} className="flex items-center justify-between gap-1">
                <span className="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {skill.name}
                </span>
                <span className="flex items-center gap-[3px]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Center: Radial Progress Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-[92px] w-[92px]">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - 0.82)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[1.35rem] font-black text-emerald-500 leading-none">82%</span>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {isAr ? "توافق ممتاز" : "Good Match"}
              </span>
            </div>
          </div>
        </div>

        {/* Right/Left: Top Gaps to Focus */}
        <div className="rounded-xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0D1527] p-2.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {isAr ? "فجوات ركز عليها" : "Top Gaps to Focus"}
          </p>
          <ul className="mt-2.5 flex flex-col gap-2">
            {topGaps.map((gap) => (
              <li key={gap} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 shadow-sm shadow-amber-500/40" />
                <span className="truncate text-[10.5px] font-semibold text-slate-700 dark:text-slate-300">
                  {gap}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. ATS CV BUILDER PANEL                                                   */
/* ========================================================================= */
export function CvPreviewPanel() {
  const { isAr } = useLanguage();

  const sidebarTabs = isAr
    ? ['البيانات', 'الخبرات', 'التعليم', 'المهارات', 'المشاريع', 'الشهادات']
    : ['Personal Info', 'Experience', 'Education', 'Skills', 'Projects', 'Certificates'];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#080D1A] p-3 text-slate-800 dark:text-slate-200 overflow-hidden">
      <div className="grid grid-cols-[85px_1fr_105px] gap-2.5 h-full items-stretch">
        
        {/* 1. Sidebar Navigation */}
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0D1527] p-2 shadow-sm">
          {sidebarTabs.map((tab, index) => {
            const isActive = index === 0;
            return (
              <div
                key={tab}
                className={`px-1.5 py-1 rounded-lg text-[9.5px] font-bold transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-[#0052FF] dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </div>
            );
          })}
        </div>

        {/* 2. Center Document Preview */}
        <div className="flex flex-col rounded-xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0D1527] p-2.5 shadow-sm space-y-1.5">
          <div>
            <h4 className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight">
              {isAr ? "الاسم الكامل" : "Full Name"}
            </h4>
            <p className="text-[9.5px] text-slate-400 font-medium leading-none mt-0.5">
              {isAr ? "محلل بيانات" : "Data Analyst"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[8px] text-slate-400 border-b border-slate-100 dark:border-white/5 pb-1">
            <span className="flex items-center gap-0.5"><MapPin className="w-2 h-2" /> {isAr ? "القاهرة" : "Cairo"}</span>
            <span className="flex items-center gap-0.5"><Mail className="w-2 h-2" /> info@</span>
            <span className="flex items-center gap-0.5"><Phone className="w-2 h-2" /> 0100...</span>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-700 dark:text-slate-300">
              {isAr ? "الملخص المهني" : "Professional Summary"}
            </p>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-1.5 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="space-y-1 pt-0.5">
            <p className="text-[9px] font-bold text-slate-700 dark:text-slate-300">
              {isAr ? "سجل الخبرات" : "Experience"}
            </p>
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="h-1.5 w-4/5 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="h-1.5 w-3/5 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>

        {/* 3. Right Score & Optimization Tips */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0D1527] p-2 shadow-sm">
          <div className="flex flex-col items-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {isAr ? "توافق ATS" : "ATS Score"}
            </p>
            <div className="relative mt-1 h-[48px] w-[48px]">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - 0.92)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-black text-emerald-500">92%</span>
              </div>
            </div>
            <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {isAr ? "ممتاز" : "Excellent"}
            </span>
          </div>

          <div className="space-y-1 border-t border-slate-100 dark:border-white/5 pt-1">
            <p className="text-[8.5px] font-bold text-slate-600 dark:text-slate-400">
              {isAr ? "نصائح التحسين" : "Optimization Tips"}
            </p>
            <p className="flex items-center gap-1 text-[7.5px] font-semibold text-slate-700 dark:text-slate-300">
              <Check className="w-2.5 h-2.5 text-emerald-500 shrink-0 stroke-[3]" />
              <span>{isAr ? "كلمات مفتاحية قوية" : "Strong keywords"}</span>
            </p>
            <p className="flex items-center gap-1 text-[7.5px] font-semibold text-slate-700 dark:text-slate-300">
              <Check className="w-2.5 h-2.5 text-emerald-500 shrink-0 stroke-[3]" />
              <span>{isAr ? "هيكل واضح وموحد" : "Clear structure"}</span>
            </p>
            <p className="flex items-center gap-1 text-[7.5px] font-semibold text-slate-700 dark:text-slate-300">
              <span className="h-1 w-1 rounded-full bg-amber-500 shrink-0" />
              <span>{isAr ? "أضف شهادة SQL" : "Add SQL cert"}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. COPILOT PANEL                                                          */
/* ========================================================================= */
export function CopilotPanel() {
  const { isAr } = useLanguage();

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#080D1A] p-3 text-slate-800 dark:text-slate-200">
      
      {/* User Question */}
      <div className="self-end max-w-[90%] rounded-2xl rounded-tr-none bg-[#F3E8FF] dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-500/30 px-3 py-2 text-[#6B21A8] dark:text-purple-300 text-[11px] font-medium leading-relaxed">
        {isAr 
          ? "ايه المهارات المطلوبة عشان اترقى لـ Senior Data Analyst في مصر؟" 
          : "What should I learn next to become a better Data Analyst?"}
      </div>

      {/* AI Copilot Answer */}
      <div className="self-start max-w-[95%] rounded-2xl rounded-tl-none bg-white dark:bg-[#0D1527] border border-slate-200/70 dark:border-white/5 p-2.5 shadow-sm text-slate-700 dark:text-slate-300 text-[10.5px] space-y-1">
        <p className="flex items-center gap-1 font-bold text-slate-900 dark:text-white text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          {isAr ? "بناءً على ملفك وسوق العمل المصري:" : "Based on your profile & Egyptian market:"}
        </p>
        <div className="flex flex-col gap-1 ltr:pl-4 rtl:pr-4 pt-0.5">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            1. <span className="text-[#4338CA] dark:text-indigo-400">{isAr ? "SQL متقدم وإدارة البيانات" : "Advanced SQL"}</span>
          </p>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            2. <span className="text-[#4338CA] dark:text-indigo-400">{isAr ? "سرد قصص البيانات (Storytelling)" : "Data Storytelling"}</span>
          </p>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            3. <span className="text-[#4338CA] dark:text-indigo-400">{isAr ? "أساسيات السحابة AWS / GCP" : "AWS Fundamentals"}</span>
          </p>
        </div>
      </div>

      {/* Input Field with Send Button */}
      <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D1527] px-3 py-1.5 shadow-sm">
        <span className="flex-1 text-[10px] text-slate-400 dark:text-slate-500 truncate">
          {isAr ? "اسأل المساعد الذكي عن أي استفسار في مسارك..." : "Ask me anything about your career..."}
        </span>
        <button
          type="button"
          aria-label="Send query"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9333EA] text-white shadow-sm hover:scale-105 transition-transform"
        >
          <Send className={`w-2.5 h-2.5 stroke-[2.5] ${isAr ? "rotate-180" : ""}`} />
        </button>
      </div>

    </div>
  );
}
