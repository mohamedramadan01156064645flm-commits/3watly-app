import React from 'react';
import { ChartColumnIcon, GraduationCapIcon, TrophyIcon } from 'lucide-react';
import { TechIcon } from '../../icons/TechIcon';
import { surface } from '../../../utils/styles';
import type { PriorityItem, TechKey } from '../../../types/onboarding';

const impactBadge: Record<PriorityItem['impact'], string> = {
  High: 'bg-[#E8F8F0] dark:bg-emerald-950/50 text-[#0E8F55] dark:text-emerald-400',
  Medium: 'bg-[#F4EBFB] dark:bg-purple-950/50 text-[#7C2BC7] dark:text-purple-400',
  Low: 'bg-[#EEF3FE] dark:bg-blue-950/50 text-brand-blue dark:text-blue-400'
};

const tileByKey: Record<string, string> = {
  project: 'bg-[#EEF3FE] dark:bg-blue-950/50',
  certificate: 'bg-[#F4EBFB] dark:bg-purple-950/50',
  course: 'bg-[#E8F8F0] dark:bg-emerald-950/50',
  dashboard: 'bg-[#FEF2E4] dark:bg-amber-950/50'
};

function PriorityIcon({ itemKey }: {itemKey: PriorityItem['key'];}) {
  if (itemKey === 'project' || itemKey === 'dashboard') {
    return <ChartColumnIcon className="h-[19px] w-[19px] text-brand-blue dark:text-blue-400" strokeWidth={2} aria-hidden="true" />;
  }
  if (itemKey === 'certificate' || itemKey === 'course') {
    return (
      <GraduationCapIcon
        className="h-[19px] w-[19px] text-[#7C2BC7] dark:text-purple-400"
        strokeWidth={1.9}
        aria-hidden="true" />);
  }
  return <TechIcon name={itemKey as TechKey} className="h-[18px] w-[18px]" />;
}

function tileFor(itemKey: PriorityItem['key']) {
  return tileByKey[itemKey] ?? 'bg-[#E8F8F0] dark:bg-emerald-950/50';
}

interface PriorityStripProps {
  items: PriorityItem[];
}

export function PriorityStrip({ items }: PriorityStripProps) {
  return (
    <section
      className={`grid grid-cols-1 divide-y divide-slate-200/80 dark:divide-white/10 overflow-hidden lg:grid-cols-4 lg:divide-x lg:divide-y-0 ${surface}`}>

      <div className="flex items-start gap-4 p-6">
        <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#E8F8F0] dark:bg-emerald-950/50">
          <TrophyIcon className="h-[23px] w-[23px] text-brand-green dark:text-emerald-400" strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[16px] font-semibold text-[#0E8F55] dark:text-emerald-400">Top Priority for You</h2>
          <p className="mt-1.5 text-[13px] font-light leading-[1.55] text-slate-500 dark:text-slate-400">
            Improve these key areas to increase your match and stand out.
          </p>
        </div>
      </div>

      {items.map((item) =>
      <div key={item.title} className="flex items-start gap-3.5 p-6">
          <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tileFor(item.key)}`}>
            <PriorityIcon itemKey={item.key} />
          </span>
          <div>
            <h3 className="text-[14px] font-semibold leading-snug text-[#0B132B] dark:text-white">{item.title}</h3>
            <p className="mt-1.5 text-[13px] font-light leading-[1.5] text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
            <span
            className={`mt-3 inline-flex items-center rounded-md px-2.5 py-1 text-[11.5px] font-semibold ${impactBadge[item.impact]}`}>
              {item.impact} Impact
            </span>
          </div>
        </div>
      )}
    </section>);
}