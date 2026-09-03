"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Code2, Film, FolderGit2, LayoutGrid } from 'lucide-react';
import { SkillIcon } from './SkillIcon';
import { ResourceRow } from './ResourceRow';
import type { PlannedSkill, ResourceKind } from '../../types/skills';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResourcesModalProps {
  open: boolean;
  onClose: () => void;
  skills: PlannedSkill[];
  initialKind?: ResourceKind | 'all';
}

const FILTERS: { id: ResourceKind | 'all'; labelEn: string; labelAr: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all',     labelEn: 'All',           labelAr: 'الكل',         Icon: LayoutGrid },
  { id: 'video',   labelEn: 'Free Videos',   labelAr: 'فيديوهات',     Icon: Film },
  { id: 'course',  labelEn: 'Courses',       labelAr: 'كورسات',       Icon: BookOpen },
  { id: 'docs',    labelEn: 'Docs',          labelAr: 'التوثيق',      Icon: Code2 },
  { id: 'project', labelEn: 'Projects',      labelAr: 'مشاريع',       Icon: FolderGit2 },
];

export function ResourcesModal({
  open,
  onClose,
  skills,
  initialKind = 'all'
}: ResourcesModalProps) {
  const [kind, setKind] = useState<ResourceKind | 'all'>(initialKind);
  const { isAr } = useLanguage();

  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Flatten total visible resources for count
  const totalVisible = skills.reduce((acc, s) => {
    return acc + s.def.resources.filter(r => kind === 'all' || r.kind === kind).length;
  }, 0);

  return (
    <AnimatePresence>
      {open && (
        <div className="no-print fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={isAr ? 'مصادر التعلم' : 'Learning resources'}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full sm:max-w-2xl overflow-hidden rounded-t-[28px] sm:rounded-[24px] bg-white dark:bg-[#0D1117] border border-slate-200/70 dark:border-white/[0.08] shadow-2xl focus:outline-none"
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
                  {isAr ? 'مصادر التعلم لخطتك' : 'Learning resources for your plan'}
                </h2>
                <p className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? 'مُختارة لكل مهارة، تجمع بين مواد مجانية وكورسات معتمدة.'
                    : 'Curated per skill, mixing free material with certificate courses.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.07] hover:text-slate-700 dark:hover:text-white transition-all duration-150"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* ── Filter Pills ── */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const active = kind === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setKind(f.id)}
                      aria-pressed={active}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-150 ${
                        active
                          ? 'bg-[#1B57E0] text-white shadow-md shadow-blue-600/25'
                          : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.1]'
                      }`}
                    >
                      <f.Icon className="h-3.5 w-3.5" />
                      {isAr ? f.labelAr : f.labelEn}
                    </button>
                  );
                })}
                {totalVisible > 0 && (
                  <span className="ms-auto flex items-center text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">
                    {totalVisible} {isAr ? 'مصدر' : 'resources'}
                  </span>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-100 dark:bg-white/[0.06] mx-6" />

            {/* ── Resource list ── */}
            <div className="max-h-[55vh] overflow-y-auto px-6 py-4 space-y-5 scroll-slim">
              {skills.length === 0 ? (
                <p className="py-6 text-center text-[13px] text-slate-400 dark:text-slate-500">
                  {isAr
                    ? 'خطتك لا تحتوي على مهارات مفتوحة حالياً — اختر دوراً مستهدفاً جديداً.'
                    : 'Your plan has no open skills — pick a new target role.'}
                </p>
              ) : (
                skills.map((item) => {
                  const resources = item.def.resources.filter(
                    (r) => kind === 'all' || r.kind === kind
                  );
                  if (resources.length === 0) return null;
                  return (
                    <div key={item.def.id}>
                      {/* Skill group header */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <SkillIcon skillId={item.def.id} size="sm" />
                        <span className="text-[13px] font-bold text-slate-800 dark:text-white">
                          {item.def.name}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-lg">
                          {resources.length} {isAr ? 'مصدر' : 'courses'}
                        </span>
                      </div>

                      {/* Resource rows */}
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {resources.map((r) => (
                            <motion.div
                              key={r.title}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.18 }}
                            >
                              <ResourceRow resource={r} skillName={item.def.name} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ── Mobile drag handle ── */}
            <div className="sm:hidden flex justify-center pb-4 pt-2">
              <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
