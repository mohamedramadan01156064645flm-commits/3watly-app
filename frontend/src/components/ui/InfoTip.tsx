"use client";

import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';

interface InfoTipProps {
  label: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function InfoTip({ label, align = 'center', className }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const position =
  align === 'left' ?
  'left-0' :
  align === 'right' ?
  'right-0' :
  'left-1/2 -translate-x-1/2';

  return (
    <span className={`relative inline-flex ${className ?? ''}`}>
      <button
        type="button"
        aria-label={`More info: ${label}`}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 ease-smooth hover:text-slate-600">
        
        <InfoIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open &&
        <motion.span
          id={id}
          role="tooltip"
          initial={{ opacity: 0, y: 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className={`absolute bottom-full z-30 mb-2 w-56 rounded-lg bg-navy-800 px-3 py-2 text-left text-[11px] font-normal leading-relaxed text-slate-100 shadow-panel ${position}`}>
          
            {label}
          </motion.span>
        }
      </AnimatePresence>
    </span>);

}
