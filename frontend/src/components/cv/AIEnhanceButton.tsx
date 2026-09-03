"use client";

import React, { useState } from 'react';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import { toast } from 'sonner';

interface AIEnhanceButtonProps {
  label: string;
  hint?: string;
  onEnhance: () => string;
}

/**
 * Simulated AI action: shows a short working state, applies the deterministic
 * rewrite, then reports what changed.
 */
export function AIEnhanceButton({
  label,
  hint,
  onEnhance
}: AIEnhanceButtonProps) {
  const [working, setWorking] = useState(false);

  const run = () => {
    if (working) return;
    setWorking(true);
    window.setTimeout(() => {
      const message = onEnhance();
      setWorking(false);
      toast.success(message);
    }, 700);
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={run}
        disabled={working}
        aria-busy={working}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-smooth hover:bg-violet-700 disabled:cursor-progress disabled:opacity-80">
        
        {working ?
        <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> :

        <SparklesIcon className="h-4 w-4" aria-hidden="true" />
        }
        {working ? 'Enhancing…' : label}
      </button>
      {hint &&
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <SparklesIcon className="h-3 w-3" aria-hidden="true" />
          {hint}
        </p>
      }
    </div>);

}
