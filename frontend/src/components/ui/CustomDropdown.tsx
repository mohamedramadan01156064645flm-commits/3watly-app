"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  icon,
  className = '',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl
          bg-white/90 dark:bg-gradient-to-r dark:from-[#0B1E45]/80 dark:to-[#07132B]/85
          border transition-all duration-150 cursor-pointer text-sm shadow-xs backdrop-blur-md
          ${isOpen
            ? 'border-cyan-500 ring-2 ring-cyan-500/20 text-cyan-600 dark:text-cyan-400'
            : 'border-slate-200 dark:border-cyan-500/25 hover:border-slate-300 dark:hover:border-cyan-500/40 text-slate-800 dark:text-slate-200'
          }
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate text-slate-800 dark:text-slate-200 font-semibold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${selectedOption.badgeColor || 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'}`}>
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full start-0 mt-1.5 w-full min-w-[200px] max-h-64 overflow-y-auto rounded-xl bg-white/95 dark:bg-[#07132B]/95 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/30 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100 dark:divide-white/5">
          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium text-start
                    transition-all duration-100 cursor-pointer
                    ${isSelected
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950 dark:hover:text-white border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="truncate">{option.label}</span>
                    {option.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${option.badgeColor || 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
