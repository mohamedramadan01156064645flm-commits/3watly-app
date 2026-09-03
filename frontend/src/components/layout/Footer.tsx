"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { LegalModal, LegalModalType } from '@/components/legal/LegalModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export function Footer() {
  const { isAr, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Legal Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>('terms');

  const openLegalModal = (type: LegalModalType, e: React.MouseEvent) => {
    e.preventDefault();
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error(isAr ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success(isAr ? "تم الاشتراك في النشرة البريدية بنجاح!" : "Subscribed to newsletter successfully!");
    setEmail('');
  };

  return (
    <footer className="w-full bg-white dark:bg-[#070B14] border-t border-slate-100/90 dark:border-white/5 pt-12 pb-8 px-6 sm:px-10 lg:px-16 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      
      {/* Interactive Bilingual Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        type={legalModalType}
        onClose={() => setLegalModalOpen(false)}
      />

      <div className="max-w-[1400px] mx-auto">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 items-start">
          
          {/* 1. Brand Info Column */}
          <div className="lg:col-span-2 space-y-3 lg:ltr:pr-8 lg:rtl:pl-8 lg:ltr:border-r lg:rtl:border-l lg:border-slate-100 dark:lg:border-white/5">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Logo size="md" />
            </Link>

            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[320px] font-normal">
              {isAr 
                ? "منصة تحليلات وتوجيه سوق العمل والتطوير المهني الأولى في مصر، مبنية على لغة الأرقام والذكاء الاصطناعي."
                : "Egypt's leading career intelligence platform helping you make smarter career decisions with real data and AI."}
            </p>
          </div>

          {/* 2. About Column */}
          <div className="space-y-3">
            <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white">
              {isAr ? "عن عواطلي" : "About 3WATLY"}
            </h4>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:ltr:translate-x-1 hover:rtl:-translate-x-1 transition-all duration-200"
                >
                  {isAr ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:ltr:translate-x-1 hover:rtl:-translate-x-1 transition-all duration-200"
                >
                  {isAr ? "تسجيل الدخول" : "Log In"}
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:ltr:translate-x-1 hover:rtl:-translate-x-1 transition-all duration-200"
                >
                  {isAr ? "إنشاء حساب جديد" : "Create Account"}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Legal Column (Opens Modal) */}
          <div className="space-y-3">
            <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white">
              {isAr ? "الشروط والأمان" : "Legal & Privacy"}
            </h4>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <button
                  type="button"
                  onClick={(e) => openLegalModal('terms', e)}
                  className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:ltr:translate-x-1 hover:rtl:-translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  {isAr ? "شروط الاستخدام" : "Terms of Service"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => openLegalModal('privacy', e)}
                  className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:ltr:translate-x-1 hover:rtl:-translate-x-1 transition-all duration-200 cursor-pointer"
                >
                  {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Stay Updated & 4 Official Social Icons */}
          <div className="space-y-3">
            <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white">
              {isAr ? "ابقَ على اطلاع" : "Stay Updated"}
            </h4>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
              {isAr ? "احصل على أحدث تقارير ومؤشرات سوق العمل أسبوعياً." : "Get the latest career insights and job market trends."}
            </p>
            
            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 pt-0.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1322] text-[12px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                aria-label="Submit email"
                className="h-9 w-9 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-sm shadow-blue-600/20 cursor-pointer active:scale-95"
              >
                {subscribed ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <ArrowRight className={`w-4 h-4 transition-transform ${isAr ? "rotate-180" : ""}`} />
                )}
              </button>
            </form>

            {/* 4 Official Social Icons (Facebook, Insta, TikTok, YouTube) */}
            <div className="flex items-center gap-2.5 pt-2">
              
              {/* 1. Facebook (#1877F2) */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                title="Facebook"
                className="group relative flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-100/90 dark:bg-[#0E1626] text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-[#1877F2] dark:hover:bg-[#1877F2] hover:border-[#1877F2] dark:hover:border-[#1877F2] hover:shadow-[0_4px_16px_rgba(24,119,242,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-115" viewBox="0 0 24 24">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                </svg>
              </a>

              {/* 2. Instagram (Official Gradient) */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                title="Instagram"
                className="group relative flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-100/90 dark:bg-[#0E1626] text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] dark:hover:bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] hover:border-transparent dark:hover:border-transparent hover:shadow-[0_4px_16px_rgba(220,39,67,0.45)] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-115" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* 3. TikTok (#000000) */}
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok"
                title="TikTok"
                className="group relative flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-100/90 dark:bg-[#0E1626] text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-black dark:hover:bg-black hover:border-black dark:hover:border-black hover:shadow-[0_4px_16px_rgba(0,242,254,0.3),0_4px_16px_rgba(254,44,85,0.3)] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-115" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.14 15.68a6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.86-4.49V8.72a8.28 8.28 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z"/>
                </svg>
              </a>

              {/* 4. YouTube (#FF0000) */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                title="YouTube"
                className="group relative flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-100/90 dark:bg-[#0E1626] text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-[#FF0000] dark:hover:bg-[#FF0000] hover:border-[#FF0000] dark:hover:border-[#FF0000] hover:shadow-[0_4px_16px_rgba(255,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-115" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-100/90 dark:border-white/5 text-center text-[12px] text-slate-400 dark:text-slate-500 font-medium">
          {t('footerRights')}
        </div>

      </div>
    </footer>
  );
}
