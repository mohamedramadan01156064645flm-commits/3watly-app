"use client";

import React from 'react';




const nodes = [
  { x: '6%', y: '50%', color: '56 189 248', size: 6, delay: '0s' },
  { x: '18%', y: '24%', color: '0 210 255', size: 8, delay: '1.2s' },
  { x: '30%', y: '74%', color: '168 85 247', size: 7, delay: '2.4s' },
  { x: '44%', y: '26%', color: '251 191 36', size: 6, delay: '0.8s' },
  { x: '58%', y: '74%', color: '56 189 248', size: 8, delay: '3.1s' },
  { x: '72%', y: '24%', color: '45 212 191', size: 7, delay: '1.9s' },
  { x: '86%', y: '72%', color: '192 132 252', size: 6, delay: '2.7s' },
  { x: '96%', y: '36%', color: '56 189 248', size: 7, delay: '1.0s' }
];


export function MarqueeBackdrop() {
  return (
    <div 
      className="pointer-events-none absolute inset-0 overflow-hidden select-none" 
      style={{ contain: 'strict', transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      {/* Sinuous Glowing Energy Wave SVG — GPU Accelerated, Zero SVG Filter Overhead */}
      <svg
        className="tech-marquee-wave absolute inset-0 h-full w-full"
        viewBox="0 0 1600 360"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main Primary Stream Gradient */}
          <linearGradient id="wave-gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0" />
            <stop offset="12%" stopColor="#00D2FF" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#38BDF8" stopOpacity="1" />
            <stop offset="48%" stopColor="#A855F7" stopOpacity="0.95" />
            <stop offset="68%" stopColor="#00D2FF" stopOpacity="1" />
            <stop offset="86%" stopColor="#2DD4BF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>

          {/* Secondary Counter-Harmonic Stream Gradient */}
          <linearGradient id="wave-gradient-counter" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
            <stop offset="15%" stopColor="#C084FC" stopOpacity="0.85" />
            <stop offset="38%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="62%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#C084FC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- LAYER 1: Wide Soft Atmospheric Halo (Pure GPU strokes, no filter lag) --- */}
        <g fill="none" opacity="0.75">
          <path
            d="M -30 180 C 130 80, 270 280, 430 180 S 710 80, 870 180 S 1150 280, 1330 180 S 1490 80, 1650 180"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="12"
            opacity="0.14"
          />
          <path
            d="M -30 180 C 130 280, 270 80, 430 180 S 710 280, 870 180 S 1150 80, 1330 180 S 1490 280, 1650 180"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="10"
            opacity="0.12"
          />
        </g>

        {/* --- LAYER 2: Medium Luminous Bloom Halo --- */}
        <g fill="none">
          <path
            d="M -30 180 C 130 80, 270 280, 430 180 S 710 80, 870 180 S 1150 280, 1330 180 S 1490 80, 1650 180"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="6"
            opacity="0.32"
          />
          <path
            d="M -30 180 C 130 280, 270 80, 430 180 S 710 280, 870 180 S 1150 80, 1330 180 S 1490 280, 1650 180"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="5"
            opacity="0.28"
          />
        </g>

        {/* --- LAYER 3: Razor-Sharp Core Paths & Delicate Filaments --- */}
        <g fill="none" strokeLinecap="round">
          {/* Primary wave crisp core */}
          <path
            d="M -30 180 C 130 80, 270 280, 430 180 S 710 80, 870 180 S 1150 280, 1330 180 S 1490 80, 1650 180"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="2"
            opacity="0.95"
          />

          {/* Counter wave crisp core */}
          <path
            d="M -30 180 C 130 280, 270 80, 430 180 S 710 280, 870 180 S 1150 80, 1330 180 S 1490 280, 1650 180"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="1.6"
            opacity="0.92"
          />

          {/* Delicate harmonic filament threads */}
          <path
            d="M -30 200 C 170 130, 340 230, 540 160 S 920 230, 1140 150 S 1420 220, 1650 170"
            stroke="url(#wave-gradient-primary)"
            strokeWidth="0.8"
            opacity="0.45"
          />
          <path
            d="M -30 160 C 190 230, 380 130, 620 210 S 1000 120, 1240 210 S 1460 130, 1650 165"
            stroke="url(#wave-gradient-counter)"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </g>
      </svg>

      {/* Glowing spark nodes */}
      {nodes.map((node, i) => (
        <span
          key={`node-${i}`}
          className="absolute animate-glow-drift rounded-full pointer-events-none"
          style={{
            left: node.x,
            top: node.y,
            height: node.size,
            width: node.size,
            animationDelay: node.delay,
            background: '#ffffff',
            boxShadow: `0 0 6px 1.5px rgb(${node.color} / 0.9), 0 0 14px 4px rgb(${node.color} / 0.35)`
          }}
        />
      ))}
    </div>
  );
}
