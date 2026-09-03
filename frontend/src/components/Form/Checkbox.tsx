"use client";

import React from 'react';
import { CheckIcon } from 'lucide-react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
  label?: string;
}

export function Checkbox({ id, checked, onChange, children, label }: CheckboxProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] border-[1.6px] border-[#cbd4ec] dark:border-white/20 bg-white dark:bg-[#070B14] transition-colors duration-150 ease-smooth checked:border-blue-600 dark:checked:border-blue-500 checked:bg-blue-600 dark:checked:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        />
        <CheckIcon
          className="pointer-events-none absolute h-[12px] w-[12px] text-white opacity-0 transition-opacity duration-150 ease-smooth peer-checked:opacity-100"
          strokeWidth={3.2}
          aria-hidden="true"
        />
      </span>
      <label htmlFor={id} className="cursor-pointer text-[13px] font-normal leading-[18px] text-slate-600 dark:text-slate-300 select-none">
        {children || label}
      </label>
    </div>
  );
}