"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface RequireOnboardingProps {
  need: 'role' | 'parsedCv';
  children: React.ReactNode;
}

export function RequireOnboarding({ need, children }: RequireOnboardingProps) {
  const { role, profile } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      router.replace('/onboarding/career-path');
    } else if (need === 'parsedCv' && !profile) {
      router.replace('/onboarding/cv-upload');
    }
  }, [role, profile, need, router]);

  if (!role || (need === 'parsedCv' && !profile)) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}