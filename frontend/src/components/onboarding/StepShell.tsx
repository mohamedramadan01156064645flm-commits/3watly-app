"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppHeader } from './AppHeader';
import { Stepper } from './Stepper';
import { EASE } from '@/utils/motion';

interface StepShellProps {
  step: number;
  children: React.ReactNode;
}

export function StepShell({ step, children }: StepShellProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#FBFCFE] dark:bg-[#060913] transition-colors duration-300">
      <AppHeader />
      <div className="border-b border-line dark:border-white/10 bg-white dark:bg-[#0B1120] py-3.5">
        <Stepper current={step} onStepSelect={(path) => router.push(path)} />
      </div>
      <motion.main
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="mx-auto w-full max-w-[1440px] flex-1 px-4 sm:px-6 py-7 lg:px-10"
      >
        {children}
      </motion.main>
    </div>
  );
}