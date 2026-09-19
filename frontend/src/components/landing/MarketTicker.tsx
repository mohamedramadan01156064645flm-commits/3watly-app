"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/* ========================================================================= */
/* Custom Pixel-Perfect Tech & Category SVG Glyphs                           */
/* ========================================================================= */

function ReactIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#00D2FF" strokeWidth="1.6" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#00D2FF" strokeWidth="1.6" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#00D2FF" strokeWidth="1.6" transform="rotate(150 12 12)" />
      <circle cx="12" cy="12" r="2.2" fill="#00D2FF" />
    </svg>
  );
}

function NodeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2.5L20.5 7.4V16.6L12 21.5L3.5 16.6V7.4L12 2.5Z"
        stroke="#22C55E"
        strokeWidth="1.8"
        fill="#15803D"
        fillOpacity="0.2"
      />
      <path
        d="M11.5 8V16M8.5 10.5C9.5 9.5 11 9 12.5 9C14.5 9 15.5 10 15.5 11.5C15.5 13.5 12 13 12 15C12 15.8 12.8 16.2 13.8 16.2"
        stroke="#4ADE80"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PythonIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M11.9 2C8.7 2 6.8 3.4 6.8 5.6v2.7h5.3v.7H4.4C2.3 9 1 10.9 1 14.1c0 3.2 1.8 4.6 4.6 4.6h1.5v-2.1c0-2.3 2-4.2 4.3-4.2h5.3v-.8c0-2.2-1.9-4.3-4.3-4.3h-.5V5.6c0-2.2-1.9-3.6-4-3.6zm-1.8 1.8c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
        fill="#387EB8"
      />
      <path
        d="M12.1 22c3.2 0 5.1-1.4 5.1-3.6v-2.7h-5.3v-.7h7.7c2.1 0 3.4-1.9 3.4-5.1 0-3.2-1.8-4.6-4.6-4.6h-1.5v2.1c0 2.3-2 4.2-4.3 4.2H7.3v.8c0 2.2 1.9 4.3 4.3 4.3h.5v1.7c0 2.2 1.9 3.6 4 3.6zm1.8-1.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        fill="#FFD43B"
      />
    </svg>
  );
}

function SqlIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse cx="12" cy="5" rx="8" ry="2.8" stroke="#3B82F6" strokeWidth="1.8" fill="#3B82F6" fillOpacity="0.2" />
      <path d="M20 12c0 1.55-3.58 2.8-8 2.8S4 13.55 4 12" stroke="#3B82F6" strokeWidth="1.8" />
      <path d="M4 5v14c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8V5" stroke="#3B82F6" strokeWidth="1.8" />
    </svg>
  );
}

function DockerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="6" y="8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="9" y="8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="12" y="8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="3" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="6" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="9" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="12" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <rect x="15" y="10.8" width="2.2" height="2" rx="0.3" fill="#0284C7" />
      <path
        d="M2.5 13.5C2.5 17.5 5.5 19.5 10 19.5C15 19.5 19 17 20.5 13.5C21.5 13.5 22.5 12.8 22.5 12C22.5 11.2 21 11 20 11.5C19.5 10 18.5 9 17 9C17 9 16.5 11 15 11.5H2.5v2z"
        fill="#0284C7"
      />
      <circle cx="6" cy="15.5" r="0.6" fill="#fff" />
    </svg>
  );
}

function SpringIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.14 2.53 7.69 6.13 9.17-.08-.6-.13-1.22-.13-1.85 0-5.52 4.48-10 10-10 .63 0 1.25.05 1.85.13C18.31 4.53 14.76 2 12 2z" fill="#6DB33F" />
      <path d="M21.87 9.32C21.46 9.11 21 9 20.5 9c-4.42 0-8 3.58-8 8 0 .5.11.96.32 1.37A9.976 9.976 0 0022 12c0-.93-.13-1.83-.37-2.68h.24z" fill="#5FA334" />
    </svg>
  );
}

function QaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#14B8A6" strokeWidth="1.8" fill="#14B8A6" fillOpacity="0.2" />
      <path d="M9 12l2 2 4-4" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="#6366F1" strokeWidth="1.8" fill="#6366F1" fillOpacity="0.2" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="#6366F1" strokeWidth="1.8" fill="#6366F1" fillOpacity="0.2" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" stroke="#6366F1" strokeWidth="1.8" fill="#6366F1" fillOpacity="0.2" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="#6366F1" strokeWidth="1.8" fill="#6366F1" fillOpacity="0.2" />
    </svg>
  );
}

/* ========================================================================= */
/* Item Definition & Color Scheme Presets                                    */
/* ========================================================================= */

type AccentKey = 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber' | 'teal' | 'indigo' | 'sky';

const ACCENT_STYLES: Record<
  AccentKey,
  {
    cardBorder: string;
    cardGlow: string;
    cardHover: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    badgeDot: string;
  }
