"use client";

import React from 'react';
import type { Feature, FeatureIcon } from '../../data/features';
import { useLanguage } from '@/contexts/LanguageContext';

const toneClasses: Record<Feature['tone'], { icon: string; tile: string }> = {
  blue: { 
    icon: 'text-[#1B57E0] dark:text-[#60A5FA]', 
    tile: 'bg-[#EEF3FE] dark:bg-blue-950/70 dark:border dark:border-blue-500/20' 
  },
  green: { 
    icon: 'text-[#12B76A] dark:text-[#34D399]', 
    tile: 'bg-[#E8F8F0] dark:bg-emerald-950/70 dark:border dark:border-emerald-500/20' 
  },
  violet: { 
    icon: 'text-[#4F46E5] dark:text-[#A78BFA]', 
    tile: 'bg-[#EEEDFD] dark:bg-indigo-950/70 dark:border dark:border-indigo-500/20' 
  }
};

function Icon({ name, className }: { name: FeatureIcon; className: string }) {
  switch (name) {
    case 'matching':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="4.5" cy="6" r="1.6" fill="currentColor" />
          <circle cx="4.5" cy="12" r="1.6" fill="currentColor" />
          <circle cx="4.5" cy="18" r="1.6" fill="currentColor" />
        </svg>
      );

    case 'insights':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="13" width="4" height="7" rx="1.2" fill="currentColor" />
          <rect x="10" y="8" width="4" height="12" rx="1.2" fill="currentColor" />
          <rect x="17" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
        </svg>
      );

    case 'trend':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="2.5" y="3.5" width="19" height="17" rx="4" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M7 15l3.5-4 2.5 2.5L17 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M17 9h-3M17 9v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'target':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 12l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'growth':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M5 20c.9-3.6 3.6-5.4 7-5.4s6.1 1.8 7 5.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

interface FeatureListProps {
  features: Feature[];
}

export function FeatureList({ features }: FeatureListProps) {
  const { isAr } = useLanguage();
  return (
    <ul className="space-y-[clamp(12px,1.8vh,20px)]">
      {features.map((feature) => {
        const tone = toneClasses[feature.tone];
        return (
          <li key={feature.title} className="flex items-start gap-3.5">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.tile} transition-colors duration-200`}
            >
              <Icon name={feature.icon} className={`h-5 w-5 ${tone.icon}`} />
            </span>
            <div>
              <h3 className="text-[14.5px] font-bold leading-snug text-[#0B132B] dark:text-white">
                {isAr ? (feature.titleAr || feature.title) : feature.title}
              </h3>
              <p className="mt-0.5 max-w-[21rem] text-[13px] font-normal leading-[1.55] text-[#5B6579] dark:text-slate-300">
                {isAr ? (feature.descriptionAr || feature.description) : feature.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}