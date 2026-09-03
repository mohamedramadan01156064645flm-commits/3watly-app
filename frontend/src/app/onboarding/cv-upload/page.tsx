"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Lock,
  Plus,
  Check,
  FileSearch,
  Layers,
  Award,
  Briefcase
} from 'lucide-react';
import { StepShell } from '@/components/onboarding/StepShell';
import { RequireOnboarding } from '@/components/onboarding/RequireOnboarding';
import { Dropzone } from '@/components/onboarding/cv/Dropzone';
import { ParsingStatus } from '@/components/onboarding/cv/ParsingStatus';
import { ExtractedSkills } from '@/components/onboarding/cv/ExtractedSkills';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { roleOptions } from '@/data/roles';
import { toast } from 'sonner';

export default function CvUploadPage() {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { user } = useAuth();
  const { 
    role, 
    file, 
    status, 
    progress, 
    checksRevealed, 
    skillsAdded,
    uploadFile, 
    removeFile, 
    parsedCv, 
    setQuickProfileData 
  } = useOnboarding();

  // Mode: 'cv-flow' or 'quick-profile'
  const [mode, setMode] = useState<'cv-flow' | 'quick-profile'>('cv-flow');

  // Quick Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [careerStage, setCareerStage] = useState<'student' | 'fresh-grad' | 'working' | 'switcher'>('fresh-grad');
  const [expYears, setExpYears] = useState('0-1 Years');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [careerGoal, setCareerGoal] = useState<'first-job' | 'upskill' | 'market-demand'>('first-job');
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Show parsing panel as soon as the file is selected (even while parsing)
  const fileSelected = Boolean(file);
  const targetRoleTitle = roleOptions.find((r) => r.id === role)?.title || (isAr ? 'محلل بيانات' : 'Data Analyst');
  const complete = status === 'complete';

  const suggestedSkills = role === 'software-engineer'
    ? ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'JavaScript', 'Git', 'REST API', 'Docker']
    : role === 'data-engineer'
    ? ['SQL', 'Python', 'Spark', 'Airflow', 'Kafka', 'Data Pipelines', 'ETL', 'PostgreSQL']
    : role === 'ml-engineer'
    ? ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Pandas', 'Deep Learning', 'Statistics', 'NLP']
    : role === 'devops'
    ? ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Terraform', 'Git', 'Monitoring']
    : ['SQL', 'Python', 'Power BI', 'Excel', 'Data Visualization', 'Pandas', 'Statistics', 'Data Cleaning'];

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) => 
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(customSkillInput.trim())) {
        setSelectedSkills((prev) => [...prev, customSkillInput.trim()]);
      }
      setCustomSkillInput('');
    }
  };

  const handleFinishQuickProfile = () => {
    setQuickProfileData({
      fullName: fullName.trim() || user?.fullName || 'User',
      careerStage,
      experience: expYears,
      skills: selectedSkills,
      goal: careerGoal
    });

    toast.success(isAr ? "تم إعداد ملفك المهني بنجاح!" : "Career profile configured successfully!");
    router.push('/onboarding/profile-insights');
  };

  return (
    <RequireOnboarding need="role">
      <StepShell step={2}>
        <div className="flex min-h-[calc(100vh-190px)] flex-col justify-between max-w-[1440px] mx-auto w-full py-3 space-y-6">
          
          <AnimatePresence mode="wait">
            
            {/* ========================================================================= */}
            {/* 1. PRIMARY CV UPLOAD & LIVE PARSING DASHBOARD                              */}
            {/* ========================================================================= */}
            {mode === 'cv-flow' && (
              <motion.div
                key="cv-flow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-[26px] sm:text-[28px] font-black tracking-tight text-slate-900 dark:text-white">
                      {isAr ? "ارفع سيرتك الذاتية (CV)" : "Upload Your CV"}
                    </h1>
                    <p className="mt-1 text-[13.5px] text-slate-500 dark:text-slate-400 font-normal">
                      {isAr 
                        ? "محرك الذكاء الاصطناعي سيقوم بتحليل خبراتك ومهاراتك ومطابقتها مع وظائف السوق."
                        : "Our AI will analyze your experience and skills"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{isAr ? "بياناتك مشفرة ومحمية بسرية تامة" : "Your data is secure and confidential"}</span>
                    </div>
                  </div>
                </div>

                {/* ── No-CV Option Card — prominent, clear, can't be missed ─────────────── */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setMode('quick-profile')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMode('quick-profile'); }}
                  className="group relative overflow-hidden flex items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/50 bg-white/60 dark:bg-white/[0.03] hover:bg-blue-50/40 dark:hover:bg-blue-950/20 px-5 py-4 transition-all duration-200 cursor-pointer select-none"
                  aria-label={isAr ? "ليس لدي سيرة ذاتية — أنشئ ملفك يدوياً" : "Don't have a CV — fill your profile manually"}
                >
                  {/* Subtle gradient glow on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent" />

                  <div className="flex items-center gap-3.5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-all duration-200">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {isAr ? "ليس لدي سيرة ذاتية بعد" : "Don't have a CV yet?"}
                      </p>
                      <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                        {isAr ? "أنشئ ملفك المهني يدوياً في 3 خطوات سريعة — بدون CV" : "Build your profile manually in 3 quick steps — no CV needed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-slate-500 dark:text-slate-400 text-[12.5px] font-bold transition-all duration-200">
                    <span>{isAr ? "اضغط هنا" : "Get started"}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </div>
                </div>

                {/* Top Main Grid: Left Dropzone | Right Live Parsing Status */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Dropzone */}
                  <div className="lg:col-span-5 flex flex-col">
                    <Dropzone
                      file={file}
                      status={status}
                      progress={progress}
                      onFile={uploadFile}
                      onRemove={removeFile}
                    />
                  </div>

                  {/* Right Column: Live Parsing Status Card */}
                  <div className="lg:col-span-7 flex flex-col">
                    {fileSelected ? (
                      <ParsingStatus
                        cv={parsedCv || {
                          fullName: file?.name?.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') || '...',
                          currentTitle: targetRoleTitle,
                          email: '',
                          phone: '',
                          location: '',
                          summary: '',
                          skills: [],
                          detectedSkills: []
                        } as any}
                        status={status}
                        progress={progress}
                        checksRevealed={checksRevealed}
                      />
                    ) : (
                      /* Clean Empty / Waiting State before user uploads their CV */
                      <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0B1120]/70 p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                          <FileSearch className="w-8 h-8" />
                        </div>
                        <div className="space-y-1.5 max-w-md">
                          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">
                            {isAr ? "في انتظار رفع السيرة الذاتية للبدء" : "Waiting for CV upload..."}
                          </h3>
                          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {isAr 
                              ? "بمجرد سحب أو اختيار ملفك، سيبدأ محرك عواطلي بالمسح الفوري واستخراج مسمياتك وخبراتك ومهاراتك الحقيقية بالكامل دون أي نقص."
                              : "Once uploaded, 3WATLY will scan and extract all your genuine experiences, education, and skills in real time."}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-2 max-w-sm w-full">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11.5px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            <span>{isAr ? "الخبرات" : "Experience"}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11.5px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{isAr ? "المهارات" : "Skills"}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-[11.5px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isAr ? "فحص ATS" : "ATS Score"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Row: Extracted Skills — shown as soon as file selected */}
                {fileSelected && (
                  <div className="pt-2">
                    <ExtractedSkills
                      cv={parsedCv || { skills: [], detectedSkills: [] } as any}
                      addedCount={skillsAdded || (parsedCv?.skills?.length || 0)}
                      complete={complete}
                    />
                  </div>
                )}

                {/* Bottom Navigation Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => router.push('/onboarding/career-path')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[13.5px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {isAr ? "الرجوع" : "Back"}
                  </button>

                  <button
                    type="button"
                    disabled={!file || status === 'uploading' || status === 'parsing'}
                    onClick={() => router.push('/onboarding/profile-insights')}
                    className={`px-8 py-3 rounded-xl text-white text-[14px] font-bold shadow-md flex items-center gap-2 transition-all ${
                      file && status === 'complete'
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25 cursor-pointer active:scale-98'
                        : 'bg-slate-400 dark:bg-slate-700 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span>{isAr ? "متابعة لمؤشرات الملف" : "Continue to Profile Insights"}</span>
                    <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* 2. QUICK PROFILE QUESTIONNAIRE (For users without CV)                    */}
            {/* ========================================================================= */}
            {mode === 'quick-profile' && (
              <motion.div
                key="quick-profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 max-w-4xl mx-auto w-full"
              >
                {/* Back to CV Flow */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMode('cv-flow')}
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                    <span>{isAr ? "العودة لرفع السيرة الذاتية (CV)" : "Back to CV Upload"}</span>
                  </button>
                </div>

                {/* Header */}
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold border border-emerald-100 dark:border-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? "بناء سريع للملف المهني (3 أسئلة بسيطة)" : "Quick Profile Setup (3 Simple Questions)"}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {isAr ? "دعنا نتعرف عليك لبناء ملفك المهني 👋" : "Let's build your career profile 👋"}
                  </h1>
                  <p className="text-[13.5px] text-slate-500 dark:text-slate-400">
                    {isAr 
                      ? "أجب على هذه الأسئلة السريعة ليتمكن محرك عواطلي من حساب مؤشرات التوافق وفرصك في السوق."
                      : "Answer these quick questions so 3WATLY can personalize your market insights."}
                  </p>
                </div>

                {/* 3 Interactive Questionnaire Cards */}
                <div className="space-y-5">
                  
                  {/* Question 1: Career Stage */}
                  <div className="rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 sm:p-8 space-y-4 shadow-xs">
                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-[12px] font-bold flex items-center justify-center">1</span>
                      <span>{isAr ? "أين أنت حالياً في مسارك المهني؟" : "Where are you currently in your career?"}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: 'student', title: isAr ? 'طالب جامعي' : 'Student', sub: isAr ? 'أدرس حالياً بالجامعة' : 'Currently studying' },
                        { id: 'fresh-grad', title: isAr ? 'خريج جديد' : 'Fresh Graduate', sub: isAr ? 'أبحث عن أول وظيفة' : 'Seeking first job' },
                        { id: 'working', title: isAr ? 'على رأس العمل' : 'Working Professional', sub: isAr ? 'أريد تطوير مساري' : 'Looking to grow' },
                        { id: 'switcher', title: isAr ? 'تغيير مجال (Career Shift)' : 'Career Switcher', sub: isAr ? 'أنتقل لمجال جديد' : 'Shifting careers' }
                      ].map((item) => {
                        const isSelected = careerStage === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setCareerStage(item.id as any)}
                            className={`p-4 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-xs"
                                : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] hover:border-slate-300"
                            }`}
                          >
                            <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question 2: Skills & Experience */}
                  <div className="rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 sm:p-8 space-y-5 shadow-xs">
                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-[12px] font-bold flex items-center justify-center">2</span>
                      <span>{isAr ? "سنوات الخبرة والمهارات التي تمتلكها أو ترغب بتعلمها:" : "Years of experience & your key skills:"}</span>
                    </h3>

                    {/* Experience Level selector */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['0-1 Years', '1-2 Years', '3-5 Years', '5+ Years'].map((exp) => (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => setExpYears(exp)}
                          className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
                            expYears === exp
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>

                    {/* Skill Tags Toggle */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <p className="text-[12.5px] font-semibold text-slate-600 dark:text-slate-400">
                        {isAr ? "اضغط لاختيار المهارات المناسبة لمجالك:" : "Click to select skills related to your field:"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedSkills.map((skill) => {
                          const active = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleToggleSkill(skill)}
                              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                active
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                              }`}
                            >
                              {active ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom skill add */}
                      <div className="pt-2 flex items-center gap-2 max-w-sm">
                        <input
                          type="text"
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          onKeyDown={handleAddCustomSkill}
                          placeholder={isAr ? "أضف مهارة أخرى واضغط Enter..." : "Add another skill and press Enter..."}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] text-[12px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Question 3: Career Goal */}
                  <div className="rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 sm:p-8 space-y-4 shadow-xs">
                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-[12px] font-bold flex items-center justify-center">3</span>
                      <span>{isAr ? "ما هو هدفك الأساسي في هذه المرحلة؟" : "What is your primary goal right now?"}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'first-job', title: isAr ? 'الحصول على وظيفة' : 'Get Hired', sub: isAr ? 'فرص تناسب مستواي الحالي' : 'Find relevant job matches' },
                        { id: 'upskill', title: isAr ? 'سد فجوة المهارات' : 'Close Skill Gaps', sub: isAr ? 'تحديد النواقص وخطة التعلم' : 'Learn in-demand tech' },
                        { id: 'market-demand', title: isAr ? 'استكشاف الرواتب والطلب' : 'Explore Market', sub: isAr ? 'معرفة مؤشرات وأرقام السوق' : 'Analyze salary & trends' }
                      ].map((item) => {
                        const isSelected = careerGoal === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setCareerGoal(item.id as any)}
                            className={`p-4 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-xs"
                                : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] hover:border-slate-300"
                            }`}
                          >
                            <p className="text-[13.5px] font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Bottom CTA Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMode('cv-flow')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[13.5px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {isAr ? "الرجوع" : "Back"}
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishQuickProfile}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-bold shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAr ? "توليد مؤشرات ملفي المهني" : "Generate My Insights"}</span>
                    <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </StepShell>
    </RequireOnboarding>
  );
}
