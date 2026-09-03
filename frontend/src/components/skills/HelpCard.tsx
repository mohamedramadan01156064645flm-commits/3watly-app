"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon } from 'lucide-react';

export function HelpCard({ roleName }: { roleName: string }) {
  return (
    <section
      aria-label="Need help"
      className="rounded-2xl border border-violet-100 bg-violet-50 p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white dark:bg-[#0B1120]">
          <SparklesIcon
            className="h-5 w-5 text-violet-600"
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Need help?</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
            Ask the AI Copilot how to sequence these skills for a{' '}
            {roleName} role in the Egyptian market.
          </p>
          <Link
            href="/copilot"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-violet-700"
          >
            Ask the Copilot
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}