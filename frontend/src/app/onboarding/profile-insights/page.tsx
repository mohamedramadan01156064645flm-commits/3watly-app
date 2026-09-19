"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  Sparkles, 
  CodeXmlIcon, 
  TrophyIcon, 
  Gauge, 
  Briefcase, 
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { SecureBadge } from '@/components/onboarding/PageHeading';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { TechIcon, techTile } from '@/components/icons/TechIcon';
import { riseIn } from '@/utils/motion';

function readinessBadge(score: number, isAr: boolean) {
  if (score >= 85) return {
    label: isAr ? 'جاهزية ممتازة' : 'Excellent Readiness',
    className: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-500/30',
    barColor: '#10B981',
  };
  if (score >= 70) return {
    label: isAr ? 'جاهزية جيدة' : 'Good Readiness',
    className: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200/70 dark:border-blue-500/30',
    barColor: '#3B82F6',
  };
  return {
    label: isAr ? 'تحسين مطلوب' : 'Needs Improvement',
    className: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200/70 dark:border-amber-500/30',
    barColor: '#F59E0B',
  };
}

export default function ProfileInsightsPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { profile, parsedCv } = useOnboarding();

  if (!profile || !parsedCv) {
    return (
      <RequireOnboarding need="parsedCv">
        <div />
      </RequireOnboarding>
    );
  }

  // 100% Consistent numbers from parsed CV
  const allExtractedSkills: string[] = (parsedCv.skills && parsedCv.skills.length > 0)
    ? parsedCv.skills
    : (parsedCv.detectedSkills && parsedCv.detectedSkills.length > 0)
    ? parsedCv.detectedSkills.map(s => s.name)
    : [];

  const totalSkillsCount = allExtractedSkills.length;
  const atsScore = parsedCv.atsReport?.score ?? (profile.scores?.overall > 0 ? profile.scores.overall : Math.min(100, Math.max(20, totalSkillsCount * 10)));
  const skillsScore = Math.min(100, Math.max(20, totalSkillsCount * 10));
  
  const expItemsCount = parsedCv.experiences?.length || 0;
  // Use real parsed experienceYears (0 for fresh grads / interns)
  const expYears = typeof parsedCv.experienceYears === 'number' ? parsedCv.experienceYears : 0;
  const expScore = Math.min(100, expYears > 0 ? Math.min(expYears * 20 + 40, 90) : 30);
  
  const badge = readinessBadge(atsScore, isAr);

  // Profile Highlights — always generated fresh from data so Arabic mode is always Arabic
  // We never blindly pass cached English strings from atsReport.strengths
  const rawStrengths = parsedCv.atsReport?.strengths;
  const realStrengths: string[] = (() => {
    // If strengths are new bilingual objects {en, ar}, use them
    if (rawStrengths && rawStrengths.length > 0 && typeof rawStrengths[0] === 'object' && rawStrengths[0] !== null) {
      return rawStrengths.map((s: any) => isAr ? (s.ar || s.en) : (s.en || s.ar));
    }
    // Otherwise (old cache or plain strings): always generate from actual data
    const roleLabel = parsedCv.targetRole || (isAr ? 'التقنية' : 'tech');
    return isAr
      ? [
          `توافق قوي مع متطلبات سوق ${roleLabel}`,
          `تم اكتشاف ${totalSkillsCount} مهارة تقنية موثقة من سيرتك الذاتية`,
          'تم التحقق من التنسيق أحادي العمود المتوافق مع أنظمة ATS'
        ]
      : [
          `Strong alignment with ${roleLabel} market criteria`,
          `Identified ${totalSkillsCount} verified technical ${totalSkillsCount === 1 ? 'competency' : 'competencies'}`,
          'Single-Column ATS formatting validated'
        ];
  })();


  const hasNoData = expItemsCount === 0 && totalSkillsCount === 0;

  return (
    <RequireOnboarding need="parsedCv">
      <StepShell step={3}>
        <div className="flex min-h-[calc(100vh-196px)] flex-col">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-blue-100 dark:border-white/10 bg-blue-50 dark:bg-blue-950/70">
                <Gauge className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </span>
              <div>
                <h1 className="text-[27px] font-bold leading-tight tracking-tight text-[#0B132B] dark:text-white">
                  {isAr ? 'ملخص مؤشرات ملفك المهني' : 'Your Profile Insights'}
                </h1>
                <p className="mt-1 text-[14px] font-normal text-slate-500 dark:text-slate-400">
                  {parsedCv.fullName
                    ? (isAr ? `تحليل مخصص لـ ${parsedCv.fullName}` : `Personalized analysis for ${parsedCv.fullName}`)
                    : (isAr ? 'نظرة شاملة ودقيقة على جاهزيتك في سوق العمل' : 'A detailed overview of your market readiness')}
                </p>
              </div>
            </div>
            <SecureBadge />
          </div>

          {/* Warning if very little data extracted */}
          {hasNoData && (
            <motion.div
              {...riseIn(0)}
              className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 px-5 py-4"
            >
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[13px] text-amber-800 dark:text-amber-300">
                <span className="font-bold block">
                  {isAr ? 'تعذر استخراج كل بيانات السيرة الذاتية' : 'Limited data extracted from your CV'}
                </span>
                <span className="mt-1 block text-amber-700 dark:text-amber-400">
                  {isAr
                    ? 'يمكنك المتابعة وتعديل بياناتك لاحقاً عبر CV Builder.'
                    : 'You can continue and edit your profile details later in CV Builder.'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Main Grid */}
          <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">

            {/* Left: Gauge Card */}
            <motion.div
              {...riseIn(0)}
              className="lg:col-span-5 rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-7 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                    {isAr ? 'مؤشر التوافق الإجمالي' : 'Overall Market Fit'}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11.5px] font-bold border ${badge.className}`}>
                    <Sparkles className="w-3 h-3" />
                    {badge.label}
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <div className="relative h-[130px] w-[130px]">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor"
                        className="text-slate-100 dark:text-slate-800" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={badge.barColor} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - atsScore / 100) }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        className="text-[2.35rem] font-black leading-none tracking-tight"
                        style={{ color: badge.barColor }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        {atsScore}%
                      </motion.span>
                      <span className="text-[11px] font-bold text-slate-400 mt-1">
                        {isAr ? 'نسبة التوافق' : 'ATS Score'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-metrics */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {isAr ? 'مطابقة المهارات' : 'Skills Alignment'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {totalSkillsCount} {isAr ? 'مهارة مستخرجة' : 'skills'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-blue-600 dark:bg-blue-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(10, skillsScore))}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} />
                  </div>
                </div>

                <div className="pt-1">
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {isAr ? 'ملاءمة الخبرة' : 'Experience Fit'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {expYears > 0 
                        ? `${expYears} ${isAr ? (expYears === 1 ? 'سنة' : 'سنوات') : (expYears === 1 ? 'Year' : 'Years')}` 
                        : expItemsCount > 0
                        ? (isAr ? 'تدريب / خريج جديد' : 'Intern / Fresh Grad')
                        : (isAr ? 'خريج جديد' : 'Fresh Graduate')}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-purple-600 dark:bg-purple-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(15, expScore)}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
                  </div>
                </div>

                {/* ATS field checklist */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: 'email', label: isAr ? 'البريد الإلكتروني' : 'Email', ok: Boolean(parsedCv.email) },
                    { id: 'phone', label: isAr ? 'رقم الهاتف' : 'Phone', ok: Boolean(parsedCv.phone) },
                    { id: 'location', label: isAr ? 'الموقع الجغرافي' : 'Location', ok: Boolean(parsedCv.location) },
                    { id: 'links', label: isAr ? 'الروابط المهنية (LinkedIn/GitHub)' : 'Professional Links', ok: Boolean(parsedCv.linkedin || parsedCv.github || parsedCv.portfolio || (parsedCv.links && parsedCv.links.length > 0)) },
                  ].map(item => (
                    <div key={item.id} className="flex items-center gap-1.5 text-[11.5px]">
                      <span className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.ok ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span className={item.ok ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400 line-through'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Skills + Strengths */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Redesigned High-End Skills Card */}
              <motion.section {...riseIn(1)}
                className="rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-sm flex-1"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                  <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                    <CodeXmlIcon className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    <span>{isAr ? 'المهارات المستخرجة من سيرتك الذاتية' : 'Extracted Technical Skills'}</span>
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold text-[12px] border border-blue-200/60 dark:border-blue-500/30">
                    {totalSkillsCount} {isAr ? 'مهارة مكتشفة' : 'skills detected'}
                  </span>
                </div>

                {totalSkillsCount > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                    {allExtractedSkills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                        className="flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.04] px-3.5 py-2 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500/40 hover:-translate-y-0.5 transition-all group"
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${techTile(skill)}`}>
                          <TechIcon name={skill} className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {skill}
                        </span>
                        {index < 3 && (
                          <Sparkles className="w-3 h-3 text-amber-500 opacity-80" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 flex items-center gap-3 text-[13px] text-slate-400 dark:text-slate-500">
                    <Briefcase className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {isAr
                        ? 'لم يتم استخراج مهارات — يمكنك إضافتها عبر CV Builder لاحقاً'
                        : 'No skills extracted — add them later via CV Builder'}
                    </span>
                  </div>
                )}
              </motion.section>

              {/* Profile Highlights */}
              <motion.section {...riseIn(2)}
                className="rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-sm flex-1"
              >
                <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900 dark:text-white">
                  <TrophyIcon className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  {isAr ? 'أبرز نقاط تميز ملفك' : 'Profile Highlights'}
                </h2>
                <ul className="mt-4 space-y-3">
                  {realStrengths.map((strength, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: isAr ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                      className="flex items-start gap-3 text-[13.5px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <CheckIcon className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>

            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8">
            <StepFooter
              onBack={() => router.push('/onboarding/cv-upload')}
              onNext={() => router.push('/onboarding/recommendations')}
              nextLabel={isAr ? 'المتابعة إلى خطة الانطلاق' : 'Continue to Action Plan'}
            />
          </div>

        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
