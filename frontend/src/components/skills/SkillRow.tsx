"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  LockIcon,
  PlayIcon,
  RotateCcwIcon,
  TrendingUpIcon,
  WalletIcon } from
'lucide-react';
import { useSkillPlan } from '../../contexts/SkillPlanContext';
import { BAND_META, TIER_LABEL } from '../../utils/skillPlan';
import type { PlannedSkill } from '../../types/skills';
import { SkillIcon } from './SkillIcon';
import { ResourceRow } from './ResourceRow';

interface SkillRowProps {
  item: PlannedSkill;
  index: number;
  isLast: boolean;
  locked?: boolean;
  lockedReason?: string;
}

export function formatHours(hours: number): string {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return minutes > 0 ? `${whole}h ${minutes}m` : `${whole}h`;
}

export function SkillRow({
  item,
  index,
  isLast,
  locked = false,
  lockedReason
}: SkillRowProps) {
  const { startSkill, saveForLater, moveToPlan, resetSkill, toggleAction } =
  useSkillPlan();
  const [expanded, setExpanded] = useState(false);
  const band = BAND_META[item.band];
  const { def } = item;
  const done = item.checkedActions.length;
  const total = def.actions.length;

  return (
    <div className="flex gap-4 px-5 py-5">
      <div className="flex flex-col items-center">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${
          locked ? 'bg-slate-300' : band.ring}`
          }>
          
          {locked ?
          <LockIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

          index + 1
          }
        </span>
        {!isLast && <span className="mt-2 w-px flex-1 bg-slate-200" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Identity + market signal */}
          <div className="lg:col-span-5">
            <div className="flex items-start gap-3">
              <SkillIcon skillId={def.id} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">
                    {def.name}
                  </h4>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${band.chip}`}>
                    
                    {band.label}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Required in{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {item.demand}%
                  </span>{' '}
                  of matching postings
                </p>
                {item.jobsUnlocked > 0 &&
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600">
                    <TrendingUpIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    +{item.jobsUnlocked} postings unlocked
                  </p>
                }
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="mt-2 flex items-center gap-1 text-[13px] font-semibold text-brand-600 transition-colors duration-150 ease-smooth hover:text-brand-700">
                  
                  {expanded ? 'Hide details' : 'Show details'}
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ease-smooth ${
                    expanded ? 'rotate-180' : ''}`
                    }
                    aria-hidden="true" />
                  
                </button>
              </div>
            </div>
          </div>

          {/* Action checklist */}
          <div className="lg:col-span-4">
            <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
              What to do
              <span className="ml-1.5 font-normal tabular-nums text-slate-400">
                {done}/{total}
              </span>
            </p>
            <ul className="mt-2 space-y-1.5">
              {def.actions.map((action, actionIndex) => {
                const checked = item.checkedActions.includes(actionIndex);
                return (
                  <li key={action}>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => toggleAction(def.id, actionIndex)}
                      aria-pressed={checked}
                      className="group flex w-full items-start gap-2 rounded-md px-1 py-0.5 text-left transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                      
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors duration-150 ease-smooth ${
                        checked ?
                        'border-emerald-500 bg-emerald-500 text-white' :
                        'border-slate-300 bg-white dark:bg-[#0B1120] group-hover:border-brand-400'}`
                        }>
                        
                        {checked &&
                        <CheckIcon className="h-3 w-3" aria-hidden="true" />
                        }
                      </span>
                      <span
                        className={`text-[13px] leading-snug ${
                        checked ?
                        'text-slate-400 line-through' :
                        'text-slate-600'}`
                        }>
                        
                        {action}
                      </span>
                    </button>
                  </li>);

              })}
            </ul>
          </div>

          {/* Status + CTA */}
          <div className="lg:col-span-3">
            <StatusPanel
              item={item}
              locked={locked}
              lockedReason={lockedReason}
              onStart={() => startSkill(def.id)}
              onSave={() => saveForLater(def.id)}
              onMoveToPlan={() => moveToPlan(def.id)}
              onReset={() => resetSkill(def.id)} />
            
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ClockIcon className="h-3 w-3" aria-hidden="true" />
              {def.courses} courses · {formatHours(def.hours)} ·{' '}
              {TIER_LABEL[def.tier]}
            </p>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded &&
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden">
            
              <div className="mt-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.04]/70 p-4">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                      Why it matters
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                      {def.why}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Stat
                      icon={TrendingUpIcon}
                      label={`+${def.growth}% 90-day growth`} />
                    
                      <Stat
                      icon={WalletIcon}
                      label={`+EGP ${def.salaryUplift}K/mo typical uplift`} />
                    
                      <Stat
                      icon={BriefcaseIcon}
                      label={`${item.demand}% of postings`} />
                    
                    </div>

                    {item.missingPrerequisites.length > 0 ?
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-800">
                        Learn{' '}
                        {item.missingPrerequisites.
                    map((pre) => pre.name).
                    join(' and ')}{' '}
                        first — it makes this skill much faster to pick up.
                      </p> :

                  <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-800">
                        Your CV already covers every prerequisite for this
                        skill.
                      </p>
                  }
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                      Recommended resources
                    </p>
                    <div className="mt-1.5 space-y-2">
                      {def.resources.map((resource) =>
                    <ResourceRow
                      key={resource.title}
                      resource={resource}
                      skillName={def.name} />

                    )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}

