"use client";

import React, { useMemo, useState } from 'react';
import { Info, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkillBar } from '../../data/market';
import { Modal } from '../ui/Modal';
import { SkillIcon } from '../skills/SkillIcon';

type TopSkillsCardProps = {
  skills: SkillBar[];
  ranking: SkillBar[];
  selected: string;
  onSelect: (name: string) => void;
};

export function TopSkillsCard({ skills, ranking, selected, onSelect }: TopSkillsCardProps) {
  const { isAr } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ranking.filter((s) => s.name.toLowerCase().includes(q)) : ranking;
  }, [query, ranking]);

  const active = skills.find((s) => s.name === selected) ?? ranking.find((s) => s.name === selected) ?? skills[0];

  return (
    <section className="flex h-full flex-col justify-between rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3">
          <div>
            <h2 className="flex items-center gap-1.5 text-[17px] font-bold text-[#0B132B] dark:text-white">
              {isAr ? 'المهارات الـ 8 الأكثر طلباً' : 'Top 8 In-Demand Skills'}
              <Info className="h-4 w-4 text-slate-400" />
            </h2>
            <p className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400">
              {isAr ? 'نسبة إعلانات الوظائف التي تطلب المهارة' : '% of job postings requiring the skill'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[13px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline cursor-pointer"
          >
            {isAr ? 'عرض جميع المهارات' : 'View all skills'}
          </button>
        </div>

        {/* Skill Bars List */}
        <ul className="mt-3 space-y-2.5">
          {skills.slice(0, 8).map((skill) => {
            const isActive = skill.name === active?.name;
            return (
              <li key={skill.name}>
                <button
                  type="button"
                  onClick={() => onSelect(skill.name)}
                  className={`w-full flex items-center gap-3 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                    isActive ? 'bg-blue-50/70 dark:bg-blue-950/40' : 'hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Icon + Name — flexible width, no truncate */}
                  <div className="flex min-w-0 w-[150px] shrink-0 items-center gap-2">
                    <SkillIcon skillId={skill.name} size="sm" className="!h-6 !w-6 !rounded-md shrink-0" />
                    <span className={`text-[12.5px] font-bold leading-snug break-words ${
                      isActive ? 'text-[#1B57E0] dark:text-[#60A5FA]' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {skill.name}
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#1B57E0] dark:bg-blue-500 transition-all duration-500"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>

                  {/* Percentage Value */}
                  <span className="w-10 shrink-0 text-right rtl:text-left text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                    {skill.value}%
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* X-axis indicators */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500 ltr:pl-[130px] ltr:pr-10 rtl:pr-[130px] rtl:pl-10">
          <span>0%</span>
          <span>20%</span>
          <span>40%</span>
          <span>60%</span>
          <span>80%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="mt-4 flex items-center gap-2.5 p-3 rounded-2xl bg-[#EEF4FF] dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-[12px] font-semibold text-[#1B57E0] dark:text-blue-300">
        <Info className="h-4 w-4 shrink-0 text-[#1B57E0] dark:text-blue-400" />
        <span>
          {isAr
            ? `مهارة ${active?.name || 'SQL'} مطلوبة في ${active?.value || 81}% من الوظائف المتعلقة بالمجال في السوق المختار.`
            : `${active?.name || 'SQL'} is present in ${active?.value || 81}% of data-related job postings in your selected market.`}
        </span>
      </div>

      {/* Modal for View All Skills */}
      {open && (
        <Modal open={open} onClose={() => setOpen(false)} title={isAr ? 'جميع المهارات المطلوبة في مصر' : 'All In-Demand Skills in Egypt'}>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute ltr:left-3.5 rtl:right-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن مهارة...' : 'Search skills...'}
                className="w-full h-10 ltr:pl-10 rtl:pr-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
              {filtered.map((s, idx) => (
                <div
                  key={s.name}
                  onClick={() => {
                    onSelect(s.name);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-400 w-5">#{idx + 1}</span>
                    <SkillIcon skillId={s.name} size="sm" className="!h-5 !w-5 !rounded-md" />
                    <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                  </div>
                  <span className="text-[12.5px] font-bold text-[#1B57E0] dark:text-[#60A5FA]">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
