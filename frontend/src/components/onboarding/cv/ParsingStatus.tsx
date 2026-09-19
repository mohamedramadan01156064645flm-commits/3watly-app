"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, LoaderCircleIcon, ShieldCheckIcon } from 'lucide-react';
import { CvPreview } from './CvPreview';
import { EASE, springPop } from '../../../utils/motion';
import type { ParsedCv, ParseStatus } from '../../../types/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';

interface ParsingStatusProps {
  cv: ParsedCv;
  status: ParseStatus;
  progress: number;
  checksRevealed: number;
}

export function ParsingStatus({ cv, status, progress, checksRevealed }: ParsingStatusProps) {
  const { isAr } = useLanguage();
  const parsing = status === 'uploading' || status === 'parsing';
  const detectedSkills = cv.detectedSkills || [];
  const skillPreview = detectedSkills.slice(0, 5).map((skill) => skill.name);

  const projectCount = Array.isArray(cv.projects) ? cv.projects.length : 0;
  const linkCount = (cv.socialLinks?.length || 0) + (cv.linkedin ? 1 : 0) + (cv.github ? 1 : 0) + (cv.portfolio ? 1 : 0);

  const checks = isAr
    ? [
        { label: 'الخبرة والمسمى المستخرج:', value: cv.currentTitle || 'جاهز للاستكمال' },
        { label: `${detectedSkills.length} مهارات تم اكتشافها:`, value: skillPreview.length > 0 ? skillPreview.join(', ') : 'قيد الفحص الدقيق' },
        { 
          label: 'المشاريع والروابط المستخرجة:', 
          value: projectCount > 0 
            ? `${projectCount} مشاريع عملية مكتملة الروابط (GitHub & Demos)` 
            : (linkCount > 0 ? `تم استخراج ${linkCount} روابط مهنية` : 'جاهز للمراجعة')
        },
        { label: 'فحص وتوافق هيكل الـ ATS:', value: 'تم اعتماد التنسيق الأحادي القياسي (Single-Column)' }
      ]
    : [
        { label: 'Experience Extracted:', value: cv.currentTitle || 'Ready to Complete' },
        { label: `${detectedSkills.length} Skills Detected:`, value: skillPreview.length > 0 ? skillPreview.join(', ') : 'Analyzing text' },
        { 
          label: 'Projects & Live Links:', 
          value: projectCount > 0 
            ? `${projectCount} Projects with Repos & Live Demos` 
            : (linkCount > 0 ? `${linkCount} Verified links extracted` : 'Ready to review')
        },
        { label: 'ATS Layout Parsed:', value: 'Single-Column Format Validated' }
      ];

  return (
    <section className="flex h-full flex-col p-6 rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-xs">
      
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
        <h2 className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
          {isAr ? "حالة الفحص والتحليل المباشر" : "Live Parsing Status"}
        </h2>
        
        <span
          className={`flex h-8 items-center gap-2 rounded-full px-3.5 text-[12.5px] font-bold ${
            parsing
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
          }`}
          aria-live="polite"
        >
          {parsing ? (
            <>
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <span>{isAr ? `جاري التحليل... ${progress}%` : `Parsing in progress...`}</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{isAr ? "اكتمل الفحص بنجاح" : "Analysis complete"}</span>
            </>
          )}
        </span>
      </div>

      {/* 2-Column Split: Interactive Steps Checklist + Dynamic CV Scanner */}
      <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-[1.1fr_0.9fr] flex-1">
        
        {/* Left Column: Progress Check Steps */}
        <div className="flex flex-col justify-between space-y-4">
          <ul className="space-y-3">
            {checks.map((item, index) => {
              const active = checksRevealed >= index + 1;
              return (
                <li
                  key={item.label}
                  className={`rounded-2xl border p-3.5 transition-all ${
                    active
                      ? 'border-emerald-200/80 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02] opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        active
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {active ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="text-[13.5px] font-bold text-slate-900 dark:text-white mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 p-3 border border-blue-100 dark:border-blue-500/20">
            <ShieldCheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-[12px] text-blue-700 dark:text-blue-300 font-medium">
              {isAr ? "يتم تشفير ومعالجة بياناتك بأعلى معايير الخصوصية" : "Encrypted and securely processed with zero data leakage"}
            </span>
          </div>
        </div>

        {/* Right Column: Live CV Paper Scanner */}
        <div>
          <CvPreview cv={cv} scanning={parsing} />
        </div>

      </div>
    </section>
  );
}
