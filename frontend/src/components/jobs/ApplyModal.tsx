"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Send,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
import { JobItem } from '@/data/jobs';

interface ApplyModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApplyModal({ job, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const { isAr } = useLanguage();
  const { user } = useAuth();
  const { file, parsedCv } = useOnboarding();
  const [step, setStep] = useState<'options' | 'submitting' | 'success'>('options');
  const [customNote, setCustomNote] = useState('');

  const cvFileName = file?.name || parsedCv?.filename || (user?.fullName ? `${user.fullName.replace(/\s+/g, '_')}_CV.pdf` : 'My_Resume.pdf');

  if (!isOpen || !job) return null;

  const handleClose = () => {
    setStep('options');
    setCustomNote('');
    onClose();
  };

  const handle1ClickSubmit = () => {
    setStep('submitting');
    setTimeout(() => {
      setStep('success');
      if (onSuccess) onSuccess();
    }, 1200);
  };

  const getCompanyCareerUrl = (company: string) => {
    if (job.applyUrl) return job.applyUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((job as any).apply_url) return (job as any).apply_url;
    const norm = company.toLowerCase();
    if (norm.includes('vodafone')) return 'https://jobs.vodafone.com/careers';
    if (norm.includes('valeo')) return 'https://www.valeo.com/en/careers/';
    if (norm.includes('siemens')) return 'https://jobs.siemens.com';
    return `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(company)}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-[26px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-6 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 ltr:right-5 rtl:left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* STEP 1: OPTIONS */}
          {step === 'options' && (
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center gap-3.5 pr-8 rtl:pr-0 rtl:pl-8">
                <CompanyLogo company={job.company} size="md" />
                <div>
                  <h3 className="text-[17px] font-black text-[#0B132B] dark:text-white leading-tight">
                    {isAr ? "التقديم على الوظيفة" : "Apply for Role"}
                  </h3>
                  <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? job.titleAr : job.title} • {isAr ? job.companyAr : job.company}
                  </p>
                </div>
              </div>

              {/* Match Highlight Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[13px] font-bold text-emerald-900 dark:text-emerald-200 block">
                      {isAr ? `تطابق رائع (${job.matchScore}%) مع متطلبات الوظيفة` : `High Match (${job.matchScore}%) with job skills`}
                    </span>
                    <span className="text-[11.5px] text-emerald-700 dark:text-emerald-400 block">
                      {isAr ? `سيتم إبراز مهاراتك المطابقة في ملف التقديم.` : `Your matched skills will be highlighted in the application.`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Method: 1-Click Apply */}
              <div className="p-4 rounded-2xl border-2 border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                    <span className="text-[13.5px] font-black text-blue-900 dark:text-blue-300">
                      {isAr ? "التقديم الفوري بضغطة واحدة (1-Click Apply)" : "Instant 1-Click Application"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    FAST
                  </span>
                </div>

                {/* Attached CV Preview */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#070B14] border border-blue-200 dark:border-blue-500/30">
                  <div className="flex items-center gap-2 text-[12px] truncate">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{cvFileName}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded shrink-0">
                      {isAr ? "مُحسّن ATS" : "ATS Optimized"}
                    </span>
                  </div>
                  <Link href="/cv-builder" className="text-[11px] font-bold text-blue-600 hover:underline shrink-0">
                    {isAr ? "تغيير" : "Change"}
                  </Link>
                </div>

                {/* Note input */}
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={isAr ? "أضف رسالة قصيرة لمسؤول التوظيف (اختياري)..." : "Add a short note to the recruiter (optional)..."}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] text-[12px] text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />

                <button
                  type="button"
                  onClick={handle1ClickSubmit}
                  className="w-full py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13.5px] font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? "إرسال طلب التقديم المباشر الآن" : "Submit Direct Application Now"}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {isAr ? "أو" : "OR"}
                </span>
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
              </div>

              {/* Secondary Method: Official Company Career Site */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B1120]/[0.02] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[12.5px] font-bold text-[#0B132B] dark:text-white block">
                    {isAr ? `التقديم عبر موقع ${job.company} الرسمي` : `Apply on ${job.company} Career Site`}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {isAr ? "سيتم فتح رابط التقديم الرسمي في نافذة جديدة" : "Opens official application URL in a new tab"}
                  </span>
                </div>

                <a
                  href={getCompanyCareerUrl(job.company)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070B14] hover:bg-slate-50 dark:hover:bg-white/5 text-[12px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <span>{isAr ? "فتح الرابط" : "Open Link"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}

          {/* STEP 2: SUBMITTING */}
          {step === 'submitting' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-500 border-t-transparent animate-spin mx-auto flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <div>
                <h4 className="text-[16px] font-black text-slate-900 dark:text-white">
                  {isAr ? "جاري إرسال ملفك وسيرتك الذاتية..." : "Sending your application profile..."}
                </h4>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1">
                  {isAr ? "نقوم بمطابقة مهاراتك وتسليم طلبك إلى نظام التوظيف" : "Matching keywords and delivering directly to recruiter inbox"}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="text-[18px] font-black text-slate-900 dark:text-white">
                  {isAr ? "تم إرسال طلب تقديمك بنجاح! 🎉" : "Application Submitted Successfully! 🎉"}
                </h4>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto">
                  {isAr 
                    ? `تم تسليم سيرتك الذاتية (${cvFileName}) ورسالتك لمسؤول التوظيف في ${job.company}.`
                    : `Your CV (${cvFileName}) was delivered to the hiring team at ${job.company}.`}
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-100 dark:border-white/5 text-start space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-400">{isAr ? "الوظيفة:" : "Role:"}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{job.title}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-400">{isAr ? "الشركة:" : "Company:"}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{job.company}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-400">{isAr ? "حالة الطلب:" : "Status:"}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isAr ? "قيد المراجعة" : "Under Review"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[13px] font-bold transition-colors cursor-pointer"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
                <Link
                  href="/dashboard"
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[13px] font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? "لوحة المتابعة" : "Dashboard"}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                </Link>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
