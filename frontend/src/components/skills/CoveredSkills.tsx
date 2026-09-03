"use client";

import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { SkillIcon } from './SkillIcon';
import type { SkillPlan } from '../../types/skills';

export function CoveredSkills({ plan }: {plan: SkillPlan;}) {
  if (plan.covered.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white dark:bg-[#0B1120] px-5 py-4">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          None of this role's core skills were detected on your CV yet. Add them
          in the CV Builder as you learn them.
        </p>
      </section>);

  }

  return (
    <section
      aria-label="Skills already covered"
      className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] px-5 py-4 shadow-card">
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
          <CheckCircle2Icon
            className="h-4 w-4 text-emerald-500"
            aria-hidden="true" />
          
          Already on your CV ({plan.covered.length})
        </h2>
        <p className="text-[11px] text-slate-400">
          Detected from your CV skills, summary and experience
        </p>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {plan.covered.map((item) =>
        <li
          key={item.def.id}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] py-1.5 pl-1.5 pr-3">
          
            <SkillIcon skillId={item.def.id} size="sm" />
            <span className="text-[13px] font-semibold text-slate-800">
              {item.def.name}
            </span>
            <span className="text-[11px] tabular-nums text-slate-400">
              {item.demand}%
            </span>
          </li>
        )}
      </ul>
    </section>);

}
