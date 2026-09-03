"use client";

import React, { useId } from 'react';

const CONTROL_CLASS =
  'w-full rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#070C18] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150 ease-smooth hover:border-slate-300 dark:hover:border-white/20 focus:border-[#1B57E0] dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  invalid?: boolean;
  error?: string;
  className?: string;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  hint,
  invalid,
  error,
  className
}: TextFieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={error || hint ? `${id}-desc` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL_CLASS} ${
          invalid ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/20' : ''
        }`}
      />
      {(error || hint) && (
        <p
          id={`${id}-desc`}
          className={`mt-1.5 text-xs ${
            error ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
  maxLength?: number;
  className?: string;
  action?: React.ReactNode;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
  maxLength,
  className,
  action
}: TextAreaFieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {action}
      </div>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL_CLASS} resize-y leading-relaxed`}
      />
      <div className="mt-1.5 flex items-center justify-between gap-3">
        {hint ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        ) : (
          <span aria-hidden="true" />
        )}
        {maxLength && (
          <p className="text-xs tabular-nums text-slate-400 dark:text-slate-500">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

export { CONTROL_CLASS };
