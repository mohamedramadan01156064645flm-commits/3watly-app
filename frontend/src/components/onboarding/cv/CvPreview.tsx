"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MailIcon, MapPinIcon, PhoneIcon, Briefcase, GraduationCap, Layers } from 'lucide-react';
import type { ParsedCv } from '../../../types/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';

function LinkedinIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface CvPreviewProps {
  cv: ParsedCv;
  scanning: boolean;
}

function SkeletonRow({ w = 'w-full', h = 'h-2.5' }: { w?: string; h?: string }) {
  return <div className={`${h} ${w} rounded-full bg-slate-200 dark:bg-slate-700/70 animate-pulse`} />;
}

export function CvPreview({ cv, scanning }: CvPreviewProps) {
  const { isAr } = useLanguage();

  // True when file just selected and API hasn't returned yet
  const isParsing = scanning && !cv.email && !cv.summary;

  // Real extracted fields
  const fullName = cv.fullName || '';
  const roleTitle = cv.currentTitle || '';
  const email = cv.email || '';
  const phone = cv.phone || '';
  const location = cv.location || '';
  const summary = cv.summary || '';

  const experiencesList = cv.experiences && cv.experiences.length > 0
    ? cv.experiences
    : cv.experience
    ? [{
        id: 'exp-single',
        role: cv.experience.title,
        company: cv.experience.company,
        startDate: cv.experience.period?.split('—')?.[0]?.trim() || '',
        endDate: cv.experience.period?.split('—')?.[1]?.trim() || 'Present',
        current: true,
        location: cv.experience.location,
        bullets: cv.experience.bullets || []
      }]
    : [];

  const educationList = cv.educationHistory && cv.educationHistory.length > 0
    ? cv.educationHistory
    : cv.education
    ? [{
        id: 'edu-single',
        degree: cv.education.degree,
        institution: cv.education.school,
        major: '',
        startDate: cv.education.period?.split('—')?.[0]?.trim() || '',
        endDate: cv.education.period?.split('—')?.[1]?.trim() || ''
      }]
    : [];

  const skillsList = cv.skills && cv.skills.length > 0
    ? cv.skills
    : cv.detectedSkills?.map((s) => s.name) || [];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs transition-all select-none">

      {/* Electric Blue Laser Scan Beam — shown always while scanning */}
      {scanning && (
        <>
          {/* Transparent Blue Gradient Sweep */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-28 bg-gradient-to-b from-blue-500/10 via-cyan-400/15 to-transparent z-10"
            initial={{ top: '-10%' }}
            animate={{ top: ['-10%', '85%', '-10%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Glowing Electric Blue Laser Line */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-[3.5px] bg-gradient-to-r from-transparent via-cyan-300 via-blue-500 to-transparent shadow-[0_0_24px_6px_rgba(59,130,246,0.9),0_0_8px_2px_rgba(6,182,212,0.8)] z-20"
            initial={{ top: '3%' }}
            animate={{ top: ['3%', '95%', '3%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Scrollable CV Paper */}
      <div
        className="max-h-[460px] overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {isParsing ? (
          /* ======== SKELETON while API is running ======== */
          <div className="space-y-4 py-1">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3 space-y-2">
              <SkeletonRow w="w-48" h="h-4" />
              <SkeletonRow w="w-32" h="h-3" />
              <div className="flex gap-3 mt-2">
                <SkeletonRow w="w-28" h="h-2.5" />
                <SkeletonRow w="w-24" h="h-2.5" />
                <SkeletonRow w="w-20" h="h-2.5" />
              </div>
            </div>
            <div className="space-y-1.5">
              <SkeletonRow w="w-24" h="h-2" />
              <SkeletonRow w="w-full" />
              <SkeletonRow w="w-5/6" />
              <SkeletonRow w="w-4/5" />
            </div>
            <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
              <SkeletonRow w="w-28" h="h-2" />
              <div className="flex justify-between gap-4">
                <SkeletonRow w="w-36" h="h-3" />
                <SkeletonRow w="w-24" h="h-2.5" />
              </div>
              <SkeletonRow w="w-32" h="h-2.5" />
              <SkeletonRow w="w-full" />
              <SkeletonRow w="w-5/6" />
              <SkeletonRow w="w-4/5" />
            </div>
            <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
              <SkeletonRow w="w-24" h="h-2" />
              <div className="flex justify-between gap-4">
                <SkeletonRow w="w-40" h="h-3" />
                <SkeletonRow w="w-20" h="h-2.5" />
              </div>
              <SkeletonRow w="w-28" h="h-2.5" />
            </div>
          </div>
        ) : (
          /* ======== REAL CV DATA after API returns ======== */
          <div className="space-y-3.5 text-slate-900 dark:text-white">

            {/* Header */}
            <header className="border-b border-slate-100 dark:border-white/10 pb-3">
              <h2 className="text-[17px] font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                {fullName}
              </h2>
              <p className="mt-0.5 text-[12.5px] font-bold text-blue-600 dark:text-blue-400 font-sans">
                {roleTitle}
              </p>
              <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-slate-500 dark:text-slate-400 font-sans">
                {email && (
                  <li className="flex items-center gap-1">
                    <MailIcon className="h-2.5 w-2.5 text-slate-400" />
                    <span>{email}</span>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-1">
                    <PhoneIcon className="h-2.5 w-2.5 text-slate-400" />
                    <span dir="ltr">{phone}</span>
                  </li>
                )}
                {location && (
                  <li className="flex items-center gap-1">
                    <MapPinIcon className="h-2.5 w-2.5 text-slate-400" />
                    <span>{location}</span>
                  </li>
                )}
                {cv.linkedin && (
                  <li className="flex items-center gap-1">
                    <LinkedinIcon className="h-2.5 w-2.5 text-slate-400" />
                    <span>LinkedIn</span>
                  </li>
                )}
              </ul>
            </header>

            {/* Summary */}
            {summary && (
              <section className="space-y-1 font-sans">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {isAr ? "الملخص المهني" : "PROFESSIONAL SUMMARY"}
                </h3>
                <p className="text-[11.5px] leading-[1.6] text-slate-600 dark:text-slate-300">
                  {summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {experiencesList.length > 0 && (
              <section className="space-y-2.5 pt-1.5 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-blue-600" />
                  <span>{isAr ? "الخبرات المهنية" : "WORK EXPERIENCE"}</span>
                </h3>
                <div className="space-y-3">
                  {experiencesList.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-[12px] font-bold text-slate-900 dark:text-white font-sans">
                          {exp.role}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 font-sans shrink-0">
                          {exp.startDate ? `${exp.startDate} — ${exp.endDate || 'Present'}` : ''}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 font-sans">
                        {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                      </p>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="mt-1 space-y-1 font-sans">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educationList.length > 0 && (
              <section className="space-y-2 pt-1.5 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-emerald-600" />
                  <span>{isAr ? "التعليم" : "EDUCATION"}</span>
                </h3>
                <div className="space-y-2 font-sans">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="flex items-baseline justify-between gap-2">
                      <div>
                        <h4 className="text-[11.5px] font-bold text-slate-900 dark:text-white">
                          {edu.degree}{edu.major ? ` in ${edu.major}` : ''}
                        </h4>
                        <p className="text-[10.5px] text-slate-500">{edu.institution}</p>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        {edu.startDate ? `${edu.startDate} — ${edu.endDate}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skillsList.length > 0 && (
              <section className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-white/5 font-sans">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-600" />
                  <span>{isAr ? "المهارات والتقنيات" : "SKILLS & TECHNOLOGIES"}</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold border border-blue-100 dark:border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}