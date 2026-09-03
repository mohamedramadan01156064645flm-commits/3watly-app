import React from 'react';
import { ChartColumnIcon, SparklesIcon, TargetIcon } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { sidebarHighlights } from '../../data/roles';

const ILLUSTRATION = "/f332b1ae-0c59-46f6-9194-cb498c87548f.png";

const icons = {
  target: TargetIcon,
  market: ChartColumnIcon,
  growth: SparklesIcon
} as const;

const tones = {
  blue: { tile: 'bg-[#EEF3FE] dark:bg-indigo-950/60', icon: 'text-brand-blue dark:text-indigo-400' },
  green: { tile: 'bg-[#E8F8F0] dark:bg-emerald-950/60', icon: 'text-brand-green dark:text-emerald-400' },
  amber: { tile: 'bg-[#FFF6E5] dark:bg-amber-950/60', icon: 'text-[#E8A400] dark:text-amber-400' }
} as const;

interface OnboardingSidebarProps {
  step: number;
  totalSteps: number;
}

export function OnboardingSidebar({ step, totalSteps }: OnboardingSidebarProps) {
  return (
    <aside className="hidden w-[300px] shrink-0 flex-col justify-between border-r border-line dark:border-white/10 bg-[#FBFCFE] dark:bg-[#070B14] px-8 py-9 lg:flex xl:w-[320px]">
      <div>
        <Logo tagline={null} size="lg" />
        <p className="mt-2.5 text-[13px] font-normal text-ink-muted dark:text-slate-400">Career Intelligence Platform</p>

        <img
          src={ILLUSTRATION}
          alt="A profile report card with a donut chart and a rising green growth arrow"
          className="mt-8 w-full max-w-[240px] select-none object-contain mix-blend-multiply dark:mix-blend-normal"
          draggable={false}
        />

        <h2 className="mt-8 text-[14px] font-semibold text-ink dark:text-white">
          Your data. Smarter career decisions.
        </h2>
        <p className="mt-2 text-[12.5px] font-light leading-[1.6] text-ink-muted dark:text-slate-400">
          3WATLY analyzes the Egyptian job market to help you choose the right path and land high-fit
          opportunities.
        </p>

        <ul className="mt-7 space-y-5">
          {sidebarHighlights.map((item) => {
            const Icon = icons[item.icon];
            const tone = tones[item.tone];
            return (
              <li key={item.title} className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.tile}`}
                >
                  <Icon className={`h-[17px] w-[17px] ${tone.icon}`} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[12.5px] font-semibold leading-snug text-ink dark:text-white">{item.title}</h3>
                  <p className="mt-0.5 text-[11.5px] font-light leading-[1.55] text-ink-muted dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-2 pt-8" aria-hidden="true">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={index}
            className={`h-[7px] rounded-full transition-[width,background-color] duration-200 ease-smooth ${
              index + 1 === step ? 'w-[7px] bg-brand-blue dark:bg-[#818CF8]' : 'w-[7px] bg-[#D7DEEE] dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </aside>
  );
}