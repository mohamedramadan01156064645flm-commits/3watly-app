"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, ChevronDownIcon } from 'lucide-react';

interface SectionRowProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  open: boolean;
  onToggle: () => void;
  complete: boolean;
  count?: number | null;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionRow({
  id,
  label,
  icon: Icon,
  open,
  onToggle,
  complete,
  count,
  badge,
  children
}: SectionRowProps) {
  const panelId = `${id}-panel`;
  return (
    <section>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-150 ease-smooth hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
        >
          <Icon
            className={`h-[18px] w-[18px] shrink-0 ${
              open ? 'text-[#1B57E0] dark:text-[#60A5FA]' : 'text-slate-400 dark:text-slate-500'
            }`}
          />
          
          <span
            className={`flex-1 text-[14.5px] ${
              open ? 'text-[#1B57E0] dark:text-[#60A5FA] font-bold' : 'text-slate-800 dark:text-slate-100 font-semibold'
            }`}
          >
            {label}
          </span>
          {badge}
          {typeof count === 'number' && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-white/10 px-1.5 text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
              {count}
            </span>
          )}
          {complete && (
            <CheckCircle2Icon
              className="h-5 w-5 text-emerald-500"
              aria-label="Section complete"
            />
          )}
          <ChevronDownIcon
            className={`h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ease-smooth ${
              open ? 'rotate-180 text-[#1B57E0] dark:text-[#60A5FA]' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
