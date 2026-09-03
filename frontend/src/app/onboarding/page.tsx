"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding/career-path');
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FBFCFE] dark:bg-[#060913]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1B57E0] border-t-transparent" />
    </div>
  );
}
