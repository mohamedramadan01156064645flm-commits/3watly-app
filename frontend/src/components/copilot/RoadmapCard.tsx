"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Check, Clock, TrendingUp } from 'lucide-react';
import { roadmapWeeks } from '../../data/roadmap';
import { Modal } from '../ui/Modal';
import { useLanguage } from '@/contexts/LanguageContext';

export function RoadmapCard() {
  const { isAr } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  const toggleWeek = (step: number) =>
    setDone((prev) => (prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]));

  return (
    <section className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs">
      <header className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white">
            {isAr ? "خارطة طريقك لـ 6 أسابيع للوصول لـ 30 ألف ج.م" : "Your 6-Week Roadmap to 30k EGP"}
          </h3>
          <span className="rounded-lg bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 text-[11.5px] font-bold text-[#1B57E0] dark:text-[#60A5FA]">
            Data Analyst → Mid-Level
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-[34px] items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-white dark:bg-white/5 px-3 text-[12.5px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:bg-blue-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span>{isAr ? "عرض الخارطة الكاملة" : "View Full Roadmap"}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Responsive Grid of Weeks without horizontal scroll cutoffs */}
      <ol className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {roadmapWeeks.map((w, i) => {
          const complete = done.includes(w.step);
          return (
            <li key={w.step} className="flex flex-col">
              <p className="text-center text-[10.5px] font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                {w.week}
              </p>

              <div className="flex items-center justify-center mb-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-xs ${
                    w.tone === 'blue' ? 'bg-[#1B57E0]' : 'bg-[#12B76A]'
                  }`}
                >
                  {complete ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : w.step}
                </span>
              </div>

              <div className="flex flex-col justify-between flex-1 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-[#070C18] p-3 text-center transition-all hover:border-blue-400">
                <div>
                  <div className="flex justify-center mb-2">
                    <img src={w.icon} alt="" className="h-7 w-7 object-contain" />
                  </div>
                  <h4 className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight">
                    {w.title}
                  </h4>
                  <p className="mt-1 text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {w.detail}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-white/10 px-2 py-0.5 text-[10.5px] font-bold text-slate-600 dark:text-slate-300">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {w.hours}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 text-[12.5px]">
        <span className="font-semibold text-emerald-800 dark:text-emerald-200">
          {isAr
            ? "إكمال خارطة الطريق يرفع فرص رفع راتبك إلى نطاق 28,000 — 35,000 ج.م شهرياً."
            : "Completing this roadmap can increase your salary potential to 28k – 35k EGP."}
        </span>
        <span className="font-black text-emerald-600 dark:text-emerald-400">28k – 35k EGP ↑</span>
      </div>

      {open && (
        <Modal open={open} onClose={() => setOpen(false)} title="Complete Career Roadmap">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {roadmapWeeks.map((w) => (
              <div key={w.step} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070C18]">
                <img src={w.icon} alt="" className="h-10 w-10 object-contain shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">{w.week}</span>
                  <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">{w.title}</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">{w.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </section>
  );
}
