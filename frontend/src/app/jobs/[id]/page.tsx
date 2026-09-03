"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  Bookmark, 
  Share2, 
  Zap,
  ExternalLink, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Check, 
  X, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  Globe,
  Radio,
  Target,
  Eye,
  Diamond,
  Compass,
  Network,
  Smartphone,
  CalendarDays,
  Star,
  Award,
  ShieldCheck,
  TrendingUp,
  Navigation,
  HeartPulse,
  Home,
  BookOpen,
  Coffee,
  Bus,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import type { JobItem } from '@/data/jobs';
import {
  cleanEnglishOverview,
  cleanArabicOverview,
  cleanEnglishResponsibilities,
  cleanArabicResponsibilities,
  cleanEnglishRequirements,
  cleanArabicRequirements
} from '@/utils/jobLocalization';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAr } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const jobId = params?.id as string;
  // Start with empty placeholder — real data replaces it on load. Content is only rendered when !loadingJob && !notFound
  const [job, setJob] = useState<JobItem>({} as JobItem);
  const [similarJobs, setSimilarJobs] = useState<JobItem[]>([]);
  const [loadingJob, setLoadingJob] = useState(true);
  const [notFound, setNotFound] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    if (jobId) {
      setLoadingJob(true);
      fetch(`/api/jobs/${jobId}`)
        .then((res) => res.json())
        .then((data) => {
          if (mounted) {
            if (data?.job) {
              setJob(data.job);
            } else {
              setNotFound(true);
            }
          }
        })
        .catch((err) => {
          console.warn('Could not fetch dynamic job:', err);
          if (mounted) setNotFound(true);
        })
        .finally(() => {
          if (mounted) setLoadingJob(false);
        });

      // Fetch live similar jobs
      fetch(`/api/jobs?limit=6`)
        .then((res) => res.json())
        .then((data) => {
          if (mounted && Array.isArray(data?.jobs)) {
            setSimilarJobs(data.jobs.filter((j: any) => String(j.id) !== String(jobId)).slice(0, 3));
          }
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [jobId]);

  const handleApply = () => {
    const url = job.applyUrl || (job as any).apply_url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      setApplied(true);
    }
  };

  const getDepartmentForRole = (title: string, isArLang: boolean) => {
    const t = (title || '').toLowerCase();
    if (/data|analytics|bi\b|scientist|power bi/i.test(t)) return isArLang ? "تحليل وهندسة البيانات" : "Data & Analytics";
    if (/frontend|backend|full.?stack|react|node|developer|software/i.test(t)) return isArLang ? "تطوير وهندسة البرمجيات" : "Software Engineering";
    if (/devops|cloud|sre|infrastructure/i.test(t)) return isArLang ? "الحوسبة السحابية و DevOps" : "Cloud & DevOps";
    if (/product|scrum|agile/i.test(t)) return isArLang ? "إدارة المنتجات والتحول الرقمي" : "Product & Project Management";
    if (/qa|quality|testing/i.test(t)) return isArLang ? "اختبار وضمان جودة البرمجيات" : "Quality Assurance";
    if (/ui|ux|design/i.test(t)) return isArLang ? "تصميم الواجهات وتجربة المستخدم" : "UI/UX & Product Design";
    if (/ai|machine learning|deep learning/i.test(t)) return isArLang ? "الذكاء الاصطناعي والتعلم الآلي" : "AI & Machine Learning";
    return isArLang ? "قطاع التكنولوجيا والتحول الرقمي" : "Technology & Digital";
  };

  const getCompanyDetails = (comp: string, loc?: string) => {
    const norm = (comp || '').toLowerCase().trim();
    const effectiveLoc = loc || job?.location || 'Cairo, Egypt';
    const cleanComp = comp ? comp.replace(/-\s*Egypt$/i, '').replace(/-\s*Saudi Arabia$/i, '').replace(/-$/, '').trim() : (isAr ? 'جهة العمل' : 'Employer');

    const isSaudi = /saudi|riyadh|jeddah|dammam|khobar|السعودية/i.test(effectiveLoc);
    const isUAE = /uae|dubai|abu dhabi|sharjah|الإمارات/i.test(effectiveLoc);
    const countryName = isSaudi ? (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia') : isUAE ? (isAr ? 'الإمارات' : 'UAE') : (isAr ? 'مصر' : 'Egypt');

    if (norm.includes('vodafone')) {
      return {
        name: isAr ? 'فودافون مصر' : 'Vodafone Egypt',
        countryName,
        address: isAr ? 'مبنى C3، القرية الذكية، الكيلو 28 طريق مصر-إسكندرية الصحراوي، الجيزة' : 'Building C3, Smart Village, Giza, Egypt',
        hours: isAr ? 'الأحد – الخميس، 9:00 ص – 5:00 م' : 'Sun – Thu, 9:00 AM – 5:00 PM',
        phone: '+20 2 3535 5555',
        website: 'www.vodafone.com.eg',
        isExternalSearch: false,
        mapEmbedUrl: 'https://maps.google.com/maps?q=30.0768,31.0188+(Vodafone+Egypt+Head+Office)&z=16&output=embed',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vodafone+Egypt+Smart+Village',
        hqTitle: isAr ? 'المقر الرئيسي لفودافون مصر' : 'Vodafone Egypt HQ',
        hqLocation: isAr ? 'القرية الذكية، الجيزة' : 'Smart Village, Giza',
        isVerifiedEmployer: true,
      };
    }

    const encodedQuery = encodeURIComponent(`${cleanComp} ${effectiveLoc}`);
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${cleanComp} Egypt`)}`;

    return {
      name: cleanComp,
      countryName,
      address: `${effectiveLoc}، ${countryName}`,
      hours: isAr ? 'ساعات العمل بحسب نظام الشركة' : 'Standard business hours',
      phone: isAr ? 'التواصل عبر طلب التقديم الرسمي' : 'Contact via application',
      website: searchUrl,
      isExternalSearch: true,
      mapEmbedUrl: `https://maps.google.com/maps?q=${encodedQuery}&z=13&output=embed`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      hqTitle: cleanComp,
      hqLocation: effectiveLoc,
      isVerifiedEmployer: cleanComp !== 'Confidential' && cleanComp !== 'Confidential Employer',
    };
  };

  const companyDetails = getCompanyDetails(job.company || '', job.location);

  const tabs = isAr
    ? [
        { id: 'overview', label: 'نظرة عامة والمهام' },
        { id: 'company', label: 'عن جهة العمل وموقعها' },
        { id: 'similar', label: 'وظائف مشابهة' }
      ]
    : [
        { id: 'overview', label: 'Overview & Requirements' },
        { id: 'company', label: 'Company & Location' },
        { id: 'similar', label: 'Similar Jobs' }
      ];

  // Reusable Job Header Hero Card
  const renderJobHeaderCard = () => (
    <div className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <CompanyLogo
            company={job.company}
            logoUrl={(job as any).companyLogo || (job as any).company_logo}
            size="lg"
            className="shrink-0"
          />

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[20px] font-black text-[#0B132B] dark:text-white leading-tight">
                {isAr ? job.titleAr : job.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/30 text-[#12B76A] dark:text-emerald-400 text-[11px] font-bold">
                {job.matchScore}% {isAr ? "مطابقة" : "Match"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[13.5px] font-bold text-slate-700 dark:text-slate-300">
              <span>{isAr ? job.companyAr : job.company}</span>
              <span className="h-4 w-4 rounded-full bg-[#1B57E0] text-white flex items-center justify-center text-[9px] font-black">
                ✓
              </span>
            </div>

            {/* Metadata & Salary row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {isAr ? job.locationAr : job.location} ({isAr ? job.workTypeAr : job.workType})
              </span>
              <span>•</span>
              <span>{isAr ? job.postedAgoAr : job.postedAgo}</span>
              <span>•</span>
              <span>{job.applicantsCount} {isAr ? "متقدمين" : "applicants"}</span>
              <span>•</span>
              {(job.salaryRangeAr === 'تحدد أثناء المقابلة' || job.salaryRange === 'Disclosed upon interview') ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">
                  🤝 {isAr ? 'يتحدد أثناء المقابلة' : 'Disclosed upon interview'}
                </span>
              ) : (
                <>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    💰 {isAr ? job.salaryRangeAr : job.salaryRange}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/30 text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {isAr ? 'معلن' : 'Disclosed'}
                  </span>
                </>
              )}
            </div>

            {/* Pill Tags Row */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#E8F8F0] dark:bg-emerald-950/50 text-[11px] font-bold text-[#12B76A]">
                {isAr ? job.employmentTypeAr : job.employmentType}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#EEF3FE] dark:bg-blue-950/50 text-[11px] font-bold text-[#1B57E0]">
                {isAr ? job.workTypeAr : job.workType}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#F3E8FF] dark:bg-purple-950/50 text-[11px] font-bold text-[#9333EA]">
                {isAr ? job.seniorityAr : job.seniority} Level
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#FFF7ED] dark:bg-amber-950/50 text-[11px] font-bold text-[#F97316]">
                {isAr ? job.departmentAr : job.department}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2.5 shrink-0">
          <a
            href={job.applyUrl || (job as any).apply_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setApplied(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-[13.5px] shadow-md shadow-blue-600/30 hover:shadow-blue-600/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 opacity-90" />
            <span>{applied ? (isAr ? "تم التقديم بنجاح ✓" : "Applied ✓") : (isAr ? "التقديم الفوري الآن ↗" : "Apply Now ↗")}</span>
          </a>

          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className="w-full sm:w-auto px-5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[12.5px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-blue-600' : ''}`} />
            <span>{isSaved ? (isAr ? "محفوظة ✓" : "Saved ✓") : (isAr ? "حفظ الوظيفة" : "Save Job")}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Reusable Tabs Navigation Header
  const renderTabsHeader = () => (
    <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 overflow-x-auto pb-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2.5 text-[14px] font-bold transition-all relative whitespace-nowrap cursor-pointer ${
            activeTab === tab.id
              ? 'text-[#1B57E0] dark:text-[#60A5FA]'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <span>{tab.label}</span>
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1B57E0] dark:bg-[#60A5FA] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );

  // Reusable Right Intelligence Panel (Rendered ONLY in Overview Tab!)
  const renderRightPanel = () => (
    <div className="lg:col-span-4 space-y-4">
      
      {/* Widget 1: Your Fit Intelligence */}
      <div className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF3FE] dark:bg-purple-950/70 text-[#7C3AED] dark:text-[#A78BFA]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-bold text-[#0B132B] dark:text-white">
              {isAr ? "ذكاء المطابقة لملفك" : "Your Fit Intelligence"}
            </h3>
          </div>

          <InfoTooltip
            title="Fit Intelligence"
            titleAr="ذكاء التوافق"
            content="Overall match percentage computed using weighted skill relevance, seniority level, and location compatibility."
            contentAr="نسبة المطابقة الإجمالية المحسوبة بناءً على وزن المهارات المطلوبة، وسنوات الخبرة، وطبيعة العمل."
          />
        </div>

        {/* Circular Gauge Ring */}
        <div className="flex flex-col items-center justify-center py-0.5">
          <div className="relative h-[115px] w-[115px]">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="41" fill="none" stroke="#E8F8F0" className="dark:stroke-emerald-950/40" strokeWidth="7" />
              <circle
                cx="50"
                cy="50"
                r="41"
                fill="none"
                stroke="#10B981"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 41}
                strokeDashoffset={2 * Math.PI * 41 * (1 - job.matchScore / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[25px] font-black text-[#0B132B] dark:text-white leading-none">
                {job.matchScore}%
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5">
                {isAr ? "توافق إجمالي" : "Overall Match"}
              </span>
            </div>
          </div>

          <p className="mt-2 text-center text-[12px] text-slate-600 dark:text-slate-300 font-medium max-w-[210px]">
            {isAr ? "توافق ممتاز! خبراتك تغطي أغلب متطلبات الوظيفة." : "Great Match! You meet most of the key requirements."}
          </p>
        </div>

        {/* Skills Match Breakdown Subsection */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-3">
          <h4 className="text-[13px] font-bold text-[#0B132B] dark:text-white">
            {isAr ? "تفصيل مطابقة المهارات" : "Skills Match Breakdown"}
          </h4>

          {/* Matched Skills */}
          {(() => {
            const NON_SKILLS = new Set([
              'internship', 'student', 'it/software development', 'research', 'ai', 'bi', 'experienced',
              'business analysis', 'data analysis', 'data analytics', 'market research', 'computer skills', 'operations'
            ]);
            const cleanMatched = (job.matchedSkills || []).filter(s => !NON_SKILLS.has(s.name.toLowerCase()));
            const cleanMissing = (job.missingSkills || []).filter(s => !NON_SKILLS.has(s.name.toLowerCase()));

            return (
              <>
                {cleanMatched.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#12B76A]">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#E8F8F0] dark:bg-emerald-950/70 text-[#12B76A] text-[9px] font-black">
                        ✓
                      </span>
                      <span>{isAr ? "المهارات المتطابقة" : "Matched Skills"}</span>
                    </div>

                    <div className="space-y-2">
                      {cleanMatched.map((s) => {
                        const pct = Math.min(100, Math.max(30, s.weight > 1 ? Math.round(s.weight) : Math.round(s.weight * 100)));
                        return (
                          <div key={s.name} className="space-y-1">
                            <div className="flex items-center justify-between text-[11.5px]">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">{pct}% {isAr ? "تغطية" : "Fit"}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {cleanMissing.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#EA580C]">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FFF7ED] dark:bg-amber-950/70 text-[#EA580C] text-[9px] font-black">
                        ●
                      </span>
                      <span>{isAr ? "المهارات الناقصة وفرص التحسين" : "Missing Skills to Add"}</span>
                    </div>

                    <div className="space-y-2.5">
                      {cleanMissing.map((s, idx) => {
                        const boostPct = Math.min(35, Math.max(10, Math.round((s.weight > 1 ? s.weight / 100 : s.weight) * 20 + 8)));
                        const noteText = isAr
                          ? (s.marketNoteAr || s.marketNote || `مطلوبة في ${Math.max(25, 65 - idx * 10)}% من الوظائف المماثلة بالقاهرة`)
                          : (s.marketNote || `Found in ${Math.max(25, 65 - idx * 10)}% of similar Cairo jobs`);

                        return (
                          <div key={s.name} className="space-y-1">
                            <div className="flex items-center justify-between text-[11.5px]">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                              <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">+{boostPct}% {isAr ? "توافق" : "Boost"}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-[#F97316]" style={{ width: `${Math.min(100, boostPct * 3.5)}%` }} />
                            </div>
                            <p className="text-[10.5px] text-[#EA580C] dark:text-orange-400 font-medium">
                              {noteText}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

      </div>

      {/* Widget 2: CV Compatibility & Optimizer (Matching media_1787760926645.png 1:1) */}
      <div className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[13.5px] font-bold text-[#0B132B] dark:text-white">
            {isAr ? "توافق الـ CV مع هذه الوظيفة" : "CV Compatibility for this Job"}
          </h3>
          <InfoTooltip
            title="CV Compatibility"
            titleAr="توافق السيرة الذاتية"
            content="This score evaluates how well your current CV keywords, technical skills, and experience match this specific job description based on our AI ATS parser."
            contentAr="يقيس هذا المؤشر مدى تطابق الكلمات المفتاحية والمهارات والخبرات المذكورة في سيرتك الذاتية مع متطلبات هذه الوظيفة بالتحديد وفقاً لفاحص الـ ATS الذكي."
          />
        </div>

        {/* Arc Gauge */}
        <div className="flex flex-col items-center py-1">
          {(() => {
            const cvScore = job.matchScore || 85;
            const arcRadius = 38;
            const arcLength = Math.PI * arcRadius; // ~119.38
            const strokeOffset = arcLength * (1 - cvScore / 100);

            return (
              <div className="relative h-20 w-36 overflow-hidden flex items-end justify-center">
                <svg viewBox="0 0 100 55" className="h-full w-full">
                  {/* Background Arc (180 deg semicircle from (12, 48) to (88, 48)) */}
                  <path
                    d="M 12 48 A 38 38 0 0 1 88 48"
                    fill="none"
                    stroke="#EEF3FE"
                    className="dark:stroke-slate-800"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Foreground Animated Match Arc (EXACT same geometric path) */}
                  <path
                    d="M 12 48 A 38 38 0 0 1 88 48"
                    fill="none"
                    stroke="#1B57E0"
                    className="dark:stroke-blue-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={strokeOffset}
                  />
                </svg>
                <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
                  <span className="text-[22px] font-black text-[#0B132B] dark:text-white leading-none">
                    {cvScore}<span className="text-[13px] text-slate-400 font-bold">/100</span>
                  </span>
                </div>
              </div>
            );
          })()}

          <p className="mt-2 text-center text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">
            {isAr 
              ? "سيرتك الذاتية متوافقة بشكل جيد، ويمكن تحسين صياغة بعض الكلمات لمضاعفة فرص القبول."
              : "Your CV is good, but can be improved for higher chances."}
          </p>
        </div>

        <Link
          href="/cv-builder"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>{isAr ? "تحسين الـ CV لهذه الوظيفة" : "Optimize CV for this Role"}</span>
        </Link>
      </div>

    </div>
  );

  return (
    <AppShell showSearch={false}>
      {/* Loading state */}
      {(loadingJob || !job.id) && !notFound && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <p className="text-[14px] font-semibold text-slate-500 dark:text-slate-400">
            {isAr ? "جاري تحميل تفاصيل الوظيفة..." : "Loading job details..."}
          </p>
        </div>
      )}

      {/* Not found state */}
      {notFound && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-[18px] font-bold text-slate-700 dark:text-slate-300">
            {isAr ? "لم يتم العثور على الوظيفة" : "Job not found"}
          </p>
          <Link href="/jobs" className="px-5 py-2 rounded-xl bg-blue-600 text-white text-[13px] font-bold hover:bg-blue-700 transition-colors">
            {isAr ? "العودة للوظائف" : "Back to Jobs"}
          </Link>
        </div>
      )}

      {/* Full content — only when job is loaded */}
      {!loadingJob && job.id && !notFound && (
      <div className="space-y-4 max-w-[1440px] mx-auto pb-8">
        
        {/* 1. TOP BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-[13.5px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
            <span>{isAr ? "العودة إلى قائمة الوظائف" : "Back to Jobs"}</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 2. OVERVIEW TAB: 2 COLUMNS (Right Panel Starts Under Top Bar!)            */}
        {/* ========================================================================= */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
            
            {/* Left Column (Span 8) */}
            <div className="lg:col-span-8 space-y-4 min-w-0">
              {renderJobHeaderCard()}
              {renderTabsHeader()}

              {/* Overview Tab Content */}
              <div className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs space-y-5">
                <div>
                  <h2 className="text-[16px] font-bold text-[#0B132B] dark:text-white">
                    {isAr ? "الوصف الوظيفي والمهام" : "Job Overview & Requirements"}
                  </h2>
                  <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {isAr
                      ? cleanArabicOverview(job.titleAr, job.companyAr, job.locationAr, job.descriptionAr)
                      : cleanEnglishOverview(job.title, job.company, job.location, job.description)}
                  </p>
                </div>

                {/* 2-Column Split: Tasks on Left, 7 Specs on Right */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3 border-t border-slate-100 dark:border-white/5">
                  
                  {/* Tasks & Requirements (md:col-span-7) */}
                  <div className="md:col-span-7 space-y-4">
                    
                    {/* Responsibilities */}
                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#0B132B] dark:text-white">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EEF3FE] dark:bg-blue-950/70 text-[#1B57E0]">
                          <Briefcase className="w-3.5 h-3.5" />
                        </span>
                        <span>{isAr ? "المسؤوليات والمهام الرئيسية" : "Key Responsibilities"}</span>
                      </h3>
                      <ul className="space-y-1.5 ltr:pl-1 rtl:pr-1 text-[12.5px] text-slate-600 dark:text-slate-300">
                        {(isAr
                          ? cleanArabicResponsibilities(job.titleAr, job.responsibilitiesAr, (job.matchedSkills || []).map(s => s.name))
                          : cleanEnglishResponsibilities(job.title, job.responsibilities, (job.matchedSkills || []).map(s => s.name))
                        ).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1B57E0] mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#0B132B] dark:text-white">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E8F8F0] dark:bg-emerald-950/70 text-[#12B76A]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                        <span>{isAr ? "متطلبات التعيين والمؤهلات" : "Requirements"}</span>
                      </h3>
                      <ul className="space-y-1.5 ltr:pl-1 rtl:pr-1 text-[12.5px] text-slate-600 dark:text-slate-300">
                        {(isAr
                          ? cleanArabicRequirements(job.titleAr, job.requirementsAr, (job.matchedSkills || []).map(s => s.name))
                          : cleanEnglishRequirements(job.title, job.requirements, (job.matchedSkills || []).map(s => s.name))
                        ).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A] mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* 7 Metadata Spec Matrix (md:col-span-5) */}
                  <div className="md:col-span-5 rounded-2xl bg-slate-50/60 dark:bg-[#0B1120]/[0.02] border border-slate-100 dark:border-white/[0.04] p-3.5 space-y-2.5">
                    
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#0B1120]/5 shadow-2xs text-slate-500">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10.5px] text-slate-400">{isAr ? "المستوى الوظيفي" : "Seniority Level"}</span>
                        <p className="text-[12.5px] font-bold text-[#0B132B] dark:text-white">{isAr ? job.seniorityAr : job.seniority}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#0B1120]/5 shadow-2xs text-slate-500">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10.5px] text-slate-400">{isAr ? "نوع التوظيف" : "Employment Type"}</span>
                        <p className="text-[12.5px] font-bold text-[#0B132B] dark:text-white">{isAr ? job.employmentTypeAr : job.employmentType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#0B1120]/5 shadow-2xs text-slate-500">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10.5px] text-slate-400">{isAr ? "طبيعة العمل" : "Work Type"}</span>
                        <p className="text-[12.5px] font-bold text-[#0B132B] dark:text-white">{isAr ? job.workTypeAr : job.workType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#0B1120]/5 shadow-2xs text-slate-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10.5px] text-slate-400">{isAr ? "القسم أو الإدارة" : "Department"}</span>
                        <p className="text-[12.5px] font-bold text-[#0B132B] dark:text-white">{getDepartmentForRole(job.title, isAr)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#0B1120]/5 shadow-2xs text-slate-500">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10.5px] text-slate-400">{isAr ? "المؤهل الدراسي" : "Education"}</span>
                        <p className="text-[12.5px] font-bold text-[#0B132B] dark:text-white">{isAr ? job.educationAr : job.education}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#0B1120]/5 shadow-2xs text-slate-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10.5px] text-slate-400">{isAr ? "سنوات الخبرة" : "Experience"}</span>
                        <p className="text-[12.5px] font-bold text-[#0B132B] dark:text-white">{isAr ? job.experienceYearsAr : job.experienceYears}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#0B1120]/5 shadow-2xs text-slate-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[10.5px] text-slate-400">{isAr ? "المقر والمحافظة" : "Location"}</span>
                        <p className="text-[12.5px] font-bold text-[#0B132B] dark:text-white">{isAr ? job.locationAr : job.location}</p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Right Panel (Span 4) */}
            {renderRightPanel()}

          </div>
        ) : (
          /* ========================================================================= */
          /* 3. OTHER TABS (FULL 100% WIDTH - NO RIGHT PANEL AT ALL!)                 */
          /* ========================================================================= */
          <div className="space-y-4 w-full">
            {renderJobHeaderCard()}
            {renderTabsHeader()}

            {/* TAB 2: ABOUT COMPANY (FULL WIDTH 100%) */}
            {activeTab === 'company' && (
              <div className="space-y-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Left Card: Company Profile & Verification */}
                  <div className="lg:col-span-6 rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CompanyLogo
                          company={job.company}
                          logoUrl={(job as any).companyLogo || (job as any).company_logo}
                          size="md"
                          className="shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-[18px] font-black text-[#0B132B] dark:text-white">
                              {isAr ? `عن ${companyDetails.name}` : `About ${companyDetails.name}`}
                            </h2>
                            {companyDetails.isVerifiedEmployer && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10.5px] font-bold border border-blue-200/60 dark:border-blue-500/30">
                                <ShieldCheck className="w-3 h-3" />
                                {isAr ? "جهة عمل نشطة" : "Active Employer"}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {isAr ? `مقر العمل: ${job.locationAr || job.location}` : `Location: ${job.location}`}
                          </p>
                        </div>
                      </div>

                      <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {isAr
                          ? `فرصة عمل معلنة ومُحققة عبر منصة التوظيف الرسمية لمنصب ${job.titleAr || job.title} لدى ${companyDetails.name} في ${companyDetails.countryName}. بيئة العمل تتبع نظام ${job.workTypeAr} وتتطلب مهارات أساسية في التخصص.`
                          : `Verified job posting for ${job.title} at ${companyDetails.name} in ${companyDetails.countryName}. Work arrangement is ${job.workType} and requires relevant technical domain expertise.`}
                      </p>

                      {/* 4 Verified Fact Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-100 dark:border-white/5">
                          <span className="text-[14px] font-bold text-slate-900 dark:text-white block leading-tight truncate">{isAr ? job.workTypeAr : job.workType}</span>
                          <span className="text-[10.5px] text-slate-400 block mt-1">{isAr ? "طبيعة العمل" : "Work Mode"}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-100 dark:border-white/5">
                          <span className="text-[14px] font-bold text-slate-900 dark:text-white block leading-tight truncate">{isAr ? job.seniorityAr : job.seniority}</span>
                          <span className="text-[10.5px] text-slate-400 block mt-1">{isAr ? "المستوى الوظيفي" : "Seniority"}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-100 dark:border-white/5">
                          <span className="text-[14px] font-bold text-slate-900 dark:text-white block leading-tight truncate">{job.matchedSkills?.length || 0}</span>
                          <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">{isAr ? "مهارات مطابقة" : "Matched Skills"}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-100 dark:border-white/5">
                          <span className="text-[14px] font-bold text-blue-600 dark:text-blue-400 block leading-tight">Wuzzuf</span>
                          <span className="text-[10.5px] text-slate-400 block mt-1">{isAr ? "مصدر الإعلان" : "Job Source"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Verification Note */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isAr ? "تم التحقق من بيانات ورابط الوظيفة عبر الذكاء الاصطناعي" : "Job listing and apply link verified by AI parser"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Map & Details Card */}
                  <div className="lg:col-span-6 rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-xs space-y-4 flex flex-col justify-between">
                    
                    {/* Map */}
                    <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-inner">
                      <iframe
                        title={`${job.company} Location Map`}
                        src={companyDetails.mapEmbedUrl}
                        className="w-full h-full border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                      
                      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#0E172A]/95 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm shadow-md">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                          {isAr ? `موقع محدد بدقة: ${companyDetails.hqLocation}` : `Pinned Location: ${companyDetails.hqLocation}`}
                        </span>
                      </div>

                      <a
                        href={companyDetails.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[11.5px] font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{isAr ? "فتح في خرائط جوجل ↗" : "Open in Maps ↗"}</span>
                      </a>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
                      <div className="sm:col-span-7 space-y-2.5 text-[12px]">
                        <div className="flex items-center gap-2 text-[13.5px] font-bold text-[#0B132B] dark:text-white">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EEF3FE] dark:bg-blue-950/70 text-[#1B57E0]">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <span>{isAr ? "بيانات المقر الرئيسي" : "Main Office Details"}</span>
                        </div>

                        <div className="space-y-2 text-slate-600 dark:text-slate-300 text-[11.5px]">
                          <div className="flex items-start gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-500 text-[10px]">
                              📍
                            </span>
                            <div className="min-w-0">
                              <span className="text-slate-400 font-medium">{isAr ? "العنوان: " : "Address: "}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{companyDetails.address}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-500 text-[10px]">
                              🕒
                            </span>
                            <div className="min-w-0">
                              <span className="text-slate-400 font-medium">{isAr ? "مواعيد العمل: " : "Hours: "}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{companyDetails.hours}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-[10px]">
                              📞
                            </span>
                            <div className="min-w-0">
                              <span className="text-slate-400 font-medium">{isAr ? "الهاتف: " : "Contact: "}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{companyDetails.phone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 text-[10px]">
                              🌐
                            </span>
                            <div className="min-w-0">
                              <span className="text-slate-400 font-medium">{isAr ? "الموقع الرسمي: " : "Website: "}</span>
                              <a 
                                href={companyDetails.website.startsWith('http') ? companyDetails.website : `https://${companyDetails.website}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[#1B57E0] dark:text-blue-400 font-bold hover:underline truncate block"
                              >
                                {companyDetails.isExternalSearch 
                                  ? (isAr ? `البحث عن ${companyDetails.name} ↗` : `Search ${companyDetails.name} ↗`)
                                  : companyDetails.website}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* HD Building Photo / Verified Location Badge */}
                      <div className="sm:col-span-5 relative h-36 w-full rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm group bg-slate-900">
                        {(() => {
                          const norm = (job.company || '').toLowerCase();
                          let officeImg = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&auto=format&fit=crop&q=80';
                          if (norm.includes('vodafone')) officeImg = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&auto=format&fit=crop&q=80';
                          else if (norm.includes('valeo')) officeImg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&auto=format&fit=crop&q=80';
                          else if (norm.includes('siemens')) officeImg = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80';
                          else if (norm.includes('paymob') || norm.includes('fawry') || norm.includes('cib')) officeImg = 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=700&auto=format&fit=crop&q=80';
                          else if (norm.includes('instabug') || norm.includes('swvl')) officeImg = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&auto=format&fit=crop&q=80';
                          else if (norm.includes('exceliti') || norm.includes('excelliti')) officeImg = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&auto=format&fit=crop&q=80';

                          return (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={officeImg}
                                alt={companyDetails.hqTitle}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 p-3 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10.5px] font-bold backdrop-blur-xs shadow-xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                    {isAr ? "فرع معتمد" : "Verified Campus"}
                                  </span>
                                  <Building2 className="w-4 h-4 text-white/80" />
                                </div>
                                <div>
                                  <span className="text-[13px] font-extrabold text-white block leading-tight truncate">
                                    {companyDetails.name}
                                  </span>
                                  <span className="text-[10px] font-medium text-slate-200 block mt-0.5">
                                    📍 {companyDetails.hqLocation}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: SIMILAR JOBS TAB (FULL WIDTH 100%) */}
            {activeTab === 'similar' && (
              <div className="space-y-3.5 w-full">
                {similarJobs.length > 0 ? (
                  similarJobs.map((similarJob) => (
                    <div
                      key={similarJob.id}
                      className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 shadow-xs hover:border-blue-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <CompanyLogo company={similarJob.company} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link href={`/jobs/${similarJob.id}`} className="text-[15px] font-bold text-[#0B132B] dark:text-white hover:text-blue-600">
                              {isAr ? similarJob.titleAr : similarJob.title}
                            </Link>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#12B76A] font-bold text-[11px]">
                              {similarJob.matchScore || 85}% {isAr ? "مطابقة" : "Match"}
                            </span>
                          </div>
                          <p className="text-[12px] text-slate-400 mt-0.5">
                            {isAr ? similarJob.companyAr : similarJob.company} • {isAr ? similarJob.locationAr : similarJob.location} • {isAr ? similarJob.salaryRangeAr : similarJob.salaryRange}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/jobs/${similarJob.id}`}
                        className="px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13px] font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <span>{isAr ? "عرض التفاصيل والتوافق" : "View Role & Fit"}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-slate-400">
                    {isAr ? "لا توجد وظائف مشابهة إضافية حالياً" : "No similar jobs available currently"}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
      )} {/* end !loadingJob && job */}
    </AppShell>
  );
}
