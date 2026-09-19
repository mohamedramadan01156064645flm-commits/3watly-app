"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Play, 
  Check, 
  ShieldCheck,
  Briefcase,
  BarChart3,
  FileText,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { FeatureStrip } from "@/components/landing/FeatureStrip";
import { TechMarquee } from "@/components/landing/TechMarquee";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MarketInsights } from "@/components/landing/MarketInsights";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { isAr, t } = useLanguage();
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isClickScrollingRef = useRef(false);



  const navigationLinks = isAr
    ? [
        { label: "المميزات والوظائف", href: "#features", id: "features", icon: <Briefcase className="w-4 h-4 text-slate-500" /> },
        { label: "كيف تعمل المنصة", href: "#how-it-works", id: "how-it-works", icon: <FileText className="w-4 h-4 text-slate-500" /> },
        { label: "مؤشرات السوق", href: "#insights", id: "insights", icon: <BarChart3 className="w-4 h-4 text-slate-500" /> },
      ]
    : [
        { label: "Features", href: "#features", id: "features", icon: <Briefcase className="w-4 h-4 text-slate-500" /> },
        { label: "How It Works", href: "#how-it-works", id: "how-it-works", icon: <FileText className="w-4 h-4 text-slate-500" /> },
        { label: "Market Insights", href: "#insights", id: "insights", icon: <BarChart3 className="w-4 h-4 text-slate-500" /> },
      ];

  // Scroll detection & Section Tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isClickScrollingRef.current) return;

      // When at the top Hero section, no navbar link is active
      if (window.scrollY < 300) {
        setActiveNav("");
        return;
      }

      const featuresEl = document.getElementById("features");
      const howItWorksEl = document.getElementById("how-it-works");
      const insightsEl = document.getElementById("insights");

      const scrollPos = window.scrollY + 280;

      // From Market Insights section all the way down through Final CTA and Footer, keep "insights" active
      if (insightsEl && scrollPos >= insightsEl.offsetTop) {
        setActiveNav("insights");
      } else if (howItWorksEl && scrollPos >= howItWorksEl.offsetTop) {
        setActiveNav("how-it-works");
      } else if (featuresEl && scrollPos >= featuresEl.offsetTop) {
        setActiveNav("features");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    isClickScrollingRef.current = true;
    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#040816] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* Absolute top anchor */}
      <div id="page-top" className="absolute top-0 left-0 h-0 w-0 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. FIXED FLOATING NAVBAR                                                 */}
      {/* ========================================================================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-[#040816]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-cyan-500/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
            : "bg-white/40 dark:bg-transparent backdrop-blur-sm border-b border-transparent dark:border-white/[0.05]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          
          {/* Brand Logo with 3D Mark and Dynamic Text */}
          <Link href="/" className="transition-transform duration-200 hover:scale-105">
            <Logo size="md" />
          </Link>

          {/* Navigation Links with Icons */}
          <nav className="hidden md:flex items-center gap-6 text-[13.5px] font-semibold text-slate-600 dark:text-slate-300">
            {navigationLinks.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex items-center gap-2 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "text-cyan-600 dark:text-cyan-400 font-bold bg-blue-50/80 dark:bg-cyan-950/40 shadow-2xs" 
                      : "hover:text-cyan-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="opacity-80">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 inset-x-3 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Switcher - tablet/desktop */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />

            {/* Log In - desktop only */}
            <Link
              href="/login"
              className="hidden md:block text-[13px] sm:text-[14px] font-bold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              {isAr ? "تسجيل الدخول" : "Log In"}
            </Link>

            {/* Sign Up Free - Prominent Navbar CTA */}
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#0052E0] hover:from-[#0052E0] hover:to-[#0040C0] text-white text-[12px] sm:text-[13px] font-bold shadow-md shadow-blue-600/30 hover:shadow-blue-600/45 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>{isAr ? "ابدأ الآن" : "Get Started"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer ml-0.5"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#040816]/95 backdrop-blur-2xl px-5 py-4 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5 sm:hidden">
                <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  {isAr ? "اللغة" : "Language"}
                </span>
                <LanguageToggle />
              </div>

              <nav className="flex flex-col space-y-1">
                {navigationLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      handleNavClick(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-slate-700 dark:text-slate-200 font-semibold text-[14px] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </a>
                ))}
              </nav>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-center font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  {isAr ? "تسجيل الدخول" : "Log In"}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-center shadow-md shadow-blue-600/20 transition-colors"
                >
                  {isAr ? "أنشئ حسابك مجاناً" : "Sign Up Free"}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================================= */}
      {/* 2. UNIFIED HERO AREA (Matching 1920x1080 Viewport & Mobile Responsive)    */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden pt-16 sm:pt-20 lg:pt-20 pb-4 sm:pb-6 lg:pb-6 px-4 sm:px-6 lg:px-6 xl:px-8 min-h-screen lg:min-h-[calc(100vh-4rem)] lg:max-h-[1000px] flex flex-col justify-between bg-white dark:bg-[#040816]">
        {/* Full Section Background */}
        <HeroBackdrop />

        <div className="max-w-[1440px] xl:max-w-[1520px] mx-auto relative z-10 w-full flex-1 flex flex-col justify-between">
          
          {/* Main Hero 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-4 sm:pt-6 lg:pt-6 my-auto">
            
            {/* Left/Right Content Column (Headline, Description, CTAs) */}
            <div className="lg:col-span-6 max-w-[620px] flex flex-col items-center text-center lg:items-start rtl:lg:text-right ltr:lg:text-left space-y-4 sm:space-y-5 z-10 mx-auto lg:mx-0">

              {/* Main Headline with Vibrant Gradient on مسارك */}
              <h1 className="text-[28px] sm:text-[38px] lg:text-[44px] xl:text-[48px] font-black leading-[1.2] tracking-tight text-slate-900 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                {isAr ? (
                  <>
                    ابني <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 dark:from-[#00F5A0] dark:via-[#00D2FF] dark:to-[#00A3FF] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,102,255,0.2)] dark:drop-shadow-[0_0_25px_rgba(0,210,255,0.45)]">مسارك</span> المهني،
                    <br />
                    مش مجرد سيرة ذاتية
                  </>
                ) : (
                  <>
                    Build a <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 dark:from-[#00F5A0] dark:via-[#00D2FF] dark:to-[#00A3FF] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,102,255,0.2)] dark:drop-shadow-[0_0_25px_rgba(0,210,255,0.45)]">Career</span>,<br />
                    Not Just a Resume
                  </>
                )}
              </h1>

              {/* Sub-headline */}
              <p className="text-[13.5px] sm:text-[15px] lg:text-[15.5px] text-slate-700 dark:text-slate-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-[1.7] max-w-[580px] font-medium">
                {isAr ? (
                  <>
                    <span className="font-bold text-blue-600 dark:text-[#00D2FF]">عواطلي</span> يحلل سوق العمل المصري، يحدد فجوات مهاراتك، ويطابق خبراتك مع أفضل الفرص المناسبة عشان تطور مسارك المهني بثقة.
                  </>
                ) : (
                  <>
                    <span className="font-bold text-blue-600 dark:text-[#00D2FF]">3WATLY</span> analyzes the Egyptian job market, identifies your skill gaps, and matches your experience with the best opportunities to grow your career with confidence.
                  </>
                )}
              </p>

              {/* CTA Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 pt-1 w-full sm:w-auto">
                {/* Primary Button — Always navigates to sign up */}
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-[16px] sm:rounded-[18px] bg-gradient-to-r from-[#0062FF] to-[#0052E0] hover:from-[#0052E0] hover:to-[#0040C0] text-white font-bold text-[14px] sm:text-[15px] shadow-[0_10px_25px_-5px_rgba(0,102,255,0.5),0_0_15px_rgba(0,102,255,0.25)] hover:shadow-[0_14px_30px_-5px_rgba(0,102,255,0.65)] hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                >
                  <span>
                    {isAr ? "ابدأ الآن — مجاناً" : "Get Started — Free"}
                  </span>
                  <ArrowRight className={`w-4 h-4 text-white transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                </Link>

                {/* Secondary Button */}
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-[16px] sm:rounded-[18px] border border-slate-200 dark:border-white/15 bg-white/90 dark:bg-[#060D22]/85 hover:bg-slate-50 dark:hover:bg-[#0A163B] text-slate-800 dark:text-white font-bold text-[13.5px] sm:text-[14.5px] shadow-md shadow-slate-200/80 dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all backdrop-blur-xl cursor-pointer group"
                >
                  <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2563EB] text-white shrink-0 group-hover:scale-110 shadow-[0_0_12px_rgba(37,99,235,0.5)] transition-transform">
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white translate-x-[0.5px]" />
                  </span>
                  <span className="text-slate-800 dark:text-white font-bold">{isAr ? "شاهد كيف تعمل المنصة" : "See How It Works"}</span>
                </a>
              </div>

            </div>

            {/* 3D Visual Cards Column — Space reserved for HD 3D artwork backdrop */}
            <div 
              className="hidden lg:flex lg:col-span-6 w-full min-h-[380px] lg:min-h-[440px] xl:min-h-[480px] items-center justify-center pointer-events-none" 
              aria-hidden="true" 
            />

          </div>

          {/* Key Metrics Feature Strip — fits perfectly at the bottom of the viewport on 1920x1080 */}
          <div className="mt-auto pt-3 sm:pt-4 lg:pt-4 pb-1 sm:pb-2 w-full">
            <FeatureStrip />
          </div>

        </div>
      </section>

      {/* Seamless Glowing Tech Marquee */}
      <TechMarquee />

      {/* ========================================================================= */}
      {/* 3. CORE FEATURES SECTION                                                 */}
      {/* ========================================================================= */}
      <Features />

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS SECTION                                                  */}
      {/* ========================================================================= */}
      <HowItWorks />

      {/* ========================================================================= */}
      {/* 5. LIVE MARKET INSIGHTS SECTION                                          */}
      {/* ========================================================================= */}
      <MarketInsights />

      {/* ========================================================================= */}
      {/* 6. FINAL CALL TO ACTION (CTA)                                            */}
      {/* ========================================================================= */}
      <FinalCta />

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                */}
      {/* ========================================================================= */}
      <Footer />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

    </div>
  );
}
