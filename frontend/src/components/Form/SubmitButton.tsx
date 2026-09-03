"use client";

import React from 'react';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
}

export function SubmitButton({ label, loading = false, disabled = false }: SubmitButtonProps) {
  const { isAr } = useLanguage();

  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`group relative flex h-[52px] w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,#1B57E0_0%,#3A3FDB_55%,#6D2BE6_100%)] text-[15px] font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:brightness-105 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 ${
        loading || disabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-white" />
      ) : (
        <>
          <span>{label}</span>
          <ArrowRightIcon
            className={`absolute ltr:right-5 rtl:left-5 h-[18px] w-[18px] transition-transform duration-200 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 ${
              isAr ? 'rotate-180' : ''
            }`}
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}