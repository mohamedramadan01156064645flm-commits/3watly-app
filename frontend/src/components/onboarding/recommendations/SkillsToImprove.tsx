import React from 'react';
import { motion } from 'framer-motion';
import { ChartNoAxesColumnIncreasingIcon } from 'lucide-react';
import { PanelCard } from './PanelCard';
import { TechIcon, techTile } from '../../icons/TechIcon';
import type { Impact, SkillGap } from '../../../types/onboarding';

const impactBadge: Record<Impact, string> = {
  High: 'bg-[#E8F8F0] dark:bg-emerald-950/50 text-[#0E8F55] dark:text-emerald-400',
  Medium: 'bg-[#FEF2E4] dark:bg-amber-950/50 text-[#C2650B] dark:text-amber-400',
  Low: 'bg-[#EEF3FE] dark:bg-blue-950/50 text-brand-blue dark:text-blue-400'
};

interface SkillsToImproveProps {
  skills: SkillGap[];
}

export function SkillsToImprove({ skills }: SkillsToImproveProps) {
  return (
    <PanelCard
      icon={
      <ChartNoAxesColumnIncreasingIcon
        className="h-[19px] w-[19px] text-brand-green dark:text-emerald-400"
        strokeWidth={2.1}
        aria-hidden="true" />
      }
      title="Skills to Improve"
      footerLabel="See all skills analysis">

      <ul className="space-y-4">
        {skills.map((skill, index) =>
        <li key={skill.name} className="flex items-center gap-3">
            <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${techTile(skill.key)}`}>
              <TechIcon name={skill.key} className="h-[17px] w-[17px]" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-[#0B132B] dark:text-white">{skill.name}</p>
              <div className="mt-1.5 flex items-center gap-2.5">
                <span className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#E7EAF3] dark:bg-slate-700/60">
                  <motion.span
                  className="block h-full rounded-full bg-brand-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.06,
                    ease: [0.23, 1, 0.32, 1]
                  }} />
                </span>
                <span className="w-9 shrink-0 text-right text-[12.5px] font-semibold text-[#475569] dark:text-slate-300">
                  {skill.level}%
                </span>
              </div>
            </div>

            <span
            className={`w-[68px] shrink-0 rounded-md py-1 text-center text-[11.5px] font-semibold ${impactBadge[skill.impact]}`}>
              {skill.impact}
            </span>
          </li>
        )}
      </ul>
    </PanelCard>);
}