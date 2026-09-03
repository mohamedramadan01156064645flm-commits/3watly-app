import React from 'react';
import { TargetIcon, UserIcon } from 'lucide-react';
import { PanelCard } from './PanelCard';
import type { TargetRole } from '../../../types/onboarding';

interface TargetRolesProps {
  roles: TargetRole[];
}

export function TargetRoles({ roles }: TargetRolesProps) {
  return (
    <PanelCard
      icon={<TargetIcon className="h-[19px] w-[19px] text-brand-blue dark:text-indigo-400" strokeWidth={2} aria-hidden="true" />}
      title="Roles You Can Target"
      footerLabel="See all matching roles">

      <ul className="space-y-3">
        {roles.map((role) =>
        <li
          key={role.title}
          className="flex items-center gap-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131C31] px-3.5 py-3 transition-[border-color,background-color] duration-150 ease-smooth hover:border-slate-300 dark:hover:border-white/20 hover:bg-[#FAFCFF] dark:hover:bg-[#18243E]">

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-[#0B1120]/5">
              <UserIcon className="h-[19px] w-[19px] text-slate-400 dark:text-slate-400" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-[#0B132B] dark:text-white">{role.title}</span>
              <span className="mt-0.5 block text-[12.5px] font-light text-slate-500 dark:text-slate-400">{role.label}</span>
            </span>
            <span
            className={`shrink-0 text-[15px] font-bold tracking-[-0.01em] ${
            role.match >= 65 ? 'text-[#0E9F63] dark:text-emerald-400' : 'text-[#EA8207] dark:text-amber-400'}`
            }>
              {role.match}%
            </span>
          </li>
        )}
      </ul>
    </PanelCard>);
}