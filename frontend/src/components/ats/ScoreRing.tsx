"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { ScoreBand } from '../../types/cv';
import { BAND_COLORS } from '../../utils/atsAnalysis';

import { useLanguage } from '@/contexts/LanguageContext';

interface ScoreRingProps {
  score: number;
  band: ScoreBand;
  /** Bump to replay the animation (e.g. after a re-upload). */
  runKey?: number;
}

const SIZE = 176;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ score, band, runKey = 0 }: ScoreRingProps) {
  const { isAr } = useLanguage();
  const displayed = useAnimatedNumber(score, runKey);
  const offset = CIRCUMFERENCE * (1 - displayed / 100);

  return (
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE }}
      role="img"
      aria-label={`ATS compatibility score ${score} out of 100`}>
      
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={STROKE} />
        
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={BAND_COLORS[band].ring}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="flex items-baseline gap-0.5">
          <span className="text-[44px] font-extrabold leading-none tracking-tight tabular-nums text-slate-900 dark:text-white">
            {Math.round(displayed)}
          </span>
          <span className="text-sm font-semibold text-slate-400">/100</span>
        </p>
        <p className="mt-1.5 max-w-[120px] text-[13px] font-medium leading-tight text-slate-500 dark:text-slate-400">
          {isAr ? "درجة توافق الـ ATS" : "ATS Compatibility Score"}
        </p>
      </div>
    </div>);

}

function useAnimatedNumber(target: number, runKey: number): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number | undefined>(undefined);
  const from = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(target);
      from.current = target;
      return;
    }

    const start = performance.now();
    const origin = from.current;
    const delta = target - origin;
    const duration = 700;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = origin + delta * eased;
      setValue(next);
      if (progress < 1) frame.current = requestAnimationFrame(tick);else
      from.current = target;
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      from.current = target;
    };
  }, [target, runKey]);

  return value;
}
