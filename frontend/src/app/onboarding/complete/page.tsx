"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, CheckIcon, RotateCcwIcon, LayoutDashboard } from 'lucide-react';
import { AppHeader } from '@/components/onboarding/AppHeader';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { roleOptions } from '@/data/roles';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CompletePage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { role, profile, experience, locations, reset } = useOnboarding();
  const { setOnboardingCompleted } = useAuth();

  const selected = roleOptions.find((option) => option.id === role);

  const handleGoDashboard = async () => {
    try {
      await setOnboardingCompleted(true);
    } catch {}
    router.push('/dashboard');
  };

  return (
    <RequireOnboarding need="parsedCv">
      <div className="flex min-h-screen w-full flex-col bg-[#FCFDFF] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC]">
        <AppHeader />

        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <section className="w-full max-w-[560px] rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-10 text-center shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/90">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <CheckIcon className="h-8 w-8 text-white" strokeWidth={3} aria-hidden="true" />
            </span>

            <h1 className="mt-6 text-[28px] font-black leading-tight tracking-tight text-slate-900 dark:text-white">
              {isAr ? "جاهز للانطلاق! 🎉" : "You’re all set! 🎉"}
            </h1>
            <p className="mx-auto mt-2.5 max-w-[24rem] text-[14.5px] font-normal leading-[1.6] text-slate-500 dark:text-slate-400">
              {isAr 
                ? "تم إعداد ملفك بنجاح. منصة عواطلي ستستمر في مطابقة خبرتك مع أحدث شواغر سوق العمل المصري وتحديث توصياتك دورياً."
                : "Your profile is active. 3WATLY will keep matching you against the Egyptian job market and refresh your recommendations continuously."}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-3 text-left rtl:text-right sm:grid-cols-3">
              {[
                { 
                  label: isAr ? 'المسار المستهدف' : 'Target role', 
                  value: isAr 
                    ? (role === 'software-engineer' ? 'مهندس برمجيات' 
                      : role === 'data-engineer' ? 'مهندس بيانات'
                      : role === 'ml-engineer' ? 'مهندس تعلم آلي'
                      : role === 'devops' ? 'أخصائي DevOps'
                      : 'محلل بيانات')
                    : (selected?.title ?? 'Data Analyst') 
                },
                { label: isAr ? 'مستوى الخبرة' : 'Experience', value: experience },
                { label: isAr ? 'نسبة الجاهزية' : 'Overall match', value: profile ? `${profile.scores.overall}%` : '84%' }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-[#FBFCFE] dark:bg-[#070B14] px-4 py-3.5">
                  <dt className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-[14px] font-bold text-slate-900 dark:text-white truncate">{item.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-[12.5px] font-normal text-slate-400 dark:text-slate-400">
              {isAr ? "نطاق العمل المحدد:" : "Locations:"} {locations.length > 0 ? locations.join(' • ') : (isAr ? 'لم يُحدد' : 'Not set')}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleGoDashboard}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 text-[15px] shadow-lg shadow-blue-600/25 transition-all duration-150 active:translate-y-[1px] sm:w-auto cursor-pointer"
              >
                <LayoutDashboard className="h-[17px] w-[17px]" />
                <span>{isAr ? "الدخول للوحة التحكم" : "Enter Dashboard"}</span>
                <ArrowRightIcon className={`h-[17px] w-[17px] ${isAr ? "rotate-180" : ""}`} strokeWidth={2.1} />
              </button>

              <button
                type="button"
                onClick={() => {
                  reset();
                  router.push('/onboarding/career-path');
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] px-6 text-[14px] font-medium text-slate-700 dark:text-slate-300 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-white/5 sm:w-auto cursor-pointer"
              >
                <RotateCcwIcon className="h-[15px] w-[15px]" strokeWidth={2} />
                <span>{isAr ? "تعديل البيانات من البداية" : "Start over"}</span>
              </button>
            </div>
          </section>
        </main>
      </div>
    </RequireOnboarding>
  );
}
