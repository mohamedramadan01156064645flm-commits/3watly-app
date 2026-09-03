"use client";

import React from 'react';

interface TechLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TechLogo({ name, size = 'md', className = '' }: TechLogoProps) {
  const norm = name.toLowerCase();

  const dims = {
    sm: 'h-8 w-8 rounded-xl',
    md: 'h-11 w-11 rounded-2xl',
    lg: 'h-14 w-14 rounded-2xl'
  }[size];

  // Docker
  if (norm.includes('docker')) {
    return (
      <div className={`flex items-center justify-center bg-[#EBF5FF] dark:bg-blue-950/80 text-[#0288D1] border border-blue-200 dark:border-blue-500/30 p-2 shadow-xs ${dims} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zm-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zM23.959 9.8c-.46-.867-1.483-1.32-2.457-1.077-.38.096-.732.28-1.033.535-.458-.337-.99-.546-1.554-.606-.757-.08-1.516.14-2.11.606a4.847 4.847 0 00-1.895-.417c-.452 0-.895.06-1.317.172v-.004H.186A.186.186 0 000 9.19v2.073c0 .546.07 1.08.208 1.597.747 2.793 2.87 4.793 5.485 5.564 1.58.468 3.29.624 5.084.624 5.253 0 9.945-2.096 12.39-5.753.844-1.263 1.026-2.584.792-3.495z"/>
        </svg>
      </div>
    );
  }

  // Airflow
  if (norm.includes('airflow')) {
    return (
      <div className={`flex items-center justify-center bg-[#F0FDF4] dark:bg-emerald-950/80 text-[#00C7D4] border border-teal-200 dark:border-teal-500/30 p-2 shadow-xs ${dims} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2L4 9v6l8 7 8-7V9l-8-7zm0 2.8L18 10l-6 5.2L6 10l6-5.2z" fill="#00C7D4" />
          <circle cx="12" cy="12" r="3" fill="#017CEE" />
          <path d="M12 15l-3 4h6l-3-4z" fill="#E43921" />
          <path d="M9 10l-4-3v6l4-3z" fill="#FFBC00" />
          <path d="M15 10l4-3v6l-4-3z" fill="#00C7D4" />
        </svg>
      </div>
    );
  }

  // Kafka
  if (norm.includes('kafka')) {
    return (
      <div className={`flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white p-2 shadow-xs ${dims} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M8.5 10.5l7-3.5M8.5 13.5l7 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // PostgreSQL
  if (norm.includes('postgres')) {
    return (
      <div className={`flex items-center justify-center bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#336791] border border-indigo-200 dark:border-indigo-500/30 p-2 shadow-xs ${dims} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
    );
  }

  // Spark
  if (norm.includes('spark')) {
    return (
      <div className={`flex items-center justify-center bg-[#FFF7ED] dark:bg-amber-950/80 text-[#E25A1C] border border-orange-200 dark:border-orange-500/30 p-2 shadow-xs ${dims} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.5-6.2 4.5 2.3-7.3-6.1-4.5h7.6z"/>
        </svg>
      </div>
    );
  }

  // Fallback
  return (
    <div className={`flex items-center justify-center bg-blue-50 dark:bg-blue-950 text-blue-600 font-black text-xs ${dims} ${className}`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
