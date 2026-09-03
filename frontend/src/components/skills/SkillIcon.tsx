"use client";

import React from 'react';
import { TechIcon, techTile } from '@/components/icons/TechIcon';

const SIZES = {
  sm: { tile: 'h-8 w-8 rounded-lg', icon: 'h-4 w-4' },
  md: { tile: 'h-11 w-11 rounded-xl shadow-xs', icon: 'h-6 w-6' },
  lg: { tile: 'h-14 w-14 rounded-2xl shadow-sm', icon: 'h-8 w-8' },
  xl: { tile: 'h-18 w-18 rounded-2xl shadow-md', icon: 'h-10 w-10' }
};

interface SkillIconProps {
  skillId: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function SkillIcon({ skillId, size = 'md', className = '' }: SkillIconProps) {
  const normalized = (skillId || '').toLowerCase().trim();
  const dimensions = SIZES[size] || SIZES.md;
  const tileBg = techTile(normalized);

  return (
    <span
      className={`grid shrink-0 place-items-center border border-slate-200/80 dark:border-white/10 ${tileBg} transition-transform duration-200 hover:scale-105 ${dimensions.tile} ${className}`}
      aria-hidden="true"
    >
      <TechIcon name={normalized} className={dimensions.icon} />
    </span>
  );
}

export function skillColor(skillId: string): string {
  return '#3B82F6';
}
