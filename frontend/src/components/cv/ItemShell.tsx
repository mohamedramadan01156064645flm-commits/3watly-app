"use client";

import React from 'react';
import { CopyIcon, Trash2Icon } from 'lucide-react';

interface ItemShellProps {
  label: string;
  first?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  children: React.ReactNode;
}

export function ItemShell({
  label,
  first,
  onDuplicate,
  onDelete,
  deleteDisabled,
  children
}: ItemShellProps) {
  return (
    <div className={first ? '' : 'mt-5 border-t border-slate-100 dark:border-white/10 pt-5'}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{label}</p>
        <div className="flex items-center gap-1">
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              aria-label={`Duplicate ${label}`}
              className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <CopyIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleteDisabled}
              aria-label={`Delete ${label}`}
              className="rounded-lg p-1.5 text-rose-400 transition-colors duration-150 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
            >
              <Trash2Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
