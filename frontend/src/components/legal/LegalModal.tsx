"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type LegalModalType = 'terms' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  type: LegalModalType;
  onClose: () => void;
}

export function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  const { isAr } = useLanguage();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  useEffect(() => {
    try {
      setAgreedTerms(localStorage.getItem('3watly_agreed_terms') === 'true');
      setAgreedPrivacy(localStorage.getItem('3watly_agreed_privacy') === 'true');
    } catch {}
  }, [isOpen]);

  const handleAgree = () => {
    try {
      localStorage.setItem(`3watly_agreed_${type}`, 'true');
      if (type === 'terms') setAgreedTerms(true);
      else setAgreedPrivacy(true);
    } catch {}
    onClose();
  };

  const isCurrentAgreed = type === 'terms' ? agreedTerms : agreedPrivacy;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const termsContent = {
    title: isAr ? "شروط الاستخدام والأحكام" : "Terms of Service",
    subtitle: isAr
      ? "يرجى قراءة شروط استخدام منصة عواطلي بعناية قبل البدء في استخدام الخدمات الذكية."
      : "Please review the terms of service carefully before using 3WATLY career intelligence services.",
    sections: [
      {
        heading: isAr ? "1. قبول الشروط ونطاق الخدمة" : "1. Acceptance of Terms",
        points: isAr
          ? [
              "باستخدامك لمنصة عواطلي، فإنك توافق على الالتزام بجميع الشروط والسياسات المعلنة.",
              "توفر المنصة أدوات تحليل مهارات ومطابقة وظيفية استرشادية بالذكاء الاصطناعي لمساعدتك في اتخاذ قراراتك المهنية.",
              "يحق للمنصة تحديث الخدمات والمميزات دورياً لتحسين تجربة المستخدم وجودة البيانات."
            ]
          : [
              "By accessing 3WATLY, you agree to comply with all stated terms and community standards.",
              "Our platform provides AI-driven career matching and market guidance to empower your career decisions.",
              "We reserve the right to upgrade and refine services periodically to maintain the highest data quality."
            ]
      },
      {
        heading: isAr ? "2. الحسابات وأمان البيانات" : "2. User Accounts & Security",
        points: isAr
          ? [
              "يلتزم المستخدم بتقديم معلومات دقيقة وصحيحة عند إنشاء الحساب ورفع السيرة الذاتية.",
              "أنت مسؤول بالكامل عن الحفاظ على سرية كلمة المرور والأنشطة المنفذة من خلال حسابك.",
              "يحظر مشاركة بيانات تسجيل الدخول أو محاولة الوصول غير المصرح به للأنظمة وقواعد البيانات."
            ]
          : [
              "Users agree to provide accurate and truthful information during profile setup and CV upload.",
              "You are solely responsible for maintaining the confidentiality of your account credentials.",
              "Unauthorized access attempts, data scraping, or account sharing are strictly prohibited."
            ]
      },
      {
        heading: isAr ? "3. حقوق الملكية الفكرية" : "3. Intellectual Property Rights",
        points: isAr
          ? [
              "جميع العلامات التجارية، الخوارزميات، التصاميم، والمحتوى مملوكة حصرياً لمنصة عواطلي.",
              "يحتفظ المستخدم بحقوق ملكية سيرته الذاتية وبياناته الشخصية المدخلة.",
              "لا يجوز إعادة بيع أو استنساخ تقارير سوق العمل لأغراض تجارية دون موافقة خطية مسبقة."
            ]
          : [
              "All trademarks, algorithms, UI designs, and codebase are the proprietary property of 3WATLY.",
              "You retain full ownership of your personal CV content and career documents.",
              "Commercial resale or automated duplication of market intelligence reports is prohibited."
            ]
      },
      {
        heading: isAr ? "4. إخلاء المسؤولية والتوجيه المهني" : "4. Career Guidance Disclaimer",
        points: isAr
          ? [
              "توصيات الذكاء الاصطناعي ومعدلات التوافق تقدم كأدوات استرشادية مبنية على مؤشرات السوق المتاحة.",
              "القرارات الوظيفية والتقديم للشركات تقع على عاتق المستخدم ومسؤولي التوظيف المستقلين."
            ]
          : [
              "AI matching scores and salary estimates serve as algorithmic guidance based on real-time market data.",
              "Final employment decisions and job application submissions remain the user's independent discretion."
            ]
      }
    ]
  };

  const privacyContent = {
    title: isAr ? "سياسة الخصوصية وأمان البيانات" : "Privacy Policy & Data Security",
    subtitle: isAr
      ? "نحن نلتزم بحماية خصوصيتك وبياناتك المهنية بأعلى معايير التشفير والسرية التامة."
      : "We are committed to safeguarding your personal and career data with bank-grade encryption and privacy controls.",
    sections: [
      {
        heading: isAr ? "1. البيانات التي نجمعها" : "1. Data We Collect",
        points: isAr
          ? [
              "بيانات الحساب الأساسية: الاسم، البريد الإلكتروني، وبيانات التوثيق المشفرة.",
              "بيانات السيرة الذاتية: المهارات، سنوات الخبرة، المسمى الوظيفي، والتعليم المستخرج بهدف المطابقة.",
              "مؤشرات الاستخدام: تفاعلات البحث وتفضيلات الوظائف لتحسين التوصيات المخصصة لك."
            ]
          : [
              "Account details: Full name, email address, and encrypted credentials.",
              "Career documents: Skills, work history, target roles, and education parsed for smart matching.",
              "Usage signals: Search preferences and job interactions to refine personalized recommendations."
            ]
      },
      {
        heading: isAr ? "2. كيف نستخدم ونحمي بياناتك؟" : "2. How We Protect & Process Data",
        points: isAr
          ? [
              "تُشفر جميع البيانات الحساسة أثناء النقل (TLS 1.3) وأثناء التخزين (AES-256).",
              "تُستخدم بيانات السيرة الذاتية فقط لمحرك تحليل فجوة المهارات ومطابقة الوظائف الخاصة بك.",
              "لن نقوم ببيع أو تأجير بياناتك الشخصية لأي أطراف إعلانية أو تجارية تحت أي ظرف."
            ]
          : [
              "All sensitive data is encrypted in transit (TLS 1.3) and at rest (AES-256).",
              "CV contents are parsed solely to calculate your skill gaps and generate relevant job matches.",
              "We never sell, rent, or lease your personal information to third-party ad networks."
            ]
      },
      {
        heading: isAr ? "3. حقوق المستخدم والتحكم الكامل" : "3. User Control & Data Rights",
        points: isAr
          ? [
              "لك الحق الكامل في تعديل، استبدال، أو حذف سيرتك الذاتية في أي وقت من لوحة التحكم.",
              "يمكنك طلب حذف حسابك وبياناتك بالكامل بشكل نهائي ودائم بنقرة واحدة."
            ]
          : [
              "You have the absolute right to view, update, replace, or delete your CV data anytime.",
              "You may request permanent account and data deletion instantly from your settings."
            ]
      }
    ]
  };

  const activeContent = type === 'terms' ? termsContent : privacyContent;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="relative px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              
              {/* Close Button positioned RTL/LTR properly */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-5 ltr:right-5 rtl:left-5 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 shrink-0">
                  {type === 'terms' ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-slate-900 dark:text-white leading-tight">
                    {activeContent.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
                    {activeContent.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              {activeContent.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="font-bold text-[14.5px] text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
                    <span>{section.heading}</span>
                  </h4>
                  <ul className="space-y-2 ltr:pl-4 rtl:pr-4">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                        <span className="text-[13px] text-slate-600 dark:text-slate-300 leading-normal">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? "وثيقة رسمية معتمدة" : "Verified Security Protocol"}</span>
              </div>

              {isCurrentAgreed ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[12.5px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? "تمت الموافقة مسبقاً ✓" : "Already Agreed ✓"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAgree}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-98"
                >
                  {isAr ? "فهمت وموافق ✓" : "I Understand & Agree ✓"}
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
