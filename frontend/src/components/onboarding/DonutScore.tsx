import React from 'react';
import { animate, motion } from 'framer-motion';
import { EASE } from '../../utils/motion';
import { surface } from '../../utils/styles';

type Tone = 'blue' | 'green' | 'violet' | 'amber';

const tones: Record<Tone, {stroke: string; strokeDark: string; badge: string;}> = {
  blue:   { stroke: '#1B57E0', strokeDark: '#60A5FA', badge: 'bg-[#EEF3FE] dark:bg-blue-950/50 text-brand-blue dark:text-blue-400' },
  green:  { stroke: '#0E9F63', strokeDark: '#34D399', badge: 'bg-[#E8F8F0] dark:bg-emerald-950/50 text-[#0E8F55] dark:text-emerald-400' },
  violet: { stroke: '#7C2BC7', strokeDark: '#C084FC', badge: 'bg-[#F4EBFB] dark:bg-purple-950/50 text-[#7C2BC7] dark:text-purple-400' },
  amber:  { stroke: '#EA8207', strokeDark: '#FBBF24', badge: 'bg-[#FEF2E4] dark:bg-amber-950/50 text-[#C2650B] dark:text-amber-400' }
};

interface DonutScoreProps {
  title: string;
  value: number;
  label: string;
  tone: Tone;
  delay?: number;
}

export function DonutScore({ title, value, label, tone, delay = 0 }: DonutScoreProps) {
  const { stroke, strokeDark, badge } = tones[tone];
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const [display, setDisplay] = React.useState(0);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.9,
      delay,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });
    return () => controls.stop();
  }, [value, delay]);

  const activeStroke = isDark ? strokeDark : stroke;

  return (
    <section className={`flex flex-col items-center px-5 py-6 ${surface}`}>
      <h3 className="text-[14px] font-semibold text-[#0B132B] dark:text-white">{title}</h3>

      <div className="relative mt-4 h-[112px] w-[112px]">
        <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="55" cy="55" r={radius} fill="none" className="stroke-[#EBEEF5] dark:stroke-slate-700/60" strokeWidth="9" />
          <motion.circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={activeStroke}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
            transition={{ duration: 0.9, delay, ease: EASE }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[25px] font-bold tracking-[-0.02em] text-[#0B132B] dark:text-white">
          {display}%
        </span>
      </div>

      <span className={`mt-4 rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold ${badge}`}>
        {label}
      </span>
      <span className="sr-only">{`${title}: ${value} percent — ${label}`}</span>
    </section>);
}