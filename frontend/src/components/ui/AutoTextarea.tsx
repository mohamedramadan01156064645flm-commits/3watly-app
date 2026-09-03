"use client";

import React, { useEffect, useRef } from 'react';

interface AutoTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  className?: string;
  onEnter?: () => void;
  onBackspaceEmpty?: () => void;
}

/** Textarea that grows with its content — keeps bullet editing inline. */
export function AutoTextarea({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
  onEnter,
  onBackspaceEmpty
}: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey && onEnter) {
          event.preventDefault();
          onEnter();
        }
        if (event.key === 'Backspace' && value === '' && onBackspaceEmpty) {
          event.preventDefault();
          onBackspaceEmpty();
        }
      }}
      className={`w-full resize-none overflow-hidden bg-transparent text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none ${
      className ?? ''}`
      } />);


}
