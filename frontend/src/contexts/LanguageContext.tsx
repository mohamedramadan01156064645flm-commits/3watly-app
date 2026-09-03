"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isAr: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    brandName: "3WATLY",
    brandTagline: "Egyptian Career Intelligence Platform",
    
    // Navbar
    navJobs: "Jobs & Opportunities",
    navMarket: "Egypt Market Insights",
    navCvBuilder: "Smart CV Builder",
    navLogin: "Log In",
    navSignUp: "Sign Up Free",
    
    // Hero
    heroBadge: "The #1 Career Intelligence Platform in Egypt",
    heroTitle1: "Stop Applying Blindly.",
    heroTitle2: "Navigate the Egyptian Job Market with Real Data.",
    heroDesc: "Discover real skill demand in Cairo and Egyptian tech companies, fix your CV gaps, and match with high-fit opportunities.",
    heroCtaPrimary: "Get Started Free",
    heroCtaSecondary: "Explore Market Insights",
    heroTrust: "Trusted by 15,000+ Egyptian professionals & fresh grads",
    
    // Stats
    statJobs: "Active Egyptian Tech Jobs Analyzed",
    statSkills: "Standardized Technical Skills",
    statAccuracy: "ATS Match Precision",
    statRemote: "Remote & Hybrid Tech Ratio",

    // Features Section
    featuresHeading: "Smarter Career Decisions, Backed by Data",
    featuresSubheading: "Everything you need to stand out in the competitive Egyptian job market.",
    
    // Onboarding
    step1Title: "What is your target career path?",
    step1Subtitle: "Choose the role that best matches your career aspirations.",
    step2Title: "Upload Your CV for Instant Analysis",
    step2Subtitle: "Our AI scans your experience and matches it against current Egyptian market standards.",
    step3Title: "Your Profile Insights",
    step3Subtitle: "Here is a breakdown of your strengths and market alignment.",
    step4Title: "Your Recommendations",
    step4Subtitle: "Actionable steps to close your skill gaps and level up.",
    continueBtn: "Continue",
    backBtn: "Back",
    finishBtn: "Complete Onboarding",

    // Auth
    loginTitle: "Welcome Back",
    loginSubtitle: "Log in to continue building your career path.",
    signupTitle: "Create Your Account",
    signupSubtitle: "Join 3WATLY and take control of your career growth.",
    
    // Footer
    footerDesc: "Empowering Egyptian tech talent with real-time labor market intelligence and automated career growth tools.",
    footerRights: "© 2026 3WATLY Platform. All rights reserved.",
  },
  ar: {
    // Brand
    brandName: "عواطلي",
    brandTagline: "منصة تحليلات سوق العمل والتوجيه المهني في مصر",
    
    // Navbar
    navJobs: "الوظائف والفرص",
    navMarket: "مؤشرات السوق المصري",
    navCvBuilder: "صانع السيرة الذاتية الذكي",
    navLogin: "تسجيل الدخول",
    navSignUp: "أنشئ حسابك مجاناً",
    
    // Hero
    heroBadge: "المنصة الأولى لتحليلات وتوجيه سوق العمل في مصر",
    heroTitle1: "بلاش تقدّم على عماك.",
    heroTitle2: "افهم سوق العمل المصري ببيانات وتحليلات حقيقية.",
    heroDesc: "اعرف المهارات المطلوبة فعلياً في شركات التكنولوجيا بمصر، سد فجوات سيرتك الذاتية، وطابق خبرتك مع أفضل الفرص المناسبة ليك.",
    heroCtaPrimary: "ابدأ مجاناً الآن",
    heroCtaSecondary: "استكشف مؤشرات السوق",
    heroTrust: "يثق بنا أكثر من 15,000 متخصص وخريج في مصر",
    
    // Stats
    statJobs: "وظيفة تقنية محلية تم تحليلها",
    statSkills: "مهارة تقنية مصنفة ومعتمدة",
    statAccuracy: "دقة مطابقة أنظمة الـ ATS",
    statRemote: "نسبة وظائف العمل المرن وعن بُعد",

    // Features Section
    featuresHeading: "قرارات مهنية أذكى مبنية على لغة الأرقام",
    featuresSubheading: "كل الأدوات والتحليلات اللي هتحتاجها لتتميز وتنافس بقوة في سوق العمل المصري.",

    // Onboarding
    step1Title: "ما هو مسارك المهني المستهدف؟",
    step1Subtitle: "اختر التخصص الأنسب لطموحاتك وخبراتك الحالية.",
    step2Title: "ارفع سيرتك الذاتية للتحليل الفوري",
    step2Subtitle: "يقوم محرك الذكاء الاصطناعي بفحص خبراتك ومقارنتها بمتطلبات السوق المصري الحية.",
    step3Title: "تحليل مؤشرات ملفك الشخصي",
    step3Subtitle: "نظرة شاملة على نقاط قوتك ومستوى توافقك مع متطلبات الوظائف.",
    step4Title: "توصياتك المهنية المخصصة",
    step4Subtitle: "خطوات عملية لسد فجوات المهارات والارتقاء بمسارك المهني.",
    continueBtn: "متابعة",
    backBtn: "رجوع",
    finishBtn: "إتمام التهيئة والدخول",

    // Auth
    loginTitle: "مرحباً بعودتك",
    loginSubtitle: "سجّل دخولك لمتابعة خطتك المهنية واكتشاف أحدث الفرص.",
    signupTitle: "أنشئ حسابك الجديد",
    signupSubtitle: "انضم لمنصة عواطلي وابدأ رحلة تطوير مسارك المهني بثقة.",

    // Footer
    footerDesc: "تمكين الكفاءات التكنولوجية المصرية عبر بيانات حية لسوق العمل وأدوات متقدمة لتوجيه وتطوير المسار المهني.",
    footerRights: "© 2026 منصة عواطلي. جميع الحقوق محفوظة.",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("majra_lang") as Language | null;
    if (saved && (saved === "en" || saved === "ar")) {
      setLangState(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    } else {
      // Default to Arabic
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("majra_lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const toggleLang = () => {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isAr: lang === "ar", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Safe fallback if used outside provider
    return {
      lang: "ar" as Language,
      setLang: () => {},
      toggleLang: () => {},
      isAr: true,
      t: (key: string) => translations["ar"]?.[key] || key
    };
  }
  return context;
}
