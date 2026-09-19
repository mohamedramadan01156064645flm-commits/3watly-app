"use client";

import React from 'react';
import {
  BookOpenIcon,
  GraduationCapIcon,
  HammerIcon,
  ExternalLink
} from 'lucide-react';
import { FaYoutube as YoutubeIcon } from 'react-icons/fa6';
import type { ResourceKind, SkillResource } from '../../types/skills';

const KIND_META: Record<
  string,
  {
    Icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    badge: string;
    badgeText: string;
  }
> = {
  video: {
    Icon: YoutubeIcon,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/40',
    badge: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
    badgeText: 'Video'
  },
  course: {
    Icon: GraduationCapIcon,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    badgeText: 'Course'
  },
  docs: {
    Icon: BookOpenIcon,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    badge: 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300',
    badgeText: 'Docs'
  },
  article: {
    Icon: BookOpenIcon,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    badge: 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300',
    badgeText: 'Docs'
  },
  project: {
    Icon: HammerIcon,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400',
    badgeText: 'Project'
  },
  repo: {
    Icon: HammerIcon,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400',
    badgeText: 'Project'
  },
  practice: {
    Icon: HammerIcon,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
    badgeText: 'Practice'
  },
  book: {
    Icon: BookOpenIcon,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
    badgeText: 'Book'
  }
};

const DEFAULT_KIND_META = KIND_META.docs;

export function ResourceRow({
  resource,
  skillName
}: {
  resource: SkillResource;
  skillName: string;
}) {
  const meta = KIND_META[resource?.kind] || DEFAULT_KIND_META;
  const { Icon, color, bg, badge, badgeText } = meta;

  const handleClick = () => {
    const targetUrl = resource.url || (
      resource.kind === 'video'
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(resource.title)}`
        : resource.kind === 'course'
        ? `https://www.coursera.org/search?query=${encodeURIComponent(resource.title)}`
        : `https://www.google.com/search?q=${encodeURIComponent(resource.title + ' ' + skillName)}`
    );
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Open ${resource.title} for ${skillName}`}
      className="group flex w-full items-center gap-3.5 rounded-2xl border border-slate-100 dark:border-white/[0.07] bg-white dark:bg-[#0B1120]/60 hover:border-blue-300/70 dark:hover:border-blue-500/30 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 px-4 py-3 text-left transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md"
    >
      {/* Icon tile */}
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-4.5 w-4.5 ${color}`} aria-hidden="true" />
      </span>

      {/* Text */}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-150">
          {resource.title}
        </span>
        <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
          {resource.provider} · {resource.hours}h
        </span>
      </span>

      {/* Right side badges */}
      <div className="flex shrink-0 items-center gap-2">
        {resource.free ? (
          <span className="rounded-lg px-2 py-0.5 text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            Free
          </span>
        ) : (
          <span className="rounded-lg px-2 py-0.5 text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            Certificate
          </span>
        )}
        <span className={`hidden sm:inline-flex rounded-lg px-2 py-0.5 text-[11px] font-semibold ${badge}`}>
          {badgeText}
        </span>
        <ExternalLink className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      </div>
    </button>
  );
}
