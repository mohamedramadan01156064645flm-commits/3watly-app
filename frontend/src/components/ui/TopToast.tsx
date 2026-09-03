"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface TopToastProps {
  message: string | null;
  type?: 'error' | 'success' | 'warning';
  onClose?: () => void;
}

export function TopToast({ message, type = 'error', onClose }: TopToastProps) {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] max-w-md w-[92%] sm:w-auto pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-xl shadow-2xl border ${
              isError
                ? 'bg-rose-950/90 dark:bg-rose-950/95 text-white border-rose-600/60 shadow-rose-950/40 ring-1 ring-rose-500/30'
                : isSuccess
                ? 'bg-emerald-950/90 dark:bg-emerald-950/95 text-white border-emerald-600/60 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                : 'bg-slate-900/90 text-white border-slate-700/60 shadow-black/40'
            }`}
          >
            <div className="flex items-center gap-3">
              {isError && (
                <div className="h-7 w-7 rounded-xl bg-rose-600/30 flex items-center justify-center text-rose-300 shrink-0 border border-rose-500/40">
                  <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              {isSuccess && (
                <div className="h-7 w-7 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-300 shrink-0 border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
              <span className="text-[13.5px] font-bold tracking-tight leading-snug">
                {message}
              </span>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="ltr:ml-2 rtl:mr-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
