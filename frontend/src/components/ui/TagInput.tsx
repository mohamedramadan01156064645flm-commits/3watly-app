"use client";

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  tone?: 'emerald' | 'brand' | 'slate';
  emptyHint?: string;
}

export function TagInput({
  label,
  tags,
  onChange,
  placeholder,
  emptyHint
}: TagInputProps) {
  const { isAr } = useLanguage();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const defaultPlaceholder = isAr ? 'اكتب واضغط Enter' : 'Add and press Enter';
  const inputPlaceholder = placeholder || defaultPlaceholder;

  const commit = () => {
    const value = draft.trim();
    if (
      value !== '' &&
      !tags.some((tag) => tag.toLowerCase() === value.toLowerCase())
    ) {
      onChange([...tags, value]);
    }
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="w-full">
      {label && (
        <p className="mb-2 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {tags.length === 0 && !adding && emptyHint && (
          <span className="text-[12px] text-slate-400 dark:text-slate-500">
            {emptyHint}
          </span>
        )}

        {tags.map((tag) => (
          <span
            key={tag}
            className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[12.5px] font-medium border border-slate-200/90 dark:border-white/10 bg-slate-100/90 dark:bg-[#0E1626] text-slate-800 dark:text-slate-200 shadow-2xs hover:border-slate-300 dark:hover:border-white/20 transition-all duration-150"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              className="rounded-md p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}

        {adding ? (
          <input
            autoFocus
            dir="auto"
            value={draft}
            placeholder={inputPlaceholder}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commit();
              }
              if (event.key === 'Escape') {
                setDraft('');
                setAdding(false);
              }
            }}
            className="h-8 w-44 rounded-xl border border-blue-500 bg-white dark:bg-[#060913] px-3 text-[12.5px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50/70 dark:bg-white/[0.02] text-[12px] font-semibold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isAr ? "إضافة مهارة" : "Add Skill"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
