import React from 'react';
import {
  ChartColumnIcon,
  ChevronRightIcon,
  FileBadgeIcon,
  FolderIcon,
  GraduationCapIcon,
  ListIcon
} from 'lucide-react';
import { PanelCard } from './PanelCard';
import type { RecommendedAction } from '../../../types/onboarding';

const visuals: Record<string, { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; tile: string; color: string }> = {
  course: { Icon: GraduationCapIcon, tile: 'bg-[#E8F8F0] dark:bg-emerald-950/60', color: 'text-brand-green dark:text-emerald-400' },
  project: { Icon: FolderIcon, tile: 'bg-[#EEF3FE] dark:bg-blue-950/60', color: 'text-brand-blue dark:text-blue-400' },
  certificate: { Icon: FileBadgeIcon, tile: 'bg-[#F4EBFB] dark:bg-purple-950/60', color: 'text-[#7C2BC7] dark:text-purple-400' },
  dashboard: { Icon: ChartColumnIcon, tile: 'bg-[#FEF2E4] dark:bg-amber-950/60', color: 'text-[#C2650B] dark:text-amber-400' }
};

interface ActionsListProps {
  actions: RecommendedAction[];
}

export function ActionsList({ actions }: ActionsListProps) {
  return (
    <PanelCard
      icon={<ListIcon className="h-[19px] w-[19px] text-brand-green dark:text-emerald-400" strokeWidth={2.1} aria-hidden="true" />}
      title="Recommended Actions"
      footerLabel="Explore all actions">

      <ul className="space-y-3">
        {actions.map((action) => {
          const visual = visuals[action.key] ?? visuals.course;
          const { Icon } = visual;
          return (
            <li key={action.title}>
              <button
                type="button"
                className="group flex w-full items-center gap-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131C31] px-3.5 py-3 text-left transition-[border-color,background-color,transform] duration-150 ease-smooth active:scale-[0.99] hover:border-slate-300 dark:hover:border-white/20 hover:bg-[#FAFCFF] dark:hover:bg-[#18243E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${visual.tile}`}>
                  <Icon className={`h-[19px] w-[19px] ${visual.color}`} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-[#0B132B] dark:text-white">
                    {action.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[12.5px] font-light text-slate-500 dark:text-slate-400">
                    {action.meta}
                  </span>
                </span>
                <ChevronRightIcon
                  className="h-[18px] w-[18px] shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ease-smooth group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true" />
              </button>
            </li>);
        })}
      </ul>
    </PanelCard>);
}