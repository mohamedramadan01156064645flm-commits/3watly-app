"use client";

import React from 'react';
import {
  ArrowRightIcon,
  BriefcaseIcon,
  ClockIcon,
  TrendingUpIcon,
  WalletIcon } from
'lucide-react';
import { InfoTip } from '../ui/InfoTip';
import type { SkillPlan } from '../../types/skills';

export function ImpactCard({ plan }: {plan: SkillPlan;}) {
  const { role } = plan;
  const stats = [
  {
    icon: BriefcaseIcon,
    value: role.openJobs.toLocaleString(),
    label: 'Open jobs'
  },
  {
    icon: TrendingUpIcon,
    value: `+${role.yoyGrowth}%`,
    label: 'Growth (YoY)'
  },
  {
    icon: WalletIcon,
    value: `EGP ${role.salaryEgpK}K`,
    label: 'Avg. salary'
  },
  {
    icon: ClockIcon,
    value: `${role.timeToHireDays} days`,
    label: 'Time to hire'
  }];


  return (
    <section
      aria-label="Impact of your plan"
      className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
      
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
        Impact of your plan
        <InfoTip
          align="right"
          label="Projected from the share of postings that ask for each skill you are still missing, dampened for skills that usually appear together." />
        
      </h2>

      <div className="mt-3 flex items-end gap-3">
        <p className="text-[34px] font-extrabold leading-none tabular-nums text-brand-700">
          ×{plan.multiplier}
        </p>
        <p className="pb-1 text-[13px] font-medium leading-snug text-slate-600">
          more postings you
          <br />
          fully match
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-brand-100 bg-white dark:bg-[#0B1120] px-3 py-2 text-[13px]">
        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
          {plan.eligibleJobs.toLocaleString()}
        </span>
        <ArrowRightIcon
          className="h-3.5 w-3.5 text-slate-400"
          aria-hidden="true" />
        
        <span className="font-bold tabular-nums text-emerald-600">
          {plan.potentialJobs.toLocaleString()}
        </span>
        <span className="text-slate-500 dark:text-slate-400">postings after your plan</span>
      </div>

      {plan.salaryUplift > 0 &&
      <p className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
          <WalletIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Up to +EGP {plan.salaryUplift}K/month typical uplift
        </p>
      }

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-brand-100 pt-4">
        {stats.map(({ icon: Icon, value, label }) =>
        <div key={label} className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold tabular-nums text-slate-900 dark:text-white">
                {value}
              </p>
              <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
        {role.name} · {role.city} market
      </p>
    </section>);

}
