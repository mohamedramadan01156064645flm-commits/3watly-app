"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ShieldCheck, CheckCircle2, Scale, AlertTriangle, HelpCircle } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { isAr, t } = useLanguage();

  const sections = [
    {
      icon: CheckCircle2,
      heading: isAr ? "1. قبول الشروط ونطاق الخدمة" : "1. Acceptance of Terms & Service Scope",
      content: isAr
        ? "باستخدامك لمنصة عواطلي (3WATLY) أو تسجيل الدخول إليها عبر أي من وسائل التوثيق المعتمدة، فإنك توافق على الالتزام الكامل بهذه الشروط:"
        : "By accessing or using 3WATLY through any verified authentication channel, you agree to be bound by these Terms of Service:",
      points: isAr
        ? [
            "تقدم المنصة خدمات ذكية لتحليل السير الذاتية (ATS Diagnostics)، كشف فجوات المهارات (Skill Gap Analysis)، والتوصية بالوظائف ومصادر التعلم.",
            "الخدمات مخصصة للاستخدام الفردي والمهني لتطوير مسارك المهني والتقديم للفرص الوظيفية المتاحة في السوق.",
            "تحتفظ المنصة بالحق في تحديث وتطوير مميزاتها وخوارزمياتها التقييمية دورياً لضمان أعلى مستويات الدقة والموثوقية."
          ]
        : [
            "3WATLY delivers AI-powered career intelligence, resume diagnostics (ATS parsing), skill gap insights, and real-time job matching.",
            "Services are designated for individual career enhancement, skill building, and professional job search purposes.",
            "We reserve the right to refine algorithms and feature capabilities periodically to reflect changing market dynamics."
          ]
    },
    {
      icon: Scale,
      heading: isAr ? "2. التزامات المستخدم وسلوك الحساب" : "2. User Obligations & Conduct",
      content: isAr
        ? "يلتزم المستخدم بالاستخدام المسؤول والنزيه لخدمات المنصة وفق الضوابط التالية:"
        : "Users agree to ethical, lawful, and responsible utilization of platform resources:",
      points: isAr
        ? [
            "تقديم معلومات صحيحة ودقيقة تخص مهاراتك وخبراتك وسيرتك الذاتية دون تزييف أو انتحال شخصية.",
            "الحفاظ على سرية حسابك ومعلومات تسجيل الدخول الخاصة بك، وتحمل المسؤولية عن أي نشاط يتم عبر حسابك.",
            "حظر استخدام أي وسائل آلية غير مصرح بها (Scraping/Crawling) لنسخ بيانات الوظائف أو الكورسات أو استغلال واجهات المنصة البرمجية خارج نطاق الاستخدام المصرح به."
          ]
        : [
            "Provide accurate and truthful representation of your career history, qualifications, and portfolio assets.",
            "Maintain confidentiality of your account credentials and assume responsibility for authorized account activities.",
            "Refrain from unauthorized data harvesting, scraping, reverse-engineering, or automated exploitation of platform APIs."
          ]
    },
    {
      icon: ShieldCheck,
      heading: isAr ? "3. حقوق الملكية الفكرية والعلامات التجارية" : "3. Intellectual Property Rights",
      content: isAr
        ? "تخضع جميع عناصر المنصة لحماية حقوق الملكية الفكرية:"
        : "All platform components and proprietary algorithms are protected by intellectual property laws:",
      points: isAr
        ? [
            "جميع التصاميم، العلامات التجارية، خوارزميات التقييم، والشفرات المصدرية ملكية حصرية لمنصة عواطلي (3WATLY).",
            "يحتفظ المستخدم بكامل ملكية حقوق المحتوى الأصلي لسيرته الذاتية وملفاته المهنية المرفوعة.",
            "يُمنع إعادة توزيع أو بيع تقارير المنصة أو استخدام أبحاث السوق لأغراض تجارية دون موافقة كتابية رسمية."
          ]
        : [
            "All UI assets, trademarks, branding, evaluation engines, and source codes remain the exclusive property of 3WATLY.",
            "You retain complete ownership of your personal resume content, uploaded portfolios, and uploaded documents.",
            "Commercial resale, redistribution, or unauthorized mirroring of proprietary reports and insights is strictly prohibited."
          ]
    },
    {
      icon: AlertTriangle,
      heading: isAr ? "4. إخلاء المسؤولية والتوجيه المهني" : "4. Career Guidance & Accuracy Disclaimer",
      content: isAr
        ? "نعمل على تقديم أدق البيانات الاسترشادية وفق أعلى المعايير:"
        : "We strive to deliver top-tier market telemetry and algorithmic guidance:",
      points: isAr
        ? [
            "تقييمات التوافق ومؤشرات الرواتب تقدم كأدوات استرشادية مبنية على مؤشرات السوق المصري والإقليمي ولا تمثل تعهداً أو وعداً ملزماً براتب محدد من أصحاب العمل.",
            "قرارات التوظيف النهائية واختيار المرشحين تخضع كلياً لتقدير ومسؤولية مسؤولي التوظيف والشركات المستقلة المعلنة للوظائف.",
            "لا تتحمل المنصة أي مسؤولية عن أي قرارات مهنية أو مالية يتم اتخاذها دون التحقق المباشر من شروط عروض العمل."
          ]
        : [
            "Compatibility scores and salary benchmarks represent indicative intelligence based on real-time market data, not binding job offers.",
            "Hiring decisions and employment contracts remain the sole discretion and responsibility of independent hiring entities.",
            "3WATLY disclaims liability for individual career or financial commitments undertaken without direct employer verification."
          ]
    },
    {
      icon: HelpCircle,
      heading: isAr ? "5. القانون الواجب التطبيق وحل النزاعات" : "5. Governing Law & Dispute Resolution",
      content: isAr
        ? "تخضع هذه الشروط وتفسر وفقاً للقوانين واللوائح المعمول بها:"
        : "These terms and conditions are governed by and construed in accordance with applicable legal frameworks:",
      points: isAr
        ? [
            "تخضع هذه الشروط لقوانين جمهورية مصر العربية والمعايير الدولية لحماية البيانات والمعاملات الإلكترونية.",
            "في حال وجود أي نزاع، يتم السعي أولاً لحله ودياً عبر التواصل المباشر مع فريق الدعم القانوني للمنصة.",
            "لأي استفسارات قانونية أو بلاغات انتهاك: legal@3watly.com"
          ]
        : [
            "Governed by Egyptian electronic commerce regulations and international digital data protection standards.",
            "Parties agree to seek amicable resolution through direct communication with our legal support department prior to formal claims.",
            "Legal Inquiries & Inquiries Contact: legal@3watly.com"
          ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#040816] text-white flex flex-col justify-between selection:bg-cyan-500/30">
      
      {/* Top Navbar Header */}
      <header className="w-full border-b border-white/10 bg-[#070D1E]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[13px] font-bold hover:bg-cyan-500/20 transition-colors"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 sm:py-14 px-5 sm:px-6 space-y-8 flex-1 w-full">
        
        {/* Page Hero Card */}
        <div className="rounded-[28px] border border-cyan-500/20 bg-gradient-to-br from-[#0B132B] to-[#070D1E] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? "شروط الاستخدام والخدمة" : "Terms of Service"}
            </h1>
            <p className="text-[14px] text-slate-300 leading-relaxed font-normal max-w-2xl">
              {isAr
                ? "يرجى قراءة شروط استخدام منصة عواطلي بعناية قبل البدء في استخدام الخدمات الذكية والتوجيه المهني."
                : "Please review our terms of service and community guidelines before utilizing 3WATLY AI career tools."}
            </p>
            <div className="inline-flex items-center gap-2 pt-1 text-[12px] font-semibold text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? "اتفاقية الاستخدام الرسمية 2026 — منصة عواطلي" : "Official Agreement 2026 — 3WATLY Platform"}</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="rounded-[28px] border border-white/10 bg-[#070D1E]/95 p-7 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xl">
          {sections.map((sec, idx) => {
            const SecIcon = sec.icon;
            return (
              <div key={idx} className="space-y-3.5 border-b border-white/5 pb-7 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <SecIcon className="w-4 h-4" />
                  </div>
                  <h2 className="text-[16px] font-black text-white">
                    {sec.heading}
                  </h2>
                </div>

                <p className="text-[13px] text-slate-300 leading-relaxed">
                  {sec.content}
                </p>

                <ul className="space-y-2.5 ltr:pl-4 rtl:pr-4">
                  {sec.points.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-[13px] text-slate-300/90 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-xs shadow-cyan-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-[12px] text-slate-400 font-medium">
        {t('footerRights')} • {isAr ? "جميع الحقوق محفوظة لمنصة عواطلي 2026" : "All rights reserved 3WATLY 2026"}
      </footer>
    </div>
  );
}
