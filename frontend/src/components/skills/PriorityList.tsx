"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDownIcon,
  CheckIcon,
  PartyPopperIcon,
  SparklesIcon } from
'lucide-react';
import { useSkillPlan } from '../../contexts/SkillPlanContext';
import { SORT_OPTIONS } from '../../utils/skillPlan';
import { InfoTip } from '../ui/InfoTip';
import { SkillRow } from './SkillRow';
import type { SkillPlan } from '../../types/skills';

export function PriorityList({ plan }: {plan: SkillPlan;}) {
  const { sortMode, setSortMode } = useSkillPlan();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node))
      setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const activeSort =
  SORT_OPTIONS.find((option) => option.id === sortMode) ?? SORT_OPTIONS[0];

  return (
    <section
      aria-label="Your skill priorities"
      className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-card">
      
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pb-4 pt-5">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            Your skill priorities
            <InfoTip label="Skills are ranked by how much each one changes the number of postings you match, its market demand and its 90-day growth." />
          </h2>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            Sorted by {activeSort.label.toLowerCase()} — work top to bottom for
            the fastest return.
          </p>
        </div>

        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] px-3 py-2 text-[13px] font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-white/5">
            
            <ArrowUpDownIcon
              className="h-4 w-4 text-slate-500 dark:text-slate-400"
              aria-hidden="true" />
            
            Re-prioritize
          </button>

          <AnimatePresence>
            {menuOpen &&
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] py-1.5 shadow-panel">
              
                {SORT_OPTIONS.map((option) =>
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={option.id === sortMode}
                onClick={() => {
                  setSortMode(option.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-white/5">
                
                    <span className="mt-0.5 h-4 w-4 shrink-0">
                      {option.id === sortMode &&
                  <CheckIcon
                    className="h-4 w-4 text-brand-600"
                    aria-hidden="true" />

                  }
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-slate-800">
                        {option.label}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        {option.hint}
                      </span>
                    </span>
                  </button>
              )}
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>

      {plan.priorities.length === 0 ?
      <div className="flex items-start gap-3 border-t border-slate-100 px-5 py-8">
          <PartyPopperIcon
          className="h-5 w-5 shrink-0 text-emerald-500"
          aria-hidden="true" />
        
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              No gaps left for {plan.role.name}
            </p>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              Your CV covers every core skill this role screens for. Try a more
              senior target role to find your next stretch.
            </p>
          </div>
        </div> :

      <ul className="divide-y divide-slate-100 border-t border-slate-100">
          <AnimatePresence initial={false}>
            {plan.priorities.map((item, index) =>
          <motion.li
            key={item.def.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            
                <SkillRow
              item={item}
              index={index}
              isLast={index === plan.priorities.length - 1} />
            
              </motion.li>
          )}
          </AnimatePresence>
        </ul>
      }

      <div className="flex items-center gap-2 rounded-b-2xl border-t border-slate-100 bg-slate-50 dark:bg-[#0B1120]/[0.04] px-5 py-3">
        <SparklesIcon
          className="h-3.5 w-3.5 shrink-0 text-violet-600"
          aria-hidden="true" />
        
        <p className="text-[12px] text-slate-500 dark:text-slate-400">
          Ticking every step of a skill adds it to your CV and your ATS
          keywords automatically.
        </p>
      </div>
    </section>);

}