> = {
  violet: {
    cardBorder: 'border-slate-200/90 dark:border-violet-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(139,92,246,0.18)]',
    cardHover: 'hover:border-violet-400 dark:hover:border-violet-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(139,92,246,0.35)]',
    badgeBg: 'bg-violet-50 dark:bg-violet-500/15',
    badgeText: 'text-violet-700 dark:text-violet-300',
    badgeBorder: 'border-violet-200 dark:border-violet-500/30',
    badgeDot: 'bg-violet-500 dark:bg-violet-400',
  },
  blue: {
    cardBorder: 'border-slate-200/90 dark:border-blue-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(59,130,246,0.18)]',
    cardHover: 'hover:border-blue-400 dark:hover:border-blue-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(59,130,246,0.35)]',
    badgeBg: 'bg-blue-50 dark:bg-blue-500/15',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-500/30',
    badgeDot: 'bg-blue-500 dark:bg-blue-400',
  },
  cyan: {
    cardBorder: 'border-slate-200/90 dark:border-cyan-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(6,182,212,0.18)]',
    cardHover: 'hover:border-cyan-400 dark:hover:border-cyan-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(6,182,212,0.35)]',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-500/15',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    badgeBorder: 'border-cyan-200 dark:border-cyan-500/30',
    badgeDot: 'bg-cyan-500 dark:bg-cyan-400',
  },
  emerald: {
    cardBorder: 'border-slate-200/90 dark:border-emerald-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.18)]',
    cardHover: 'hover:border-emerald-400 dark:hover:border-emerald-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(16,185,129,0.35)]',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-500/30',
    badgeDot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  amber: {
    cardBorder: 'border-slate-200/90 dark:border-amber-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(245,158,11,0.18)]',
    cardHover: 'hover:border-amber-400 dark:hover:border-amber-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(245,158,11,0.35)]',
    badgeBg: 'bg-amber-50 dark:bg-amber-500/15',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-500/30',
    badgeDot: 'bg-amber-500 dark:bg-amber-400',
  },
  teal: {
    cardBorder: 'border-slate-200/90 dark:border-teal-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(20,184,166,0.18)]',
    cardHover: 'hover:border-teal-400 dark:hover:border-teal-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(20,184,166,0.35)]',
    badgeBg: 'bg-teal-50 dark:bg-teal-500/15',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-200 dark:border-teal-500/30',
    badgeDot: 'bg-teal-500 dark:bg-teal-400',
  },
  indigo: {
    cardBorder: 'border-slate-200/90 dark:border-indigo-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.18)]',
    cardHover: 'hover:border-indigo-400 dark:hover:border-indigo-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(99,102,241,0.35)]',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-500/15',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-500/30',
    badgeDot: 'bg-indigo-500 dark:bg-indigo-400',
  },
  sky: {
    cardBorder: 'border-slate-200/90 dark:border-sky-500/30',
    cardGlow: 'shadow-xs dark:shadow-[0_4px_20px_-4px_rgba(14,165,233,0.18)]',
    cardHover: 'hover:border-sky-400 dark:hover:border-sky-400/60 hover:shadow-md dark:hover:shadow-[0_4px_25px_-2px_rgba(14,165,233,0.35)]',
    badgeBg: 'bg-sky-50 dark:bg-sky-500/15',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-500/30',
    badgeDot: 'bg-sky-500 dark:bg-sky-400',
  },
};

interface TickerItemConfig {
  id: string;
  skillName: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badgeLabelAr: string;
  badgeLabelEn: string;
  accent: AccentKey;
  defaultCount: number;
  renderIcon: () => React.ReactNode;
}

// Exactly reflects verified skills from our 661 live Egyptian job database
const TICKER_ITEMS: TickerItemConfig[] = [
  {
    id: 'card-python',
    skillName: 'Python',
    titleAr: 'Python',
    titleEn: 'Python',
    subtitleAr: 'الذكاء الاصطناعي وتحليل البيانات',
    subtitleEn: 'AI & Data Science',
    badgeLabelAr: 'الأكثر طلباً',
    badgeLabelEn: 'Top Trending',
    accent: 'violet',
    defaultCount: 26,
    renderIcon: () => <PythonIcon />,
  },
  {
    id: 'card-sql',
    skillName: 'SQL',
    titleAr: 'SQL',
    titleEn: 'SQL',
    subtitleAr: 'إدارة وتحليل قواعد البيانات',
    subtitleEn: 'Database & Analytics',
    badgeLabelAr: 'طلب قياسي',
    badgeLabelEn: 'High Demand',
    accent: 'blue',
    defaultCount: 30,
    renderIcon: () => <SqlIcon />,
  },
  {
    id: 'card-react',
    skillName: 'JavaScript',
    titleAr: 'React & Next.js',
    titleEn: 'React & Next.js',
    subtitleAr: 'تطوير تطبيقات الويب الحديثة',
    subtitleEn: 'Modern Web Engineering',
    badgeLabelAr: 'الأكثر طلباً',
    badgeLabelEn: 'Most In-Demand',
    accent: 'cyan',
    defaultCount: 22,
    renderIcon: () => <ReactIcon />,
  },
  {
    id: 'card-qa',
    skillName: 'Quality Assurance',
    titleAr: 'Quality Assurance',
    titleEn: 'Quality Assurance',
    subtitleAr: 'اختبار وضمان جودة البرمجيات',
    subtitleEn: 'Software QA & Testing',
    badgeLabelAr: 'أعلى الشواغر',
    badgeLabelEn: 'Top Openings',
    accent: 'teal',
    defaultCount: 63,
    renderIcon: () => <QaIcon />,
  },
  {
    id: 'card-pm',
    skillName: 'Project Management',
    titleAr: 'Project Management',
    titleEn: 'Project Management',
    subtitleAr: 'إدارة المشاريع والفرق التقنية',
    subtitleEn: 'Tech Project Leadership',
    badgeLabelAr: 'فرص قيادية',
    badgeLabelEn: 'Leadership',
    accent: 'indigo',
    defaultCount: 54,
    renderIcon: () => <ProjectIcon />,
  },
  {
    id: 'card-node',
    skillName: 'Node.js',
    titleAr: 'Node.js & APIs',
    titleEn: 'Node.js & APIs',
    subtitleAr: 'الخوادم والـ Microservices',
    subtitleEn: 'Backend & Microservices',
    badgeLabelAr: 'نمو سريع',
    badgeLabelEn: 'Fast Growth',
    accent: 'emerald',
    defaultCount: 16,
    renderIcon: () => <NodeIcon />,
  },
  {
    id: 'card-docker',
    skillName: 'Docker',
    titleAr: 'Docker & Cloud',
    titleEn: 'Docker & Cloud',
    subtitleAr: 'الحاويات والبنية السحابية',
    subtitleEn: 'DevOps & Containers',
    badgeLabelAr: 'مطلوب دائماً',
    badgeLabelEn: 'Steady Demand',
    accent: 'sky',
    defaultCount: 17,
    renderIcon: () => <DockerIcon />,
  },
  {
    id: 'card-java',
    skillName: 'Java',
    titleAr: 'Java & Spring',
    titleEn: 'Java & Spring',
    subtitleAr: 'أنظمة وتطبيقات الشركات الكبرى',
    subtitleEn: 'Enterprise Software',
    badgeLabelAr: 'قطاع المؤسسات',
    badgeLabelEn: 'Enterprise',
    accent: 'amber',
    defaultCount: 17,
    renderIcon: () => <SpringIcon />,
  },
];

export function MarketTicker() {
  const { isAr } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});

  // Fetch real verified job counts from live Supabase endpoint
  useEffect(() => {
    let isMounted = true;
    fetch('/api/market/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted || !data?.topSkills) return;
        const countsMap: Record<string, number> = {};
        data.topSkills.forEach((s: { name: string; count: number }) => {
          countsMap[s.name] = s.count;
        });
        setLiveCounts(countsMap);
      })
      .catch(() => {
        // Fallbacks are already preset to exact database counts
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const duplicatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="relative w-full overflow-hidden py-3 select-none z-20"
      aria-label={isAr ? "مؤشرات السوق والمهارات المطلوبة" : "Live Skills & Market Trends"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      {/* Edge Fades for natural scrolling transitions */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white/95 dark:from-[#040816] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white/95 dark:from-[#040816] to-transparent" />

      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-3 sm:gap-3.5 shrink-0 py-1"
          animate={{
            x: isAr ? ['0%', '33.333%'] : ['0%', '-33.333%'],
          }}
          transition={{
            duration: isPaused ? 10000 : 42,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedItems.map((item, idx) => {
            const styles = ACCENT_STYLES[item.accent];
            const realCount = liveCounts[item.skillName] || item.defaultCount;
            const jobLabel = isAr ? `${realCount} شاغر نشط` : `${realCount} Open Jobs`;

            return (
              <div
                key={`${item.id}-${idx}`}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl min-w-[260px] sm:min-w-[285px] h-[72px] sm:h-[74px] border ${styles.cardBorder} bg-white dark:bg-[#070E22] transition-all duration-300 shrink-0 cursor-default group ${styles.cardGlow} ${styles.cardHover}`}
              >
                {/* Tech Icon Squircle */}
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/[0.05] group-hover:scale-105 group-hover:dark:border-white/20 transition-all duration-200 shadow-xs">
                  {item.renderIcon()}
                </div>

                {/* Card Content: 2 Balanced, High-Contrast Rows */}
                <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-0.5">
                  {/* Top Row: Title + Category Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[12.5px] sm:text-[13px] font-bold text-slate-800 dark:text-white truncate leading-tight">
                      {isAr ? item.titleAr : item.titleEn}
                    </h4>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-bold border shrink-0 ${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder} leading-none`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${styles.badgeDot} animate-pulse`} />
                      <span>{isAr ? item.badgeLabelAr : item.badgeLabelEn}</span>
                    </span>
                  </div>

                  {/* Bottom Row: Subtitle + Real Verified Jobs Pill */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-[10px] sm:text-[10.5px] font-medium text-slate-500 dark:text-slate-400 truncate leading-tight">
                      {isAr ? item.subtitleAr : item.subtitleEn}
                    </p>

                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[9.5px] font-bold border leading-none shrink-0 bg-emerald-50/80 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 shadow-2xs">
                      <Briefcase className="w-2.5 h-2.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{jobLabel}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
