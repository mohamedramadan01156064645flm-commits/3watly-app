"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, Mail, Database, UserCheck, Key, RefreshCw } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { isAr, t } = useLanguage();

  const sections = [
    {
      icon: Database,
      heading: isAr ? "1. المعلومات والبيانات التي نجمعها" : "1. Information We Collect",
      content: isAr
        ? "تقوم منصة عواطلي (3WATLY) بجمع واستخدام المعلومات الضرورية لتقديم خدمات التوجيه المهني ومطابقة الوظائف الذكية:"
        : "3WATLY collects and processes the following information to provide AI-powered career matching and market intelligence:",
      points: isAr
        ? [
            "بيانات الحساب وتوثيق الهوية: الاسم الكامل، عنوان البريد الإلكتروني، الصورة الشخصية، ومعرّفات التوثيق الآمن عند التسجيل عبر LinkedIn أو Google OAuth.",
            "وثائق وبيانات السيرة الذاتية (CV): المهارات التقنية، الخبرات العملية السابقة، الدرجات العلمية، والمشاريع البرمجية التي تقوم برفعها أو إدخالها يدوياً.",
            "تفضيلات المسار الوظيفي: المسمى الوظيفي المستهدف، نطاقات الرواتب المفضلة، والموقع الجغرافي للعمل (مكتبي، هجين، أو عن بُعد).",
            "بيانات الاستخدام والمؤشرات الفنية: سجلات التفاعل مع الوظائف، البحث عن الكورسات، ونوع المتصفح لتحسين جودة وأمان المنصة."
          ]
        : [
            "Account & Authentication Data: Full name, email address, profile picture, and verified OAuth credentials via LinkedIn or Google.",
            "Career & Resume Documents (CV): Technical skills, work history, educational background, certifications, and projects uploaded for ATS analysis.",
            "Target Career Preferences: Desired job titles, expected salary ranges, and preferred work models (on-site, hybrid, remote).",
            "Telemetry & Performance Analytics: Platform interactions, job query signals, and device metadata to enhance security and recommendation accuracy."
          ]
    },
    {
      icon: Key,
      heading: isAr ? "2. استخدام التوثيق عبر الأطراف الثالثة (OAuth - LinkedIn & Google)" : "2. Third-Party Authentication (OAuth)",
      content: isAr
        ? "تتيح المنصة تسجيل الدخول السريع والآمن عبر بروتوكولات OAuth 2.0 المعتمدة:"
        : "Our platform provides streamlined and secure authentication utilizing standard OAuth 2.0 protocols:",
      points: isAr
        ? [
            "نطلب فقط الصلاحيات الأساسية المعتمدة (openid, profile, email) للتحقق من هوية صاحب الحساب وتأكيد ملكية البريد.",
            "لا نقوم أبداً بالوصول إلى كلمات المرور الخاصة بك أو نشر أي محتوى على حساباتك في LinkedIn أو Google نيابةً عنك.",
            "يمكنك إلغاء ربط الحساب أو سحب صلاحيات الوصول في أي وقت مباشرة من إعدادات حسابك في LinkedIn أو Google."
          ]
        : [
            "We only request minimal necessary scopes (openid, profile, email) to authenticate your identity and verify account ownership.",
            "We never access your private credentials or post on your behalf across connected LinkedIn or Google profiles.",
            "You can revoke OAuth permissions at any time directly through your LinkedIn or Google security settings."
          ]
    },
    {
      icon: ShieldCheck,
      heading: isAr ? "3. كيف نستخدم ونحمي بياناتك؟" : "3. Data Usage & Bank-Grade Security",
      content: isAr
        ? "نحن نطبق أعلى المعايير القياسية العالمية لحماية سرية وأمان البيانات المخزنة:"
        : "We implement international security benchmarks to safeguard your information across storage and transit:",
      points: isAr
        ? [
            "تشفير كامل أثناء النقل عبر بروتوكول (TLS 1.3) وتشفير البيانات في قواعد البيانات باستخدام خوارزمية (AES-256).",
            "معالجة السيرة الذاتية عبر نماذج ذكاء اصطناعي آمنة ومغلقة بهدف استخراج المهارات وحساب التوافق مع السوق دون تدريب نماذج عامة على بياناتك.",
            "التزام تام بعدم بيع، تأجير، أو مشاركة بياناتك الشخصية مع أي شبكات إعلانية أو وسطاء تجاريين."
          ]
        : [
            "End-to-end encryption in transit (TLS 1.3) and robust database encryption at rest using AES-256.",
            "CV parsing and skill-matching operate within private, enterprise-grade AI sandboxes without sharing proprietary data for model training.",
            "Strict policy: We do not sell, rent, monetize, or disclose your personal data to third-party advertisers."
          ]
    },
    {
      icon: UserCheck,
      heading: isAr ? "4. حقوق المستخدم والتحكم الكامل بالبيانات (GDPR & Data Protection)" : "4. User Rights & Data Control",
      content: isAr
        ? "يتمتع كل مستخدم لمنصة عواطلي بكامل السيطرة على بياناته وفقاً للوائح حماية البيانات المعتمدة:"
        : "Every 3WATLY user retains complete sovereignty over their personal and career data in compliance with data privacy regulations:",
      points: isAr
        ? [
            "حق الوصول والتصدير: يمكنك الاطلاع على جميع المهارات والبيانات المستخرجة وتنزيل تقاريرك في أي وقت.",
            "حق التعديل والاستبدال: يمكنك تعديل مسارك الوظيفي المستهدف أو إعادة رفع وتحديث سيرتك الذاتية متى شئت.",
            "حق الحذف النهائي (Right to be Forgotten): يمكنك حذف حسابك وجميع السجلات والملفات المرتبطة به بشكل دائم وغير قابل للاسترجاع بنقرة واحدة من صفحة الإعدادات."
          ]
        : [
            "Right of Access & Portability: Review all extracted skills, gap scores, and download career intelligence reports on demand.",
            "Right to Rectification: Modify career goals, target roles, or replace your resume whenever your experience updates.",
            "Right to Erasure (Forget Me): Request permanent deletion of your account, parsed CV data, and database records instantly from settings."
          ]
    },
    {
      icon: RefreshCw,
      heading: isAr ? "5. ملفات تعريف الارتباط والتخزين المحلي" : "5. Cookies & Local Storage",
      content: isAr
        ? "تستخدم المنصة ملفات تعريف الارتباط الضرورية فقط للأمان وحفظ تفضيلات الجلسة:"
        : "We utilize strictly essential cookies and local tokens to maintain authenticated sessions and UI preferences:",
      points: isAr
        ? [
            "ملفات الجلسة الآمنة (Auth Session Tokens) للتحقق من هوية تسجيل الدخول ومنع هجمات CSRF.",
            "حفظ تفضيلات المظهر (الوضع الليلي / النهاري) واللغة المختارة (العربية / الإنجليزية).",
            "لا نستخدم ملفات تتبع إعلانية متطفلة أو كوكيز تتبع عبر المواقع (Cross-Site Tracking)."
          ]
        : [
            "Secure session tokens to authenticate user requests and safeguard against CSRF attacks.",
            "Local storage for interface preferences including language selection (AR/EN) and theme mode (Dark/Light).",
            "Zero intrusive third-party ad tracking or cross-site behavioral cookies."
          ]
    },
    {
      icon: Mail,
      heading: isAr ? "6. التواصل ومسؤول حماية البيانات" : "6. Contact & Data Protection Inquiries",
      content: isAr
        ? "إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية أو ترغب في ممارسة حقوقك المتعلقة ببياناتك، يمكنك التواصل معنا مباشرة عبر البريد الإلكتروني الرسمي:"
        : "If you have questions regarding this Privacy Policy or wish to submit a data protection inquiry, contact our team directly at:",
      points: isAr
        ? [
            "البريد الإلكتروني للدعم والخصوصية: privacy@3watly.com",
            "المنصة: عواطلي - 3WATLY الذكاء الاصطناعي لسوق العمل",
            "تاريخ التحديث الأخير: سبتمبر 2026"
          ]
        : [
            "Official Privacy & Support Email: privacy@3watly.com",
            "Entity: 3WATLY AI Career Intelligence Platform",
            "Effective Date: September 2026"
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
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? "سياسة الخصوصية وحماية البيانات" : "Privacy Policy & Data Protection"}
            </h1>
            <p className="text-[14px] text-slate-300 leading-relaxed font-normal max-w-2xl">
              {isAr
                ? "نحن نلتزم بحماية خصوصيتك وبياناتك المهنية بأعلى معايير التشفير والسرية التامة وفق اللوائح العالمية."
                : "We are committed to safeguarding your personal and career information using bank-grade encryption and rigorous compliance standards."}
            </p>
            <div className="inline-flex items-center gap-2 pt-1 text-[12px] font-semibold text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? "سارية ومعتمدة لعام 2026 — منصة عواطلي" : "Effective for 2026 — 3WATLY Platform"}</span>
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
