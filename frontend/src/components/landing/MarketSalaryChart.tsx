"use client";

import React from 'react';
import { motion } from 'framer-motion';

const series = [
  { label: "Jun '23", value: 10.2 },
  { label: "Aug '23", value: 11.4 },
  { label: "Oct '23", value: 15.1 },
  { label: "Dec '23", value: 14.2 },
  { label: "Feb '24", value: 19.8 },
  { label: "Apr '24", value: 21.4 },
  { label: "Jun '24", value: 24.0 }
];

const WIDTH = 620;
const HEIGHT = 200;
const MAX = 30;
const PAD_LEFT = 38;
const PAD_BOTTOM = 26;

const points = series.map((point, index) => ({
  ...point,
  x: PAD_LEFT + (index / (series.length - 1)) * (WIDTH - PAD_LEFT - 12),
  y: HEIGHT - PAD_BOTTOM - (point.value / MAX) * (HEIGHT - PAD_BOTTOM - 14)
}));

const line = points.map((point) => `${point.x},${point.y}`).join(' ');
const area = `${PAD_LEFT},${HEIGHT - PAD_BOTTOM} ${line} ${points[points.length - 1].x},${
  HEIGHT - PAD_BOTTOM
}`;

export function MarketSalaryChart() {
  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[200px] w-full"
        role="img"
        aria-label="Average monthly salary for Data Analysts in Cairo"
      >
        <defs>
          <linearGradient id="market-salary-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 10, 20, 30].map((tick) => {
          const y = HEIGHT - PAD_BOTTOM - (tick / MAX) * (HEIGHT - PAD_BOTTOM - 14);
          return (
            <g key={tick}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - 12}
                y1={y}
                y2={y}
                stroke="#EDF2FB"
                strokeWidth="1"
              />
              <text
                x={PAD_LEFT - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fontWeight="500"
                fill="#94A3B8"
              >
                {tick === 0 ? '0' : `${tick}K`}
              </text>
            </g>
          );
        })}

        <polygon points={area} fill="url(#market-salary-area)" />
        <motion.polyline
          points={line}
          fill="none"
          stroke="#10B981"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        />

        {points.map((point, index) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r={index === points.length - 1 ? 4.5 : 3.4}
              fill="#FFFFFF"
              stroke="#10B981"
              strokeWidth="2.2"
            />
            <text
              x={point.x}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="#94A3B8"
            >
              {point.label}
            </text>
          </g>
        ))}

        {/* Callout on the latest point */}
        <g>
          <rect
            x={points[points.length - 1].x - 96}
            y={points[points.length - 1].y - 52}
            width="86"
            height="38"
            rx="8"
            fill="#FFFFFF"
            stroke="#E9EEF6"
          />
          <text
            x={points[points.length - 1].x - 53}
            y={points[points.length - 1].y - 36}
            textAnchor="middle"
            fontSize="10"
            fill="#64748B"
          >
            Jun &apos;24
          </text>
          <text
            x={points[points.length - 1].x - 53}
            y={points[points.length - 1].y - 23}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#0F172A"
          >
            EGP 24,000
          </text>
        </g>
      </svg>
    </figure>
  );
}
