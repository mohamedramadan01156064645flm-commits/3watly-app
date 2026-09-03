"use client";

import React from 'react';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { MotionConfig } from 'framer-motion';

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </MotionConfig>
  );
}
