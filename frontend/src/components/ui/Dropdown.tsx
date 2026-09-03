"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

export type Option = { id: string; label: string; description?: string };

type DropdownProps = {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  variant?: 'filter' | 'compact';
  label?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  className?: string;
  menuWidth?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  variant = 'compact',
  label,
  icon: Icon,
  className = '',
  menuWidth = 'w-full min-w-[220px]'
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));
  const selected = options.find((o) => o.id === value) ?? options[0];

  const commit = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={
          variant === 'filter'
            ? 'flex h-[54px] w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] px-4 text-left shadow-xs transition-all hover:border-blue-400 dark:hover:border-blue-500/40 focus:outline-none cursor-pointer'
            : 'flex h-[40px] items-center gap-2.5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] px-3.5 text-[13px] font-semibold text-slate-800 dark:text-slate-100 transition-all hover:bg-slate-50 dark:hover:bg-white/5 focus:outline-none cursor-pointer shadow-xs'
        }
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1B57E0] dark:text-blue-400 shrink-0">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 text-left rtl:text-right">
            {label && <span className="block text-[10.5px] font-medium text-slate-400 dark:text-slate-500 leading-none mb-0.5">{label}</span>}
            <span className="block truncate text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
              {selected?.label}
            </span>
          </div>
        </div>

        <ChevronDownIcon className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${open ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className={`absolute top-full z-50 mt-1.5 ${menuWidth} rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E1628] p-1.5 shadow-2xl`}
          >
            <div className="max-h-64 overflow-y-auto space-y-1">
              {options.map((opt) => {
                const isCurrent = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => commit(opt.id)}
                    className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold text-left rtl:text-right transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-[#1B57E0] dark:text-[#60A5FA] font-bold'
                        : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isCurrent && <CheckIcon className="h-4 w-4 text-[#1B57E0] dark:text-[#60A5FA]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
