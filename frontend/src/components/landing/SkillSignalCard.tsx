"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DockerGlyph, PythonGlyph, SqlGlyph } from '../brand/TechGlyphs';

type SkillGlyph = 'python' | 'sql' | 'docker';

const glyphs: Record<SkillGlyph, (props: { className?: string }) => React.JSX.Element> = {
  python: PythonGlyph,
  sql: SqlGlyph,
  docker: DockerGlyph
};

interface SkillSignalCardProps {
  name: string;
  glyph: SkillGlyph;
  filled: number;
  delay?: number;
}

export function SkillSignalCard({ name, glyph, filled, delay = 0 }: SkillSignalCardProps) {
  const Glyph = glyphs[glyph];

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group flex h-[76px] items-center gap-3.5 rounded-[22px] border border-slate-200/90 dark:border-indigo-500/30 bg-white/95 dark:bg-gradient-to-r dark:from-[#0F172E] dark:via-[#0B1224] dark:to-[#070C1A] backdrop-blur-2xl px-4 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_0_25px_rgba(99,102,241,0.2),0_15px_35px_-10px_rgba(0,0,0,0.9)] hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-400/60 transition-all duration-300 cursor-pointer"
    >
      {/* Brand Icon with glowing background ring */}
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform">
        <Glyph className="h-6 w-6" />
      </span>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-[1.05rem] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {name}
          </p>
          <span className="text-[10.5px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-500/30">
            {filled === 5 ? 'Top' : 'High'}
          </span>
        </div>
        
        {/* 6 Skill Dots */}
        <div
          className="mt-1.5 flex items-center gap-[6px]"
          role="img"
          aria-label={`Market demand ${filled} out of 6`}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className={`h-[8px] w-[8px] rounded-full transition-all duration-200 ${
                index < filled 
                  ? 'bg-[#10B981] shadow-sm shadow-emerald-500/50 dark:shadow-[0_0_8px_rgba(16,185,129,0.8)] ring-1 ring-emerald-400/40' 
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
