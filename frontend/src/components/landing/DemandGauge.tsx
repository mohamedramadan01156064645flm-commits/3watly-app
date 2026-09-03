"use client";

import React from 'react';
import { motion } from 'framer-motion';

const CENTER = 80;
const RADIUS = 60;
const SCORE = 82;

const segments = [
  { from: 180, to: 137, color: '#EF4444' },
  { from: 137, to: 94, color: '#F59E0B' },
  { from: 94, to: 51, color: '#84CC16' },
  { from: 51, to: 8, color: '#10B981' }
];

function polar(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER - radius * Math.sin(radians)
  };
}

function arc(from: number, to: number) {
  const start = polar(from, RADIUS);
  const end = polar(to, RADIUS);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x.toFixed(
    2
  )} ${end.y.toFixed(2)}`;
}

export function DemandGauge() {
  const needleAngle = 180 - (SCORE / 100) * 180;
  const needle = polar(needleAngle, RADIUS - 14);

  return (
    <figure className="mt-4 flex flex-col items-center">
      <svg
        viewBox="0 0 160 100"
        className="h-[100px] w-[160px]"
        role="img"
        aria-label={`Market demand score ${SCORE} out of 100 — high`}
      >
        {segments.map((segment) => (
          <path
            key={segment.color}
            d={arc(segment.from, segment.to)}
            fill="none"
            stroke={segment.color}
            strokeWidth="11"
            strokeLinecap="round"
          />
        ))}

        <motion.g
          initial={{ rotate: -62 }}
          whileInView={{ rotate: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        >
          <line
            x1={CENTER}
            y1={CENTER}
            x2={needle.x}
            y2={needle.y}
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </motion.g>
        <circle cx={CENTER} cy={CENTER} r="5" fill="#0F172A" />
      </svg>

      <figcaption className="mt-1 text-[14px] font-medium text-slate-500">
        <span className="text-lg font-black text-emerald-600">{SCORE}</span> / 100
      </figcaption>
    </figure>
  );
}
