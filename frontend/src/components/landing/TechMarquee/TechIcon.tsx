"use client";

import React from 'react';
import { 
  SiDocker, 
  SiMongodb, 
  SiPandas, 
  SiPython, 
  SiReact, 
  SiNodedotjs, 
  SiTypescript, 
  SiPostgresql, 
  SiKubernetes, 
  SiGit 
} from 'react-icons/si';
import { BrainCircuit, UploadCloud } from 'lucide-react';
import type { TechIconName } from '@/data/techStack';

interface TechIconProps {
  name: TechIconName;
  color?: string;
}

export function TechIcon({ name }: TechIconProps) {
  switch (name) {
    case 'sql':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
          {/* 3D Cylinder Database Stack */}
          <ellipse cx="12" cy="5.5" rx="8" ry="3" className="fill-sky-100 dark:fill-[#0284C7]/40 stroke-sky-600 dark:stroke-[#38BDF8]" strokeWidth="1.6" />
          <path d="M4 5.5v5.5c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5" className="stroke-sky-600 dark:stroke-[#38BDF8]" strokeWidth="1.6" />
          <path d="M4 11v5.5c0 1.66 3.58 3 8 3s8-1.34 8-3V11" className="stroke-sky-600 dark:stroke-[#38BDF8]" strokeWidth="1.6" />
          <ellipse cx="12" cy="5.5" rx="5" ry="1.8" className="fill-sky-600 dark:fill-[#38BDF8]" fillOpacity="0.85" />
        </svg>
      );

    case 'python':
      return (
        <span className="relative block h-full w-full">
          <SiPython
            className="absolute inset-0 h-full w-full text-[#0284C7] dark:text-[#38BDF8]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            aria-hidden="true"
          />
          <SiPython
            className="absolute inset-0 h-full w-full text-[#D97706] dark:text-[#FACC15]"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            aria-hidden="true"
          />
        </span>
      );

    case 'react':
      return (
        <SiReact
          className="h-full w-full text-[#0284C7] dark:text-[#38BDF8]"
          aria-hidden="true"
        />
      );

    case 'pandas':
      return (
        <SiPandas
          className="h-full w-full text-purple-700 dark:text-[#C084FC]"
          aria-hidden="true"
        />
      );

    case 'nodejs':
      return (
        <SiNodedotjs
          className="h-full w-full text-emerald-600 dark:text-[#22C55E]"
          aria-hidden="true"
        />
      );

    case 'powerbi':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
          <rect x="3" y="12" width="4.5" height="9" rx="1.2" className="fill-amber-600/80 dark:fill-[#FBBF24]/75" />
          <rect x="9.8" y="7.5" width="4.5" height="13.5" rx="1.2" className="fill-amber-600/90 dark:fill-[#FBBF24]/90" />
          <rect x="16.5" y="3" width="4.5" height="18" rx="1.2" className="fill-amber-600 dark:fill-[#FBBF24]" />
        </svg>
      );

    case 'typescript':
      return (
        <SiTypescript
          className="h-full w-full text-blue-600 dark:text-[#3B82F6]"
          aria-hidden="true"
        />
      );

    case 'ml':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full text-indigo-600 dark:text-[#A5B4FC]" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" opacity="0.45" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.3" opacity="0.75">
            <path d="M12 9V4M12 15v5M9 12H4M15 12h5M9.8 9.8L6.2 6.2M14.2 14.2l3.6 3.6M14.2 9.8l3.6-3.6M9.8 14.2l-3.6 3.6" />
          </g>
          <g fill="currentColor">
            <circle cx="12" cy="3.5" r="1.6" />
            <circle cx="12" cy="20.5" r="1.6" />
            <circle cx="3.5" cy="12" r="1.6" />
            <circle cx="20.5" cy="12" r="1.6" />
            <circle cx="6" cy="6" r="1.3" />
            <circle cx="18" cy="18" r="1.3" />
            <circle cx="18" cy="6" r="1.3" />
            <circle cx="6" cy="18" r="1.3" />
          </g>
        </svg>
      );

    case 'postgresql':
      return (
        <SiPostgresql
          className="h-full w-full text-[#1E40AF] dark:text-[#60A5FA]"
          aria-hidden="true"
        />
      );

    case 'cloud':
      return (
        <UploadCloud
          className="h-full w-full text-sky-600 dark:text-[#38BDF8]"
          strokeWidth={1.9}
          aria-hidden="true"
        />
      );

    case 'docker':
      return (
        <SiDocker
          className="h-full w-full text-sky-600 dark:text-[#60A5FA]"
          aria-hidden="true"
        />
      );

    case 'kubernetes':
      return (
        <SiKubernetes
          className="h-full w-full text-blue-600 dark:text-[#6366F1]"
          aria-hidden="true"
        />
      );

    case 'etl':
      return (
        <svg viewBox="0 0 24 24" className="h-full w-full text-teal-600 dark:text-[#2DD4BF]" fill="none" aria-hidden="true">
          <path
            d="M6 6h5.5M6 18h5.5M11.5 6c0 3.5 2 6 6.5 6M11.5 18c0-3.5 2-6 6.5-6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="4" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.7" fill="currentColor" fillOpacity="0.25" />
          <circle cx="4" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.7" fill="currentColor" fillOpacity="0.25" />
          <circle cx="20" cy="12" r="2.8" fill="currentColor" />
        </svg>
      );

    case 'mongodb':
      return (
        <SiMongodb
          className="h-full w-full text-emerald-600 dark:text-[#4ADE80]"
          aria-hidden="true"
        />
      );

    case 'git':
      return (
        <SiGit
          className="h-full w-full text-[#EA580C] dark:text-[#FB923C]"
          aria-hidden="true"
        />
      );

    case 'ai':
      return (
        <BrainCircuit
          className="h-full w-full text-purple-600 dark:text-[#E879F9]"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      );

    default:
      return null;
  }
}