function Stat({
  icon: Icon,
  label



}: {icon: React.ComponentType<{className?: string;}>;label: string;}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] px-2 py-1 text-[11px] font-medium text-slate-600">
      <Icon className="h-3 w-3 text-slate-400" aria-hidden="true" />
      {label}
    </span>);

}

interface StatusPanelProps {
  item: PlannedSkill;
  locked: boolean;
  lockedReason?: string;
  onStart: () => void;
  onSave: () => void;
  onMoveToPlan: () => void;
  onReset: () => void;
}

function StatusPanel({
  item,
  locked,
  lockedReason,
  onStart,
  onSave,
  onMoveToPlan,
  onReset
}: StatusPanelProps) {
  const total = item.def.actions.length;
  const done = item.checkedActions.length;

  if (locked) {
    return (
      <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.04] px-3 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Locked
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
          {lockedReason}
        </p>
      </div>);

  }

  if (item.status === 'saved') {
    return (
      <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.04] px-3 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Status
        </p>
        <p className="mt-0.5 text-[13px] font-semibold text-slate-600">
          Saved for later
        </p>
        <button
          type="button"
          onClick={onMoveToPlan}
          className="mt-2.5 w-full rounded-lg border border-slate-300 bg-white dark:bg-[#0B1120] px-3 py-2 text-[13px] font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-150 ease-smooth hover:bg-slate-100">
          
          Move to active plan
        </button>
      </div>);

  }

  if (item.status === 'in-progress') {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
          In progress
        </p>
        <p className="mt-0.5 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
          {done} of {total} steps done
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white dark:bg-[#0B1120]">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-smooth"
            style={{ width: `${done / total * 100}%` }} />
          
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-brand-800">
          Tick the last step to add {item.def.name} to your CV.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-150 ease-smooth hover:text-slate-700 dark:text-slate-200">
          
          <RotateCcwIcon className="h-3 w-3" aria-hidden="true" />
          Reset progress
        </button>
      </div>);

  }

  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.04] px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Status
      </p>
      <p className="mt-0.5 text-[13px] font-semibold text-slate-600">
        Not started
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-[13px] font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-brand-700">
        
        <PlayIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Start learning
      </button>
      <button
        type="button"
        onClick={onSave}
        className="mt-1.5 w-full rounded-lg px-3 py-1.5 text-[12px] font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-150 ease-smooth hover:bg-slate-100 hover:text-slate-700 dark:text-slate-200">
        
        Save for later
      </button>
    </div>);

}
