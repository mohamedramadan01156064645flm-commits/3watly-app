"use client";

import React, { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('majra-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('majra-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('majra-theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#0B1120]/5 border border-slate-200 dark:border-white/10" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/10 dark:border-white/15 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-amber-400 shadow-xs hover:border-blue-400 dark:hover:border-amber-400/50 hover:bg-slate-50 dark:bg-[#0B1120]/[0.04] dark:hover:bg-amber-950/20 active:scale-90 transition-all duration-150 cursor-pointer overflow-hidden"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 transition-transform duration-150" fill="none">
          <circle cx="12" cy="12" r="4" fill="#F59E0B" />
          <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-150" fill="none">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#4338CA"
            stroke="#4338CA"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
