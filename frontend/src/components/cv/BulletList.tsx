"use client";

import React from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { AutoTextarea } from '../ui/AutoTextarea';

interface BulletListProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  itemLabel?: string;
  footer?: React.ReactNode;
}

export function BulletList({
  bullets,
  onChange,
  itemLabel = 'bullet',
  footer
}: BulletListProps) {
  const setBullet = (index: number, value: string) =>
    onChange(bullets.map((b, i) => (i === index ? value : b)));

  const insertAfter = (index: number) => {
    const next = [...bullets];
    next.splice(index + 1, 0, '');
    onChange(next);
  };

  const removeAt = (index: number) => {
    if (bullets.length === 1) {
      onChange(['']);
      return;
    }
    onChange(bullets.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#070C18] p-3">
      <ul className="space-y-1">
        {bullets.map((bullet, index) => (
          <li
            key={index}
            className="group flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <span
              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
              aria-hidden="true"
            />
            <AutoTextarea
              value={bullet}
              onChange={(value) => setBullet(index, value)}
              ariaLabel={`${itemLabel} ${index + 1}`}
              placeholder="Describe what you did and the impact it drove…"
              onEnter={() => insertAfter(index)}
              onBackspaceEmpty={() => removeAt(index)}
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Delete ${itemLabel} ${index + 1}`}
              className="mt-0.5 shrink-0 rounded-md p-1 text-slate-300 dark:text-slate-600 opacity-0 transition-opacity duration-150 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 focus-visible:opacity-100 group-hover:opacity-100 cursor-pointer"
            >
              <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => insertAfter(bullets.length - 1)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:bg-blue-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
      >
        <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Add {itemLabel}</span>
      </button>

      {footer}
    </div>
  );
}
