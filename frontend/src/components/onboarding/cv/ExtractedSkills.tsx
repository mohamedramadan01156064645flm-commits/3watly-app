"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, UserIcon, Sparkles, Layers } from 'lucide-react';
import { TechIcon, techTile } from '../../icons/TechIcon';
import type { ParsedCv } from '../../../types/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExtractedSkillsProps {
  cv: ParsedCv;
  addedCount: number;
  complete: boolean;
}

export function ExtractedSkills({ cv, addedCount, complete }: ExtractedSkillsProps) {
  const { isAr } = useLanguage();

  // ONLY show skills genuinely extracted from CV
  const detectedSkills = (cv.detectedSkills && cv.detectedSkills.length > 0)
    ? cv.detectedSkills
    : (cv.skills && cv.skills.length > 0)
    ? cv.skills.map(s => ({ key: s.toLowerCase().replace(/[^a-z0-9]/g, ''), name: s }))
    : [];

  return (
    <section className="p-6 rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-xs">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_minmax(0,1.2fr)_auto_minmax(0,1fr)] lg:items-center">
        
        {/* Left Column: Heading */}
        <div className="space-y-1">
          <h2 className="text-[16px] font-black text-slate-900 dark:text-white">
            {isAr ? "المهارات المستخرجة" : "Extracted Skills"}
          </h2>
          <p className="text-[12.5px] text-slate-400 dark:text-slate-400">
            {isAr ? "المهارات المكتشفة من سيرتك الذاتية" : "Detected skills from your CV"}
          </p>
        </div>

        {/* Middle Column: Skills with flow badges */}
        <div className="relative">
          {detectedSkills.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {detectedSkills.map((skill, index) => (
                <motion.li
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="flex h-9 items-center gap-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 px-3 shadow-2xs hover:border-blue-300 transition-colors"
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md ${techTile(skill.name || skill.key)}`}>
                    <TechIcon name={skill.name || skill.key} className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    {skill.name}
                  </span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2.5 text-[12.5px] text-slate-400 dark:text-slate-500 py-2">
              <Layers className="h-4 w-4 shrink-0" />
              <span>{isAr ? "لم يتم اكتشاف مهارات محددة بعد — سيتم استكمال الملف في الخطوة التالية" : "No specific skills detected yet"}</span>
            </div>
          )}
        </div>

        {/* Separator / Flow Arrow and Avatar Circle */}
        <div className="hidden lg:flex items-center gap-4">
          <ArrowRightIcon
            className={`h-5 w-5 text-slate-300 dark:text-slate-600 ${isAr ? "rotate-180" : ""}`}
          />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
            <UserIcon className="h-7 w-7" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
              <CheckIcon className="h-3 w-3" strokeWidth={3} />
            </span>
          </div>
        </div>

        {/* Right Column: Adding to profile status & green pills */}
        <div className="space-y-2">
          <p className="text-[13px] font-bold text-slate-900 dark:text-white">
            {detectedSkills.length > 0 
              ? (isAr ? "جارٍ الإضافة لملفك المهني..." : "Adding to your profile...") 
              : (isAr ? "الملف المهني قيد المراجعة" : "Profile in review")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {detectedSkills.slice(0, 7).map((skill, idx) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 + idx * 0.05 }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-500/20"
              >
                {skill.name}
              </motion.span>
            ))}
            {detectedSkills.length > 7 && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-500/20">
                +{detectedSkills.length - 7} {isAr ? "المزيد" : "more"}
              </span>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
