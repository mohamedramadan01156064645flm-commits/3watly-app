"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { isAr, t } = useLanguage();

  const sections = [
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
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#060913] text-[#0F172A] dark:text-white flex flex-col justify-between">
      
      {/* Top Navbar Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-6 space-y-8 flex-1 w-full">
        
        {/* Page Hero Card */}
        <div className="rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-8 sm:p-10 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isAr ? "سياسة الخصوصية وأمان البيانات" : "Privacy Policy & Data Security"}
          </h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            {isAr
              ? "نحن نلتزم بحماية خصوصيتك وبياناتك المهنية بأعلى معايير التشفير والسرية التامة."
              : "We are committed to safeguarding your personal and career data with bank-grade encryption and privacy controls."}
          </p>
        </div>

        {/* Sections */}
        <div className="rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-8 sm:p-10 shadow-xs space-y-8">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-[16px] font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
                <span>{sec.heading}</span>
              </h2>
              <ul className="space-y-2.5 ltr:pl-5 rtl:pr-5">
                {sec.points.map((p, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-[12.5px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? "تشفير كامل TLS 1.3 & AES-256 لجميع البيانات" : "End-to-End TLS 1.3 & AES-256 Encryption"}</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 dark:border-white/5 text-center text-[12px] text-slate-400 dark:text-slate-500 font-medium">
        {t('footerRights')}
      </footer>
    </div>
  );
}
