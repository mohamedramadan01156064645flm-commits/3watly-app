"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Info, Sparkles, X } from 'lucide-react';
import { SalaryTrendChart } from './SalaryTrendChart';
import { SkillSignalCard } from './SkillSignalCard';
import { useLanguage } from '@/contexts/LanguageContext';

const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SCORE = 84;

export function HeroVisual() {
  const { isAr } = useLanguage();
  const [showInfo, setShowInfo] = useState(false);

  const matchReasons = isAr
    ? ['توافق عالي في المهارات الأساسية', 'طلب مرتفع لدى الشركات المصرية', 'فرص نمو وترقي واعدة']
    : ['Strong skill alignment', 'High company demand', 'Great growth potential'];

  return (
    <div className="relative mx-auto flex w-full max-w-[620px] items-center justify-center [perspective:1400px] lg:h-[580px] lg:max-w-none">
      
      {/* 3D Isometric Canvas */}
      <div 
        className={`relative w-full max-w-[600px] lg:h-[560px] [transform-style:preserve-3d] transition-all duration-700 hover:[transform:rotateY(0deg)_rotateX(0deg)] ${
          isAr 
            ? '[transform:rotateY(6deg)_rotateX(4deg)_rotateZ(1deg)] hover:[transform:rotateY(1deg)_rotateX(1deg)_rotateZ(0deg)]' 
            : '[transform:rotateY(-6deg)_rotateX(4deg)_rotateZ(-1deg)] hover:[transform:rotateY(-1deg)_rotateX(1deg)_rotateZ(0deg)]'
        }`}
      >
        
        {/* 1. PRIMARY JOB MATCH CARD (3D Glassmorphism) */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 rounded-[32px] border border-slate-200/90 dark:border-blue-500/30 bg-white/95 dark:bg-gradient-to-b dark:from-[#0F172E]/95 dark:via-[#0A1122]/95 dark:to-[#060B18]/95 backdrop-blur-2xl p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_0_25px_rgba(27,87,224,0.06)] dark:shadow-[0_0_35px_rgba(59,130,246,0.25),0_25px_60px_-15px_rgba(0,0,0,0.95)] lg:absolute lg:ltr:left-0 lg:rtl:right-0 lg:top-0 lg:w-[325px]"
          style={{ transform: 'translateZ(18px)' }}
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-3 relative">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[1.1rem] font-bold tracking-tight text-slate-900 dark:text-white">
                {isAr ? "مطابقة الوظيفة" : "Job Match"}
              </h3>
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Info"
                className="h-5 w-5 rounded-full bg-slate-100 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-900/60 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Info className="h-3 w-3 stroke-[2.5]" />
              </button>
            </div>

            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 text-[11.5px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-500/40 shadow-sm shadow-emerald-500/20">
              {isAr ? "توافق ممتاز" : "Excellent Match"}
            </span>

            {/* Interactive Info Tooltip */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute top-10 inset-x-0 z-50 rounded-2xl bg-slate-900/95 dark:bg-[#030712]/95 border border-slate-700/80 p-3.5 text-white shadow-2xl backdrop-blur-md text-[11.5px] space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-blue-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isAr ? "كيف يُحسب المؤشر؟" : "How is it calculated?"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowInfo(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-normal">
                    {isAr
                      ? "يتم احتساب نسبة المطابقة بالذكاء الاصطناعي بناءً على مطابقة مهارات الـ CV مع متطلبات الوظيفة المعلنة وسنوات الخبرة."
                      : "Calculated with AI by matching your CV technical skills, seniority, and keywords with real job criteria."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Body */}
          <div className="mt-5 flex flex-col items-center">
            {/* Radial Gauge */}
            <div className="relative h-[146px] w-[146px]">
              <svg viewBox="0 0 152 152" className="h-full w-full -rotate-[90deg]">
                <circle cx="76" cy="76" r={RADIUS} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeWidth="12" />
                <motion.circle
                  cx="76"
                  cy="76"
                  r={RADIUS}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  initial={{ strokeDashoffset: CIRCUMFERENCE }}
                  animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - SCORE / 100) }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="filter dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="flex items-baseline text-[2.85rem] font-black leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                  {SCORE}
                  <span className="text-[1.25rem] font-bold tracking-tight">%</span>
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                  {isAr ? "مؤشر التوافق" : "Match Score"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[11px] font-medium text-slate-400">
              {isAr ? "مطابقة مع شركة" : "Matched with"}
            </p>
            
            {/* Vodafone Logo */}
            <div className="mt-1 flex items-center gap-2">
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#E60000] shadow-sm shadow-red-500/40 flex-shrink-0">
                <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="white">
                  <path d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C17.9 28 19.68 27.56 21.26 26.77L25.5 31.5L23.2 25.2C26.18 22.98 28 19.68 28 16C28 9.37 22.63 4 16 4ZM16 24C11.58 24 8 20.42 8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24Z" />
                </svg>
              </div>
              <span className="text-[1.15rem] font-black tracking-tight text-slate-900 dark:text-white">Vodafone Egypt</span>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="rounded-xl bg-blue-50/90 dark:bg-blue-950/70 px-3 py-1 text-[11px] font-bold text-blue-900 dark:text-blue-200 border border-blue-100/70 dark:border-blue-500/30">
                {isAr ? "مهندس بيانات" : "Data Engineer"}
              </span>
              <span className="rounded-xl bg-blue-50/90 dark:bg-blue-950/70 px-3 py-1 text-[11px] font-bold text-blue-900 dark:text-blue-200 border border-blue-100/70 dark:border-blue-500/30">
                {isAr ? "القرية الذكية، الجيزة" : "Smart Village, Giza"}
              </span>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 dark:border-white/10 pt-4">
            <h4 className="text-[12.5px] font-bold text-slate-900 dark:text-white">
              {isAr ? "أسباب التوافق القوي" : "Why it's a great match"}
            </h4>
            <ul className="mt-2.5 flex flex-col gap-2">
              {matchReasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-center gap-2 text-[12.5px] font-medium text-slate-600 dark:text-slate-300"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400 stroke-[3]"
                  />
                  {reason}
                </li>
              ))}
            </ul>
            <a
              href="#insights"
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isAr ? "عرض التحليل الكامل" : "View full analysis"}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            </a>
          </div>
        </motion.article>

        {/* Visual 3D Connection Line (Bridge between Job Card and Skill Cards) */}
        <div 
          className="hidden lg:block absolute top-[110px] ltr:left-[315px] rtl:right-[315px] w-[50px] h-[2px] bg-gradient-to-r from-blue-500/80 via-indigo-500/60 to-emerald-500/80 dark:from-blue-400 dark:to-emerald-400 z-15"
          style={{ transform: 'translateZ(25px)' }}
        />

        {/* 2. SKILL SIGNAL CARDS (Dynamic & Connected in 3D Space) */}
        <div 
          className="flex flex-col gap-3.5 sm:grid sm:grid-cols-3 lg:absolute lg:ltr:right-0 lg:rtl:left-0 lg:top-0 lg:z-20 lg:flex lg:w-[250px] lg:flex-col"
          style={{ transform: 'translateZ(35px)' }}
        >
          <SkillSignalCard name="Python" glyph="python" filled={5} delay={0.08} />
          <SkillSignalCard name="SQL" glyph="sql" filled={5} delay={0.14} />
          <SkillSignalCard name="Docker" glyph="docker" filled={4} delay={0.2} />
        </div>

        {/* 3. SALARY TREND CARD */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[30px] border border-slate-200/90 dark:border-indigo-500/30 bg-white/95 dark:bg-gradient-to-b dark:from-[#0F172E]/95 dark:via-[#0A1122]/95 dark:to-[#060B18]/95 backdrop-blur-2xl p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_0_25px_rgba(99,102,241,0.08)] dark:shadow-[0_0_35px_rgba(99,102,241,0.25),0_25px_60px_-15px_rgba(0,0,0,0.95)] lg:absolute lg:bottom-0 lg:ltr:right-0 lg:rtl:left-0 lg:z-30 lg:w-[325px]"
          style={{ transform: 'translateZ(55px)' }}
        >
          <SalaryTrendChart />
        </motion.article>

      </div>
    </div>
  );
}
