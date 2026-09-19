"use client";

import React, { useState } from 'react';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIEnhanceButtonProps {
  label: string;
  hint?: string;
  onEnhance: () => string | Promise<string>;
}

/**
 * AI action: triggers real AI enhancement via /api/cv/enhance,
 * shows a loading spinner, and displays feedback on completion.
 */
export function AIEnhanceButton({
  label,
  hint,
  onEnhance
}: AIEnhanceButtonProps) {
  const { isAr } = useLanguage();
  const [working, setWorking] = useState(false);

  const run = async () => {
    if (working) return;
    setWorking(true);
    try {
      const message = await Promise.resolve(onEnhance());
      if (message) {
        toast.success(message);
      }
    } catch (err: any) {
      toast.error(err?.message || (isAr ? 'فشل تحسين المحتوى بالذكاء الاصطناعي' : 'Failed to enhance content with AI'));
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={run}
        disabled={working}
        aria-busy={working}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-violet-700 disabled:cursor-progress disabled:opacity-80 cursor-pointer">
        {working ? (
          <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <SparklesIcon className="h-4 w-4" aria-hidden="true" />
        )}
        {working ? (isAr ? 'جاري التحسين بالذكاء الاصطناعي…' : 'Enhancing with AI…') : label}
      </button>
      {hint && (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <SparklesIcon className="h-3 w-3" aria-hidden="true" />
          {hint}
        </p>
      )}
    </div>
  );
}
