"use client";

import React from 'react';
import { Check, ChevronRight, Loader2, Sparkles, UploadCloud, BarChart3, Briefcase, Zap } from 'lucide-react';
import { ProgressRing } from '../ui/ProgressRing';

export function UploadPanel() {
  return (
    <div className="flex h-full items-center gap-3.5 rounded-2xl border border-slate-100 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#070B14]/80 p-4">
      <div className="flex h-full flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 bg-white/80 dark:bg-[#0D1322]/80 p-3 text-center">
        <UploadCloud className="h-8 w-8 text-indigo-500 dark:text-indigo-400" strokeWidth={1.75} />
        <p className="mt-2 text-[12px] font-bold text-slate-800 dark:text-white">Drag &amp; drop your CV</p>
        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">PDF or DOCX</p>
      </div>

      <div className="relative w-[110px] shrink-0 rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#0D1322] p-3 shadow-md shadow-slate-100/50 dark:shadow-none">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">CV</p>
        <span className="mt-1.5 flex h-7 w-8 items-center justify-center rounded-md bg-[#E11D48] text-[9px] font-bold text-white shadow-sm">
          PDF
        </span>
        <p className="mt-2 text-[11px] font-bold text-slate-900 dark:text-white leading-tight">My Resume</p>
        <p className="text-[10px] text-slate-400 font-medium">Data Analyst</p>
        <div className="mt-2 flex flex-col gap-1">
          <span className="h-[3.5px] w-full rounded-full bg-slate-200 dark:bg-slate-700" />
          <span className="h-[3.5px] w-[70%] rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <span
          className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-[#0D1322] bg-emerald-500 text-white shadow-sm"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

const analysisRows = [
  { label: 'Skills', done: true },
  { label: 'Experience', done: true },
  { label: 'Education', done: true },
  { label: 'Market Data', done: false }
];

export function AnalyzePanel() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#070B14]/80 p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-white">
        <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        Analyzing Your Profile
      </p>

      <div className="mt-3 grid flex-1 grid-cols-[1fr_auto] items-center gap-3">
        <ul className="flex flex-col gap-1.5">
          {analysisRows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 dark:border-white/5 bg-white dark:bg-[#0D1322] px-2.5 py-1.5 shadow-sm"
            >
              <span className="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {row.label}
              </span>
              {row.done ? (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              ) : (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-indigo-500" />
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center justify-center">
          <ProgressRing
            value={85}
            size={76}
            thickness={7}
            label="Analysis"
            valueClassName="text-[1.2rem] dark:text-white"
            labelClassName="text-[8.5px] dark:text-slate-400"
          />
        </div>
      </div>

      <div className="mt-2 text-center text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400">
        Matching against 5,000+ Egyptian market jobs
      </div>
    </div>
  );
}

const planItems = [
  { icon: <Zap className="h-3.5 w-3.5 text-amber-500" />, title: 'Skill Gap', sub: '2 skills to learn' },
  { icon: <Briefcase className="h-3.5 w-3.5 text-emerald-500" />, title: 'Target Roles', sub: '4 high-fit jobs' },
  { icon: <BarChart3 className="h-3.5 w-3.5 text-blue-500" />, title: 'Salary Potential', sub: '+35% in 6 months' }
];

export function PlanPanel() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#070B14]/80 p-4">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30">
          Plan Ready
        </span>
        <span className="text-[11px] font-bold text-[#4338CA] dark:text-indigo-400">Step 3 of 3</span>
      </div>

      <ul className="my-2 flex flex-col gap-1.5 flex-1 justify-center">
        {planItems.map((item) => (
          <li
            key={item.title}
            className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#0D1322] px-3 py-2 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 dark:bg-[#0B1120]/5">
                {item.icon}
              </div>
              <div>
                <p className="text-[11.5px] font-bold text-slate-800 dark:text-white leading-tight">{item.title}</p>
                <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </li>
        ))}
      </ul>

      <div className="text-center text-[10.5px] font-bold text-slate-600 dark:text-slate-400">
        Updated in real-time as you grow
      </div>
    </div>
  );
}
