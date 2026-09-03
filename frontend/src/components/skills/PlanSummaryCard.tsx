"use client";

import React from 'react';
import { ClipboardListIcon } from 'lucide-react';
import { InfoTip } from '../ui/InfoTip';
import { formatHours } from './SkillRow';
import type { SkillPlan } from '../../types/skills';

export function PlanSummaryCard({ plan }: {plan: SkillPlan;}) {
  const rows = [
  { label: 'Core skills for this role', value: `${plan.totalSteps}` },
  { label: 'Already covered', value: `${plan.coveredSteps}` },
  {
    label: 'Gaps remaining',
    value: `${plan.totalSteps - plan.coveredSteps}`
  },
  { label: 'In your active plan', value: `${plan.priorities.length}` },
  {
    label: 'Focused time left',
    value: formatHours(plan.remainingHours)
  }];


  return (
    <section
      aria-label="Plan summary"
      className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-card">
      
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
        <ClipboardListIcon
          className="h-4 w-4 text-brand-600"
          aria-hidden="true" />
        
        Plan summary
        <InfoTip
          align="right"
          label="Everything here is derived from your CV against the core skills for your target role." />
        
      </h2>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="bg-emerald-500 transition-[width] duration-300 ease-smooth"
          style={{ width: `${plan.progressPct}%` }} />
        
        <div
          className="bg-brand-500 transition-[width] duration-300 ease-smooth"
          style={{
            width: `${plan.priorities.length / plan.totalSteps * 100}%`
          }} />
        
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500"
            aria-hidden="true" />
          
          Covered
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full bg-brand-500"
            aria-hidden="true" />
          
          Active plan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full bg-slate-300"
            aria-hidden="true" />
          
          Later
        </span>
      </div>

      <dl className="mt-4 divide-y divide-slate-100">
        {rows.map((row) =>
        <div
          key={row.label}
          className="flex items-center justify-between gap-3 py-2.5">
          
            <dt className="text-[13px] text-slate-500 dark:text-slate-400">{row.label}</dt>
            <dd className="text-[13px] font-bold tabular-nums text-slate-900 dark:text-white">
              {row.value}
            </dd>
          </div>
        )}
      </dl>
    </section>);

}
