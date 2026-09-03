"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Compass, 
  ShieldCheck, 
  CheckCircle2,
  Building2,
  BrainCircuit,
  Lock
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Underline } from '@/components/brand/Underline';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthSidePanelProps {
  mode?: 'login' | 'signup' | 'forgot-password';
}

export function AuthSidePanel({ mode = 'login' }: AuthSidePanelProps) {
  const { isAr } = useLanguage();

  const title = mode === 'signup' 
    ? (isAr ? "انطلق نحو مستقبلك المهني" : "Unlock Your Future")
    : mode === 'forgot-password'
    ? (isAr ? "استعد حسابك المهني" : "Recover Your Account")
    : (isAr ? "قرارات مهنية أذكى" : "Smarter Career Decisions");

  const subtitle = isAr
    ? "سجّل دخولك لمتابعة خطتك المهنية وسد فجوات مهاراتك والوصول لأحدث وظائف السوق المصري."
    : "Access real-time Egyptian market analytics, identify skill gaps, and match with verified high-growth opportunities.";

  const features = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: isAr ? "مطابقة ذكية بالـ AI" : "AI-Powered Matching",
      desc: isAr ? "اكتشف فرص تناسب خبرتك ومهاراتك بدقة 94%+ لدى كبرى الشركات." : "Match your unique CV skills with 400+ top verified tech roles."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: isAr ? "تحليلات سوق العمل لحظياً" : "Real-Time Market Data",
      desc: isAr ? "كن دايماً على اطلاع ببيانات موثوقة لسلم الرواتب ونسب الطلب." : "Stay informed with verified local salary ranges and demand metrics."
    },
    {
      icon: <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: isAr ? "تطوير مهني مخصص ليك" : "Personalized Skill Roadmap",
      desc: isAr ? "توصيات ذكية لسد فجوات المهارات والارتقاء بمسارك الوظيفي." : "Tailored action plans to bridge missing skills step-by-step."
    }
  ];

  return (
    <section className="relative flex flex-col justify-between h-full py-2">
      {/* Brand Header */}
      <div>
        <Link href="/" className="inline-block w-fit transition-transform hover:scale-105">
          <Logo size="md" />
        </Link>

        {/* Badge */}
        <div className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-500/30 px-3.5 py-1.5 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-[12.5px] font-bold text-blue-700 dark:text-blue-300">
              {isAr ? "منصة التوجيه المهني الذكية" : "AI Career Intelligence Platform"}
            </span>
          </span>
        </div>

        {/* Big Headline */}
        <h1 className="mt-5 text-[32px] sm:text-[42px] font-black leading-[1.18] tracking-tight text-[#0B132B] dark:text-white">
          {title}
          <br />
          {mode === 'login' && (
            <>
              {isAr ? "تبدأ من " : "Starts "}
              <span className="relative inline-block bg-gradient-to-r from-[#1B57E0] to-[#10B981] bg-clip-text text-transparent">
                {isAr ? "هنا" : "Here"}
                <Underline className="absolute -bottom-2 left-0 h-[11px] w-full" />
              </span>
            </>
          )}
        </h1>

        <p className="mt-3.5 max-w-[28rem] text-[14.5px] font-normal leading-[1.65] text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>

        {/* 3 Modern 3D Floating Feature Cards */}
        <div className="mt-7 space-y-3.5 max-w-lg">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.3 }}
              className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[14.5px] font-bold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust & Security Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-3 text-[12px] text-slate-500 dark:text-slate-400">
        <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            {isAr ? "بياناتك محمية وتخضع لأعلى معايير الخصوصية" : "Bank-Grade Encryption & Privacy"}
          </span>
          <span className="text-[11px] text-slate-400 block">
            {isAr ? "مش بنشارك سيرتك الذاتية أو معلوماتك مع أي طرف ثالث" : "We never sell or share your CV data with third parties"}
          </span>
        </div>
      </div>
    </section>
  );
}
