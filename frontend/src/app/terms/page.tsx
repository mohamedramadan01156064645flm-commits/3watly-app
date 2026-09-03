"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ShieldCheck, Lock } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { isAr, t } = useLanguage();

  const sections = [
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
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isAr ? "شروط الاستخدام والأحكام" : "Terms of Service"}
          </h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            {isAr
              ? "يرجى قراءة شروط استخدام منصة عواطلي بعناية قبل البدء في استخدام الخدمات الذكية وتصفح الوظائف."
              : "Please review our terms of service carefully before utilizing 3WATLY career intelligence tools."}
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
            <span>{isAr ? "منظومة معتمدة ومحمية بأعلى معايير التشفير والسرية" : "Officially Protected and Encrypted"}</span>
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
