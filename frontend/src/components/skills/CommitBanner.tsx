"use client";

import React from 'react';
import { format } from 'date-fns';
import { BellRingIcon, CalendarCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { WEEKLY_HOUR_OPTIONS } from '../../data/skillCatalog';
import { useSkillPlan } from '../../contexts/SkillPlanContext';
import type { SkillPlan } from '../../types/skills';

export function CommitBanner({ plan }: {plan: SkillPlan;}) {
  const { weeklyHours, setWeeklyHours } = useSkillPlan();
  const hasPlan = plan.priorities.length > 0 && plan.remainingHours > 0;

  return (
    <section
      aria-label="Commit to your plan"
      className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-card">
      
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50">
            <CalendarCheckIcon
              className="h-5 w-5 text-brand-600"
              aria-hidden="true" />
            
          </span>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
              Commit to a weekly pace
            </h2>
            <p className="mt-1 max-w-md text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
              {hasPlan ?
              `At ${weeklyHours}h per week you clear your ${plan.priorities.length} active skills in about ${plan.weeksToFinish} ${
              plan.weeksToFinish === 1 ? 'week' : 'weeks'} — by ${
              format(plan.finishDate, 'd MMM yyyy')}.` :
              'Add a skill to your active plan to get a pace and a target date.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Hours per week
            </p>
            <div
              className="flex items-center gap-1 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-1"
              role="group"
              aria-label="Study hours per week">
              
              {WEEKLY_HOUR_OPTIONS.map((option) =>
              <button
                key={option}
                type="button"
                onClick={() => setWeeklyHours(option)}
                aria-pressed={weeklyHours === option}
                className={`rounded-md px-2.5 py-1.5 text-[13px] font-semibold tabular-nums transition-colors duration-150 ease-smooth ${
                weeklyHours === option ?
                'bg-brand-600 text-white' :
                'text-slate-600 hover:bg-slate-100'}`
                }>
                
                  {option}h
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={!hasPlan}
            onClick={() =>
            toast.success(
              `Weekly check-in set for ${weeklyHours}h — we'll nudge you every Sunday until ${format(
                plan.finishDate,
                'd MMM'
              )}.`
            )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            
            <BellRingIcon className="h-4 w-4" aria-hidden="true" />
            Track my progress
          </button>
        </div>
      </div>
    </section>);

}
