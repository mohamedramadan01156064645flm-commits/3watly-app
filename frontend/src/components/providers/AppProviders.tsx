"use client";

import React from "react";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CVProvider } from "@/contexts/CVContext";
import { SkillPlanProvider } from "@/contexts/SkillPlanContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <OnboardingProvider>
          <CVProvider>
            <SkillPlanProvider>
              <ChatProvider>
                {children}
                <Toaster
                  position="top-center"
                  expand
                  closeButton
                  className="no-print"
                  toastOptions={{
                    duration: 3600,
                    classNames: {
                      toast: 'custom-3watly-toast flex items-center gap-3 !py-3.5 !px-4 !rounded-2xl !backdrop-blur-xl !shadow-2xl !border !transition-all !duration-300 font-sans',
                      title: '!text-[13.5px] !font-bold !leading-snug',
                      description: '!text-[12px] !font-medium !text-slate-500 dark:!text-slate-400 !mt-0.5',
                      closeButton: '!border !border-slate-200/80 dark:!border-white/10 !bg-slate-100/80 dark:!bg-slate-800/80 !text-slate-500 hover:!text-slate-900 dark:hover:!text-white !transition-colors',
                      success: '!bg-white/95 dark:!bg-[#0B1120]/95 !border-emerald-500/30 !text-emerald-950 dark:!text-emerald-200 shadow-emerald-500/5',
                      error: '!bg-white/95 dark:!bg-[#0B1120]/95 !border-rose-500/30 !text-rose-950 dark:!text-rose-200 shadow-rose-500/5',
                      warning: '!bg-white/95 dark:!bg-[#0B1120]/95 !border-amber-500/30 !text-amber-950 dark:!text-amber-200 shadow-amber-500/5',
                      info: '!bg-white/95 dark:!bg-[#0B1120]/95 !border-blue-500/30 !text-slate-900 dark:!text-slate-100 shadow-blue-500/5',
                      loading: '!bg-white/95 dark:!bg-[#0B1120]/95 !border-slate-200/90 dark:!border-white/10 !text-slate-800 dark:!text-slate-200',
                    }
                  }}
                />
              </ChatProvider>
            </SkillPlanProvider>
          </CVProvider>
        </OnboardingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

