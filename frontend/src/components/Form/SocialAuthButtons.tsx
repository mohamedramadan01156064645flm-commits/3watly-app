"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.26-2.08 3.59-5.15 3.59-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3a7.2 7.2 0 0 1-10.72-3.78H1.31v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.34 14.3a7.19 7.19 0 0 1 0-4.6V6.6H1.31a12 12 0 0 0 0 10.8l4.03-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.31 6.6l4.03 3.1A7.16 7.16 0 0 1 12 4.75Z"
      />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05a4.2 4.2 0 0 1 3.78-2.08C20.6 8.56 22 10.6 22 14.1V21h-4v-6.1c0-1.53-.55-2.57-1.92-2.57-1.05 0-1.67.7-1.94 1.38-.1.25-.13.6-.13.94V21h-4V9Z"
      />
    </svg>
  );
}

interface SocialAuthButtonsProps {
  googleLabel: string;
  linkedinLabel: string;
}

export function SocialAuthButtons({ googleLabel, linkedinLabel }: SocialAuthButtonsProps) {
  const { isAr } = useLanguage();
  const { signInWithGoogle, signInWithLinkedIn } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);

  const handleGoogleClick = async () => {
    if (isGoogleLoading || isLinkedInLoading) return;
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success && res.error) {
        toast.error(res.error);
      }
    } catch (err: any) {
      toast.error(err?.message || (isAr ? 'فشل بدء تسجيل الدخول بواسطة Google' : 'Failed to sign in with Google'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLinkedInClick = async () => {
    if (isGoogleLoading || isLinkedInLoading) return;
    setIsLinkedInLoading(true);
    try {
      const res = await signInWithLinkedIn();
      if (!res.success && res.error) {
        toast.error(res.error);
      }
    } catch (err: any) {
      toast.error(err?.message || (isAr ? 'فشل بدء تسجيل الدخول بواسطة LinkedIn' : 'Failed to sign in with LinkedIn'));
    } finally {
      setIsLinkedInLoading(false);
    }
  };

  const base =
    'flex h-[48px] items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] text-[13.5px] font-semibold text-[#1E293B] dark:text-white shadow-xs transition-all duration-150 ease-smooth hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-white/5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isGoogleLoading || isLinkedInLoading}
        className={base}
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
        ) : (
          <GoogleMark />
        )}
        <span>{isGoogleLoading ? (isAr ? 'جاري التحويل...' : 'Redirecting...') : googleLabel}</span>
      </button>

      <button
        type="button"
        onClick={handleLinkedInClick}
        disabled={isGoogleLoading || isLinkedInLoading}
        className={base}
      >
        {isLinkedInLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
        ) : (
          <LinkedInMark />
        )}
        <span>{isLinkedInLoading ? (isAr ? 'جاري التحويل...' : 'Redirecting...') : linkedinLabel}</span>
      </button>
    </div>
  );
}