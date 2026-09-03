"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InfoTooltipProps {
  content?: string;
  contentAr?: string;
  title?: string;
  titleAr?: string;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function InfoTooltip({
  content = "This metric provides real-time AI analysis based on verified Egyptian market data and profile matching.",
  contentAr = "يقدم هذا المؤشر تحليلاً ذكياً فورياً مبنياً على بيانات سوق العمل الموثقة في مصر ومطابقة ملفك الشخصي.",
  title,
  titleAr,
  className = '',
  side = 'top'
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const { isAr } = useLanguage();

  const activeContent = isAr ? (contentAr || content) : content;
  const activeTitle = isAr ? titleAr : title;

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="More information"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="rounded-full p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 focus-visible:outline-none cursor-pointer flex items-center justify-center"
      >
        <Info className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 2 : -2, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            className={`absolute z-50 w-64 rounded-2xl border border-slate-700/80 bg-[#0F172A]/95 p-3 text-[12px] font-normal leading-relaxed text-slate-100 shadow-2xl backdrop-blur-md pointer-events-none ${
              isAr ? "text-right" : "text-left"
            } ${
              side === 'top'
                ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
                : "top-full left-1/2 -translate-x-1/2 mt-2"
            }`}
          >
            {activeTitle && (
              <div className="font-bold text-white mb-1 flex items-center gap-1.5 text-[12.5px]">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span>{activeTitle}</span>
              </div>
            )}
            <p className="text-slate-300 leading-normal text-[11.5px]">{activeContent}</p>
            
            {/* Tooltip Arrow */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
                side === 'top'
                  ? "top-full -mt-[1px] border-t-[#0F172A]/95"
                  : "bottom-full -mb-[1px] border-b-[#0F172A]/95"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
