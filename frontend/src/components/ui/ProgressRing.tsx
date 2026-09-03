"use client";

import React from 'react';
import { motion } from 'framer-motion';

type RingTone = 'success' | 'primary';

const strokes: Record<RingTone, string> = {
  success: '#10B981',
  primary: '#4F46E5'
};

interface ProgressRingProps {
  value: number;
  size?: number;
  thickness?: number;
  tone?: RingTone;
  label?: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export function ProgressRing({
  value,
  size = 148,
  thickness = 12,
  tone = 'success',
  label,
  className = '',
  valueClassName = 'text-[2.5rem]',
  labelClassName = 'text-xs'
}: ProgressRingProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={thickness}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokes[tone]}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - value / 100) }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className={`flex items-baseline font-bold leading-none tracking-tight ${
            tone === 'success' ? 'text-emerald-500' : 'text-indigo-600'
          } ${valueClassName}`}
        >
          {value}
          <span className="text-[0.55em] font-semibold tracking-tight">%</span>
        </p>
        {label ? (
          <p className={`mt-1 font-medium text-slate-500 dark:text-slate-400 ${labelClassName}`}>{label}</p>
        ) : null}
      </div>
    </div>
  );
}
