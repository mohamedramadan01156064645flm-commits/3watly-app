"use client";

import React from 'react';
import { InfoTip } from '../ui/InfoTip';

interface DiagnosticCardProps {
  index: number;
  title: string;
  tooltip?: string;
  pill?: { label: string; tone: 'emerald' | 'amber' };
  subtitle: string;
  children: React.ReactNode;
  footer: {
    tone: 'emerald' | 'amber';
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    art?: React.ComponentType<{ className?: string }>;
  };
}

const PILL_TONES = {
  emerald: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40',
  amber: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40'
};

const FOOTER_TONES = {
  emerald: 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/30',
  amber: 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-100 dark:border-amber-900/30'
};

const FOOTER_ICON_TONES = {
  emerald: 'text-emerald-600 dark:text-emerald-400',
  amber: 'text-amber-600 dark:text-amber-400'
};

export function DiagnosticCard({
  index,
  title,
  tooltip,
  pill,
  subtitle,
  children,
  footer
}: DiagnosticCardProps) {
  const FooterIcon = footer.icon;
  const Art = footer.art;

  return (
    <section
      aria-label={title}
      className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-card"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950/70 text-[13px] font-bold text-[#1B57E0] dark:text-[#60A5FA]">
          {index}
        </span>
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{title}</h3>
        {tooltip && <InfoTip label={tooltip} />}
        {pill && (
          <span className={`ml-auto rtl:mr-auto rtl:ml-0 shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold ${PILL_TONES[pill.tone]}`}>
            {pill.label}
          </span>
        )}
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>

      <div className="mt-4 flex-1">{children}</div>

      <div className={`relative mt-5 overflow-hidden rounded-xl px-4 py-3.5 ${FOOTER_TONES[footer.tone]}`}>
        <div className="flex items-start gap-2.5 pr-10 rtl:pl-10 rtl:pr-0">
          <FooterIcon className={`mt-0.5 h-4 w-4 shrink-0 ${FOOTER_ICON_TONES[footer.tone]}`} aria-hidden="true" />
          <p className="text-[13px] font-semibold leading-relaxed">
            {footer.text}
          </p>
        </div>
        {Art && (
          <Art className={`absolute bottom-2 right-3 rtl:left-3 rtl:right-auto h-8 w-8 opacity-25 ${FOOTER_ICON_TONES[footer.tone]}`} />
        )}
      </div>
    </section>
  );
}
