"use client";

import React from 'react';
import { motion } from 'framer-motion';

const values = [10, 22, 30, 38, 42, 34, 54, 60, 74, 92];
const labels = ["May '23", "Aug '23", "Nov '23", "Feb '24", "May '24"];

const WIDTH = 300;
const HEIGHT = 104;

const points = values.map((value, index) => {
  const x = (index / (values.length - 1)) * (WIDTH - 8) + 4;
  const y = HEIGHT - (value / 100) * (HEIGHT - 16) - 8;
  return { x, y };
});

const line = points.map((point) => `${point.x},${point.y}`).join(' ');
const area = `4,${HEIGHT} ${line} ${WIDTH - 4},${HEIGHT}`;

export function SalaryTrendChart() {
  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[104px] w-full overflow-visible"
        role="img"
        aria-label="Average monthly salary rising steadily over the last twelve months"
      >
        <defs>
          <linearGradient id="salary-area-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="salary-area-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1="4"
            x2={WIDTH - 4}
            y1={HEIGHT * ratio}
            y2={HEIGHT * ratio}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="1"
          />
        ))}

        <polygon points={area} className="fill-[url(#salary-area-light)] dark:fill-[url(#salary-area-dark)]" />
        
        <motion.polyline
          points={line}
          fill="none"
          stroke="#6366F1"
          className="dark:stroke-[#818CF8]"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
        />

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3.4"
            className="fill-white dark:fill-[#0D1322] stroke-[#6366F1] dark:stroke-[#818CF8]"
            strokeWidth="2.2"
          />
        ))}
      </svg>
      <figcaption className="mt-2 flex justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </figcaption>
    </figure>
  );
}
