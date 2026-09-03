"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, LockIcon, UnlockIcon } from 'lucide-react';
import { SkillRow } from './SkillRow';
import type { SkillPlan } from '../../types/skills';

export function FutureSkills({ plan }: {plan: SkillPlan;}) {
  const [open, setOpen] = useState(false);
  const locked = !plan.futureUnlocked;
  const remaining = Math.max(
    0,
    plan.unlockThreshold - plan.completedCount
  );

  if (plan.future.length === 0) return null;

  return (
    <section
      aria-label="Future skills"
      className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-card">
      
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-white/5">
        
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          locked ? 'bg-slate-100' : 'bg-emerald-50'}`
          }>
          
          {locked ?
          <LockIcon className="h-5 w-5 text-slate-400" aria-hidden="true" /> :

          <UnlockIcon
            className="h-5 w-5 text-emerald-600"
            aria-hidden="true" />

          }
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-slate-900 dark:text-white">
            Next-stage skills ({plan.future.length})
          </span>
          <span className="mt-0.5 block text-[13px] text-slate-500 dark:text-slate-400">
            {locked ?
            `Unlocks after you finish ${remaining} more priority ${
            remaining === 1 ? 'skill' : 'skills'} — ${
            plan.completedCount}/${plan.unlockThreshold} done` :
            'Unlocked — move any of these into your active plan'}
          </span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ease-smooth ${
          open ? 'rotate-180' : ''}`
          }
          aria-hidden="true" />
        
      </button>

      <AnimatePresence initial={false}>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden">
          
            <ul className="divide-y divide-slate-100 border-t border-slate-100">
              {plan.future.map((item, index) =>
            <li key={item.def.id}>
                  <SkillRow
                item={item}
                index={index}
                isLast={index === plan.future.length - 1}
                locked={locked && item.status !== 'saved'}
                lockedReason={`Finish ${remaining} more priority ${
                remaining === 1 ? 'skill' : 'skills'} to open this up.`
                } />
              
                </li>
            )}
            </ul>
          </motion.div>
        }
      </AnimatePresence>
    </section>);

}
