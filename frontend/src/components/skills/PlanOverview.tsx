"use client";

import React from 'react';
import { BriefcaseIcon, TargetIcon } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { InfoTip } from '../ui/InfoTip';
import type { SkillPlan } from '../../types/skills';

interface PlanOverviewProps {
  plan: SkillPlan;
  onChangeTarget: () => void;
}

function readinessLabel(pct: number): string {
  if (pct >= 75) return 'Ready for senior postings';
  if (pct >= 55) return 'Ready for most mid-level postings';
  if (pct >= 35) return 'Ready for junior postings';
  return 'Early — core skills still missing';
}

export function PlanOverview({ plan, onChangeTarget }: PlanOverviewProps) {
  const { role } = plan;

  return (
    <section
      aria-label="Plan overview"
      className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-card">
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr] lg:gap-8">
        <div className="flex items-center gap-5">
          <ProgressRing
            value={plan.progressPct}
            size={104}
            color="#2563EB"
            ariaLabel={`Plan progress ${plan.progressPct} percent`}>
            
            <span className="text-center">
              <span className="block text-[26px] font-extrabold leading-none tabular-nums text-slate-900 dark:text-white">
                {plan.progressPct}%
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                covered
              </span>
            </span>
          </ProgressRing>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Your role coverage
            </p>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              {plan.coveredSteps} of {plan.totalSteps} core skills already on
              your CV
            </p>
            <div className="mt-3 flex h-2 w-44 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-brand-600 transition-[width] duration-300 ease-smooth"
                style={{ width: `${plan.progressPct}%` }} />
              
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {plan.totalSteps - plan.coveredSteps} skills left ·{' '}
              {plan.remainingHours}h in your active plan
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-5 border-slate-200/80 dark:border-white/10 sm:grid-cols-3 lg:border-l lg:pl-8">
          <div>
            <dt className="text-[13px] text-slate-500 dark:text-slate-400">Target role</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[17px] font-bold text-slate-900 dark:text-white">
                <TargetIcon
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true" />
                
                {role.name}
              </span>
              <button
                type="button"
                onClick={onChangeTarget}
                className="rounded-md border border-slate-200/80 dark:border-white/10 px-2 py-1 text-[11px] font-semibold text-brand-700 transition-colors duration-150 ease-smooth hover:bg-brand-50">
                
                Change
              </button>
            </dd>
            <p className="mt-1 text-[11px] text-slate-400">
              {role.city} market · EGP {role.salaryEgpK}K avg
            </p>
          </div>

          <div>
            <dt className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400">
              Role readiness
              <InfoTip
                label="Share of this role's demand weight that your current CV already covers. In-progress skills count partially." />
              
            </dt>
            <dd className="mt-1 text-[22px] font-extrabold tabular-nums text-emerald-600">
              {plan.readinessPct}%
            </dd>
            <p className="mt-1 text-[11px] text-slate-400">
              {readinessLabel(plan.readinessPct)}
            </p>
          </div>

          <div>
            <dt className="flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400">
              Postings you match
              <InfoTip
                align="right"
                label={`Of ${role.openJobs.toLocaleString()} open ${role.name} postings in ${role.city}, this many ask for nothing you are missing.`} />
              
            </dt>
            <dd className="mt-1 flex items-baseline gap-1.5">
              <span className="inline-flex items-center gap-2 text-[22px] font-extrabold tabular-nums text-slate-900 dark:text-white">
                <BriefcaseIcon
                  className="h-4 w-4 text-slate-400"
                  aria-hidden="true" />
                
                {plan.eligibleJobs.toLocaleString()}
              </span>
              <span className="text-[13px] text-slate-400">
                / {role.openJobs.toLocaleString()}
              </span>
            </dd>
            <p className="mt-1 text-[11px] font-semibold text-brand-700">
              ×{plan.multiplier} after your active plan
            </p>
          </div>
        </dl>
      </div>
    </section>);

}
