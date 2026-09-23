"use client";

import React, { useMemo, useState } from 'react';
import { Info, Search, Flame, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkillBar } from '../../data/market';
import { Modal } from '../ui/Modal';
import { SkillIcon } from '../skills/SkillIcon';

type TopSkillsCardProps = {
  skills: SkillBar[];
  ranking: SkillBar[];
  selected: string;
  onSelect: (name: string) => void;
  trackLabel?: string;
};

export function TopSkillsCard({ skills, ranking, selected, onSelect, trackLabel }: TopSkillsCardProps) {
  const { isAr } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ranking.filter((s) => s.name.toLowerCase().includes(q)) : ranking;
  }, [query, ranking]);

  const active = skills.find((s) => s.name === selected) ?? ranking.find((s) => s.name === selected) ?? skills[0];

  const getRankBadge = (idx: number) => {
    if (idx === 0) {
      return (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-black text-white shadow-xs">
          1
        </span>
      );
    }
    if (idx === 1) {
      return (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 text-[11px] font-black text-white shadow-xs">
          2
        </span>
      );
    }
    if (idx === 2) {
      return (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 text-[11px] font-black text-white shadow-xs">
          3
        </span>
      );
    }
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-[11px] font-bold text-slate-500 dark:text-slate-400">
        {idx + 1}
      </span>
    );
  };

  const getBarGradient = (idx: number) => {
    if (idx === 0) return 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-500 dark:to-indigo-400';
    if (idx === 1) return 'bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400';
    if (idx === 2) return 'bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400';
    return 'bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-400';
  };

  return (
    <section className="flex h-full flex-col justify-between rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#0B132B] dark:text-white">
                {isAr ? 'المهارات الـ 8 الأكثر طلباً' : 'Top 8 In-Demand Skills'}
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1B57E0] dark:text-blue-400 text-[11px] font-bold">
                <Sparkles className="h-3 w-3" />
                {isAr ? 'مُحدّث' : 'Live'}
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400">
              {isAr
                ? `أعلى المهارات المطلوبة في إعلانات توظيف ${trackLabel || 'السوق التقني المصري'}`
                : `Highest required skills in ${trackLabel || 'Egyptian tech'} job postings`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[13px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline cursor-pointer shrink-0 mt-0.5"
          >
            {isAr ? 'عرض الكل' : 'View all'}
          </button>
        </div>

        {/* Skill Bars List */}
        <ul className="mt-3.5 space-y-2.5">
          {skills.slice(0, 8).map((skill, idx) => {
            const isActive = skill.name === active?.name;
            const categoryText = isAr ? (skill.categoryLabelAr || skill.categoryLabel) : skill.categoryLabel;

            return (
              <li key={skill.name}>
                <button
                  type="button"
                  onClick={() => onSelect(skill.name)}
                  className={`w-full group flex items-center justify-between gap-3 py-2 px-3 rounded-2xl transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/40 shadow-xs'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:border-slate-100 dark:hover:border-white/5'
                  }`}
                >
                  {/* Left: Rank + Icon + Name + Category */}
                  <div className="flex items-center gap-2.5 min-w-0 w-[180px] sm:w-[210px] shrink-0">
                    {getRankBadge(idx)}
                    <SkillIcon skillId={skill.name} size="sm" className="!h-6 !w-6 !rounded-md shrink-0 shadow-2xs" />
                    <div className="min-w-0 text-left rtl:text-right">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[13px] font-bold truncate leading-tight ${
                          isActive ? 'text-[#1B57E0] dark:text-[#60A5FA]' : 'text-slate-900 dark:text-white'
                        }`}>
                          {skill.name}
                        </span>
                        {skill.isHot && (
                          <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0 fill-amber-500 animate-pulse" />
                        )}
                      </div>
                      {categoryText && (
                        <span className="block text-[10.5px] font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {categoryText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Horizontal Animated Progress Bar */}
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10 hidden xs:block">
                    <div
                      className={`h-full rounded-full ${getBarGradient(idx)} transition-all duration-700 ease-out`}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>

                  {/* Right: Percentage & Trend */}
                  <div className="flex items-center gap-2.5 shrink-0 text-right rtl:text-left">
                    {skill.trend && (
                      <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        {skill.trend}
                      </span>
                    )}
                    <div className="w-12 text-right rtl:text-left">
                      <span className="text-[13.5px] font-black text-slate-900 dark:text-white">
                        {skill.value}%
                      </span>
                      {skill.jobCount && (
                        <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate leading-none">
                          {isAr ? `${skill.jobCount} وظيفة` : `${skill.jobCount} jobs`}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Contextual Insight Banner */}
      <div className="mt-4 flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30 text-[12.5px] font-medium text-slate-700 dark:text-slate-300">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1B57E0] text-white shadow-2xs">
          <Info className="h-4.5 w-4.5" />
        </div>
        <p className="leading-relaxed">
          {isAr ? (
            <>
              مهارة <strong className="font-bold text-[#1B57E0] dark:text-[#60A5FA]">{active?.name || 'SQL'}</strong> مطلوبة في{' '}
              <strong className="font-bold text-slate-900 dark:text-white">{active?.value || 78}%</strong> من إعلانات التوظيف النشطة،
              وتعتبر ركيزة أساسية لاجتياز الفرز الآلي (ATS) والمقابلات الفنية.
            </>
          ) : (
            <>
              <strong className="font-bold text-[#1B57E0] dark:text-[#60A5FA]">{active?.name || 'SQL'}</strong> is required in{' '}
              <strong className="font-bold text-slate-900 dark:text-white">{active?.value || 78}%</strong> of active postings,
              making it a critical skill for passing ATS filters and technical interviews.
            </>
          )}
        </p>
      </div>

      {/* Modal for View All Skills */}
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={isAr ? `كافة المهارات المطلوبة (${trackLabel || 'السوق المصري'})` : `All In-Demand Skills (${trackLabel || 'Egypt'})`}
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute ltr:left-3.5 rtl:right-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن أي تقنية أو مهارة...' : 'Search skills, tools, frameworks...'}
                className="w-full h-10 ltr:pl-10 rtl:pr-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="max-h-84 overflow-y-auto space-y-1.5 pr-1">
              {filtered.map((s, idx) => (
                <div
                  key={s.name}
                  onClick={() => {
                    onSelect(s.name);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11.5px] font-black text-slate-400 w-6">#{idx + 1}</span>
                    <SkillIcon skillId={s.name} size="sm" className="!h-6 !w-6 !rounded-md" />
                    <div>
                      <span className="text-[13px] font-bold text-slate-900 dark:text-white block leading-tight">{s.name}</span>
                      {s.categoryLabel && (
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">
                          {isAr ? (s.categoryLabelAr || s.categoryLabel) : s.categoryLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-[13.5px] font-black text-[#1B57E0] dark:text-[#60A5FA] block leading-tight">
                      {s.value}%
                    </span>
                    {s.trend && (
                      <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        {s.trend}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
