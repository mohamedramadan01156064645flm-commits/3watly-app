"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
  ariaLabel: string;
}

export function ProgressRing({
  value,
  size = 92,
  stroke = 9,
  color = '#10B981',
  track = '#E2E8F0',
  children,
  ariaLabel
}: ProgressRingProps) {
  const animated = useAnimatedValue(value);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}>
      
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={stroke} />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - animated / 100)} />
        
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children ??
        <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
            {Math.round(animated)}%
          </span>
        }
      </div>
    </div>);

}

function useAnimatedValue(target: number): number {
  const [value, setValue] = useState(0);
  const from = useRef(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target;
      setValue(target);
      return;
    }
    const origin = from.current;
    const delta = target - origin;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 600);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(origin + delta * eased);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      from.current = target;
    };
  }, [target]);

  return value;
}
