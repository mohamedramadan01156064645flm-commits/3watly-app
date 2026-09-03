"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, Sparkles, ArrowUpRight, CheckCircle2, Rocket, Briefcase, Zap, Star } from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { StepFooter } from '@/components/onboarding/StepFooter';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { riseIn } from '@/utils/motion';
import { mockJobsList } from '@/data/jobs';

export default function RecommendationsPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { profile, parsedCv } = useOnboarding();
  const { setOnboardingCompleted } = useAuth();

  const handleFinish = async () => {
    try {
      await setOnboardingCompleted(true);
    } catch {}
    router.push('/dashboard');
  };

  if (!profile || !parsedCv) {
    return (
      <RequireOnboarding need="parsedCv">
        <div />
      </RequireOnboarding>
    );
  }

  const atsScore = parsedCv.atsReport?.score ?? 85;
  const userSkills = (parsedCv.skills || []).map((s: string) => s.toLowerCase());
  const topSkill = parsedCv.skills?.[0] || (isAr ? 'التقنيات الحديثة' : 'Python');
  const secondSkill = parsedCv.skills?.[1] || (isAr ? 'قواعد البيانات' : 'SQL');

  // Dynamic priority steps localized 100% in Arabic and English
  const dynamicActionPlan = parsedCv.actionPlan && parsedCv.actionPlan.length > 0
    ? parsedCv.actionPlan.map((item: any) => ({
        ...item,
        displayTitle: isAr 
          ? (item.titleAr || (item.title?.toLowerCase().includes('python') ? `تعزيز وإتقان مسار ${topSkill} المتقدم` : `تعزيز مهارات ${topSkill} و ${secondSkill}`))
          : item.title,
        displayDescription: isAr
          ? (item.descriptionAr || `بناء مشروع عملي متكامل في ${topSkill} يرفع نسبة قبولك في كبرى الشركات بنسبة 25%.`)
          : item.description
      }))
    : [
        {
          id: 'ap-1',
          displayTitle: isAr ? `تعزيز وإتقان مسار ${topSkill} و ${secondSkill} المتقدم` : `Master Advanced ${topSkill} & ${secondSkill}`,
          displayDescription: isAr
            ? `بناء مشروع عملي متكامل في ${topSkill} يرفع نسبة قبولك في كبرى الشركات بنسبة 25%.`
            : `Adding a portfolio project in ${topSkill} boosts callback rates by 25%.`,
          priority: 'high',
          category: 'Skill Enhancement'
        },
        {
          id: 'ap-2',
          displayTitle: isAr ? "سيرتك الذاتية متوافقة مع أنظمة الـ ATS وجاهزة للتقديم" : "ATS-Optimized Profile Ready for Applications",
          displayDescription: isAr
            ? "تم تجهيز وتدقيق ملفك المهني بنجاح. يمكنك التقديم مباشرة أو تعديل سيرتك عبر CV Builder."
            : "Your parsed profile is ready. You can apply directly or edit via CV Builder.",
          priority: 'medium',
          category: 'CV Optimization'
        },
        {
          id: 'ap-3',
          displayTitle: isAr ? "التقديم المباشر على الشواغر المطابقة لملفك" : "Apply to High-Match Egyptian Tech Openings",
          displayDescription: isAr
            ? "فرص وظيفية نشطة متوافقة مع مهاراتك وخبرتك جاهزة للتقديم المباشر."
            : "Active roles matched with your technical profile are ready for direct application.",
          priority: 'low',
          category: 'Job Applications'
        }
      ];

  const prioritySteps = dynamicActionPlan.slice(0, 3).map((item: any, idx: number) => {
    const isHigh = item.priority === 'high' || idx === 0;
    const isMed = item.priority === 'medium' || idx === 1;

    return {
      title: item.displayTitle,
      desc: item.displayDescription,
      tag: isHigh 
        ? (isAr ? "أولوية عالية" : "High Priority")
        : isMed 
        ? (isAr ? "موصى به" : "Recommended")
        : (isAr ? "فرص متاحة" : "Ready Now"),
      tagBg: isHigh
        ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-500/30"
        : isMed
        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/30"
        : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30"
    };
  });

  const [liveJobs, setLiveJobs] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/jobs?limit=6')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.jobs) && d.jobs.length > 0) {
          setLiveJobs(d.jobs);
        }
      })
      .catch(() => {});
  }, []);

  // Calculate genuine match score for every job based on actual user skills overlap
  const sourceJobs = liveJobs.length > 0 ? liveJobs : mockJobsList;
  const rankedJobs = sourceJobs.map(job => {
    const rawSkills = Array.isArray(job.matchedSkills) 
      ? job.matchedSkills.map((s: any) => (typeof s === 'string' ? s : s.name).toLowerCase())
      : (Array.isArray(job.required_skills) ? job.required_skills.map((s: string) => s.toLowerCase()) : []);
    const matchedCount = rawSkills.filter((rs: string) => 
      userSkills.some(us => us.includes(rs) || rs.includes(us))
    ).length;

    const overlapRatio = rawSkills.length > 0 ? matchedCount / rawSkills.length : 0.8;
    const calculatedMatch = Math.min(98, Math.max(72, Math.round(atsScore * 0.6 + overlapRatio * 40)));

    return {
      ...job,
      calculatedMatch,
      matchedCount
    };
  }).sort((a, b) => b.calculatedMatch - a.calculatedMatch || b.matchedCount - a.matchedCount);

  const displayJobs = rankedJobs.slice(0, 2);

  return (
    <RequireOnboarding need="parsedCv">
      <StepShell step={4}>
        <div className="flex min-h-[calc(100vh-196px)] flex-col">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-blue-100 dark:border-white/10 bg-blue-50 dark:bg-blue-950/70">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </span>
              <div>
                <h1 className="text-[27px] font-bold leading-tight tracking-tight text-[#0B132B] dark:text-white">
                  {isAr ? "خطة انطلاقك المهنية" : "Your Action Plan"}
                </h1>
                <p className="mt-1 text-[14px] font-normal text-slate-500 dark:text-slate-400">
                  {isAr 
                    ? "خطوات عملية محددة لسد الفجوات والانطلاق نحو أفضل الوظائف" 
                    : "High-impact steps to boost your market fit and land your next role"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/70 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/60 px-3.5 py-2">
              <ShieldCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[12.5px] font-bold text-emerald-800 dark:text-emerald-300">
                {isAr ? "خطة مخصصة لملفك بنسبة 100%" : "100% Personalized Plan"}
              </span>
            </div>
          </div>

          {/* 3 Action Priority Cards */}
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {prioritySteps.map((item, index) => (
              <motion.div
                key={`${item.title}-${index}`}
                {...riseIn(index)}
                className="rounded-[22px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 text-[12px] font-black">
                      {index + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${item.tagBg}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top Matched Roles Preview Card */}
          <motion.div {...riseIn(3)} className="mt-6 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-[#F8FAFC] dark:bg-[#080D1A] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isAr ? "وظائف جاهزة ومطابقة لملفك حالياً" : "Top Matched Roles Ready For You"}</span>
              </h2>
              <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">
                {isAr ? `+${rankedJobs.length} فرصة نشطة` : `+${rankedJobs.length} active roles`}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {displayJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-[#0D1527] p-4 shadow-sm hover:border-blue-400/50 transition-all"
                >
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                      {isAr ? job.titleAr : job.title}
                    </h4>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {isAr ? job.companyAr : job.company} • {isAr ? job.locationAr : job.location}
                    </p>
                  </div>
                  <span className="rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 font-black text-[13px] px-3 py-1.5 border border-emerald-200/70 dark:border-emerald-500/30">
                    {job.calculatedMatch}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step Footer */}
          <div className="mt-auto pt-8">
            <StepFooter
              onBack={() => router.push('/onboarding/profile-insights')}
              onNext={handleFinish}
              nextLabel={isAr ? "إتمام التهيئة والدخول للوحة التحكم" : "Complete & Enter Dashboard"}
              variant="finish"
            />
          </div>

        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
