"use client";

import React from 'react';
import {
  BookOpenIcon,
  ChevronRightIcon,
  GraduationCapIcon,
  HammerIcon } from
'lucide-react';
import { FaYoutube as YoutubeIcon } from 'react-icons/fa6';
import type { ResourceKind } from '../../types/skills';

const ROWS: {
  kind: ResourceKind;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{className?: string;}>;
  color: string;
}[] = [
{
  kind: 'video',
  title: 'YouTube',
  subtitle: 'High-quality free tutorials',
  Icon: YoutubeIcon,
  color: 'text-red-500'
},
{
  kind: 'course',
  title: 'Coursera',
  subtitle: 'Courses with recognised certificates',
  Icon: GraduationCapIcon,
  color: 'text-brand-600'
},
{
  kind: 'docs',
  title: 'Official documentation',
  subtitle: 'Trusted, first-party references',
  Icon: BookOpenIcon,
  color: 'text-slate-500 dark:text-slate-400'
},
{
  kind: 'project',
  title: 'Hands-on projects',
  subtitle: 'Learn by shipping something real',
  Icon: HammerIcon,
  color: 'text-violet-600'
}];


interface ResourcesCardProps {
  onOpen: (kind: ResourceKind | 'all') => void;
}

export function ResourcesCard({ onOpen }: ResourcesCardProps) {
  return (
    <section
      aria-label="Suggested resources"
      className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-card">
      
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
          Suggested for you
        </h2>
        <button
          type="button"
          onClick={() => onOpen('all')}
          className="text-[13px] font-semibold text-brand-600 transition-colors duration-150 ease-smooth hover:text-brand-700">
          
          View all
        </button>
      </div>

      <ul className="mt-3 divide-y divide-slate-100">
        {ROWS.map(({ kind, title, subtitle, Icon, color }) =>
        <li key={kind}>
            <button
            type="button"
            onClick={() => onOpen(kind)}
            className="flex w-full items-center gap-3 py-2.5 text-left transition-colors duration-150 ease-smooth hover:text-brand-700">
            
              <Icon className={`h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-slate-800">
                  {title}
                </span>
                <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {subtitle}
                </span>
              </span>
              <ChevronRightIcon
              className="h-4 w-4 shrink-0 text-slate-300"
              aria-hidden="true" />
            
            </button>
          </li>
        )}
      </ul>
    </section>);

}
