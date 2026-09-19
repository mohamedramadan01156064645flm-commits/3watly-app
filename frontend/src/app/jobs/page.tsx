"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  MapPin, 
  Filter, 
  ChevronDown, 
  Check, 
  X, 
  Bookmark, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Briefcase,
  DollarSign,
  Users,
  MoreVertical,
  Zap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Target,
  Cloud,
  Database,
  Cpu,
  Settings
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyLogo } from '@/components/brand/CompanyLogo';
import { ActiveCVBadge } from '@/components/cv/CVVersionManager';
import { useCV } from '@/contexts/CVContext';
import { getUserSkillsFromStorage } from '@/utils/jobMatching';
import { mockDashboardData, JobItem } from '@/data/jobs';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { toast } from 'sonner';
import { getSavedJobIds, toggleJobBookmark, SAVED_JOBS_EVENT } from '@/utils/jobBookmarks';

function getLiveTimeAgo(postedAt: string | null | undefined, fallback: string, isAr: boolean): string {
  if (!postedAt) return fallback;
  try {
    const time = new Date(postedAt).getTime();
    if (isNaN(time)) return fallback;
    const diff = Math.max(0, Date.now() - time);
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 2) return isAr ? 'الآن' : 'Just now';
    if (minutes < 60) return isAr ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    if (hours === 1) return isAr ? 'منذ ساعة' : '1h ago';
    if (hours === 2) return isAr ? 'منذ ساعتين' : '2h ago';
    if (hours >= 3 && hours <= 10) return isAr ? `منذ ${hours} ساعات` : `${hours}h ago`;
    if (hours < 24) return isAr ? `منذ ${hours} ساعة` : `${hours}h ago`;

    if (days === 1) return isAr ? 'منذ يوم' : '1d ago';
    if (days === 2) return isAr ? 'منذ يومين' : '2d ago';
    if (days >= 3 && days <= 10) return isAr ? `منذ ${days} أيام` : `${days}d ago`;
    if (days < 30) return isAr ? `منذ ${days} يوماً` : `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months === 1) return isAr ? 'منذ شهر' : '1mo ago';
    if (months === 2) return isAr ? 'منذ شهرين' : '2mo ago';
    if (months >= 3 && months <= 10) return isAr ? `منذ ${months} أشهر` : `${months}mo ago`;
    return isAr ? `منذ ${months} شهراً` : `${months}mo ago`;
  } catch {
    return fallback;
  }
}

function PythonLogoIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M11.914 2C6.984 2 7.294 4.14 7.294 4.14L7.304 6.35H12.004V7.06H5.164S2.004 6.7 2.004 11.69C2.004 16.68 4.764 16.48 4.764 16.48H6.414V14.13S6.324 11.33 9.154 11.33H13.784S16.504 11.42 16.504 8.7V4.76S16.894 2 11.914 2ZM9.474 3.52C10.024 3.52 10.464 3.96 10.464 4.51C10.464 5.06 10.024 5.5 9.474 5.5C8.924 5.5 8.484 5.06 8.484 4.51C8.484 3.96 8.924 3.52 9.474 3.52Z" fill="#387EB8"/>
      <path d="M12.086 22C17.016 22 16.706 19.86 16.706 19.86L16.696 17.65H11.996V16.94H18.836S21.996 17.3 21.996 12.31C21.996 7.32 19.236 7.52 19.236 7.52H17.586V9.87S17.676 12.67 14.846 12.67H10.216S7.496 12.58 7.496 15.3V19.24S7.106 22 12.086 22ZM14.526 20.48C13.976 20.48 13.536 20.04 13.536 19.49C13.536 18.94 13.976 18.5 14.526 18.5C15.076 18.5 15.516 18.94 15.516 19.49C15.516 20.04 15.076 20.48 14.526 20.48Z" fill="#FFE052"/>
    </svg>
  );
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || searchParams.get('keyword') || '';
  const { isAr } = useLanguage();
  const { profile } = useOnboarding();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [parsedCv, setParsedCv] = useState<any>(null);
  const [savedRole, setSavedRole] = useState<string>('');
  const [keyword, setKeyword] = useState(queryParam);
  const [locationQuery, setLocationQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Mount flag to safely guard client-only localStorage & prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Read saved jobs and parsed CV from localStorage on mount (prevents SSR hydration mismatch)
  useEffect(() => {
    try {
      const ids = getSavedJobIds(user?.id);
      if (ids.length) setSavedJobs(ids);
    } catch {}
    try {
      const saved = localStorage.getItem('3watly_parsed_cv');
      if (saved) setParsedCv(JSON.parse(saved));
    } catch {}
    try {
      const r = localStorage.getItem('3watly_role');
      if (r) setSavedRole(r);
    } catch {}
    try {
      const cached = sessionStorage.getItem('3watly_jobs_feed');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
          setTotalJobs(parsed.length);
          setLoadingLive(false);
        }
      }
    } catch {}
  }, []);

  // Live minute ticker to update relative job times dynamically
  const [, setNowTick] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const { cv, activeVersion, analysis } = useCV();

  // User real skills & target role for personalized feed matching (hydration-safe)
  const userSkills = useMemo(() => {
    if (!mounted) return [];

    const fromActive = (activeVersion?.cvData?.skills || []).flatMap((g: any) =>
      Array.isArray(g.skills) ? g.skills : (typeof g === 'string' ? [g] : [g?.name || ''])
    ).filter(Boolean);

    const fromCv = (cv?.skills || []).flatMap((g: any) =>
      Array.isArray(g.skills) ? g.skills : (typeof g === 'string' ? [g] : [g?.name || ''])
    ).filter(Boolean);

    const fromParsed = Array.isArray(parsedCv?.skills)
      ? parsedCv.skills.map((s: any) => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
      : [];

    let fromStorage: string[] = [];
    try {
      fromStorage = getUserSkillsFromStorage().skills;
    } catch {}

    const combined = Array.from(new Set([...fromActive, ...fromCv, ...fromParsed, ...fromStorage]));
    return combined;
  }, [mounted, activeVersion, cv?.skills, parsedCv]);

  const targetRole = useMemo(() => {
    if (!mounted) return isAr ? 'محلل بيانات' : 'Data Analyst';

    return (
      activeVersion?.targetRole?.trim() ||
      activeVersion?.cvData?.contact?.jobTitle?.trim() ||
      cv?.contact?.jobTitle?.trim() ||
      savedRole?.trim() ||
      user?.targetRole?.trim() ||
      parsedCv?.targetRole?.trim() ||
      parsedCv?.currentTitle?.trim() ||
      profile?.targetRoles?.[0]?.title?.trim() ||
      (isAr ? 'محلل بيانات' : 'Data Analyst')
    );
  }, [mounted, activeVersion, cv?.contact?.jobTitle, savedRole, user?.targetRole, parsedCv, profile, isAr]);

  const primaryTargetRole = useMemo(() => {
    if (!targetRole) return isAr ? 'محلل بيانات' : 'Data Analyst';
    const first = targetRole.split('|')[0].trim();
    return first || targetRole;
  }, [targetRole, isAr]);

  // — Live jobs from Supabase with safe client cache hydration —
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loadingLive, setLoadingLive] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter states (default 0 = show all jobs sorted by best match to user profile)
  const [matchScoreFilter, setMatchScoreFilter] = useState<number>(0);
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all');
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'salary'>('match');

  // Dropdown open states
  const [matchMenuOpen, setMatchMenuOpen] = useState(false);
  const [seniorityMenuOpen, setSeniorityMenuOpen] = useState(false);
  const [workTypeMenuOpen, setWorkTypeMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Apply Modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobItem | null>(null);

  const { inDemandSkills, marketOverview } = mockDashboardData;

  // Apply all filters client-side (works on both live DB jobs and mockJobsList fallback)
  const applyAllFilters = useCallback((rawJobs: JobItem[]) => {
    let result = rawJobs;
    // Keyword: title, company, skills
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      result = result.filter(j =>
        (j.title?.toLowerCase().includes(kw)) ||
        (j.titleAr?.toLowerCase().includes(kw)) ||
        (j.company?.toLowerCase().includes(kw)) ||
        (j.companyAr?.toLowerCase().includes(kw)) ||
        j.matchedSkills?.some(s => s.name.toLowerCase().includes(kw))
      );
    }
    // Location: match Arabic or English location field
    if (locationQuery.trim()) {
      const loc = locationQuery.trim().toLowerCase();
      result = result.filter(j =>
        (j.location?.toLowerCase().includes(loc)) ||
        (j.locationAr?.toLowerCase().includes(loc))
      );
    }
    // Seniority
    if (seniorityFilter !== 'all') {
      const sf = seniorityFilter.toLowerCase();
      if (sf === 'junior' || sf === 'fresh') {
        result = result.filter(j => {
          const s = (j.seniority || '').toLowerCase();
          return s === 'junior' || s === 'fresh';
        });
      } else {
        result = result.filter(j => (j.seniority || '').toLowerCase() === sf);
      }
    }
    // Work type
    if (workTypeFilter !== 'all') {
      result = result.filter(j => j.workType?.toLowerCase() === workTypeFilter.toLowerCase() ||
        (workTypeFilter === 'onsite' && j.workType === 'On-site'));
    }
    // Match score
    if (matchScoreFilter > 0) {
      result = result.filter(j => j.matchScore != null && j.matchScore >= matchScoreFilter);
    }
    // Sort
    if (sortBy === 'match') {
      result = [...result].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    } else if (sortBy === 'recent') {
      result = [...result]; // already ordered by posted_at from API
    } else if (sortBy === 'salary') {
      result = [...result].sort((a, b) => {
        const parseSal = (str: string) => {
          const match = (str || '').match(/(\d+[\d,]*)/g);
          if (!match) return 0;
          return parseInt(match[match.length - 1].replace(/,/g, ''), 10);
        };
        return parseSal(b.salaryRange) - parseSal(a.salaryRange);
      });
    }
    return result;
  }, [keyword, locationQuery, seniorityFilter, workTypeFilter, matchScoreFilter, sortBy]);

  // Sync keyword if URL query param changes
  useEffect(() => {
    if (queryParam) {
      setKeyword(queryParam);
    }
  }, [queryParam]);

  // Fetch live jobs from Supabase API
  const fetchJobs = useCallback(() => {
    setLoadingLive(true);
    const params = new URLSearchParams();
    params.set('sortBy', sortBy);
    params.set('limit', '1000');
    if (userSkills.length > 0) params.set('skills', userSkills.join(','));
    if (targetRole) params.set('targetRole', targetRole);

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const source: JobItem[] = (data && Array.isArray(data.jobs)) ? data.jobs : [];
        const filtered = applyAllFilters(source);
        setJobs(filtered);
        setTotalJobs(filtered.length);
        try {
          sessionStorage.setItem('3watly_jobs_feed', JSON.stringify(filtered));
        } catch {}
      })
      .catch(() => {
        setJobs([]);
        setTotalJobs(0);
      })
      .finally(() => {
        setLoadingLive(false);
      });
  }, [applyAllFilters, sortBy, userSkills, targetRole]);

  // Re-fetch when filters change (debounced for text inputs)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchJobs, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchJobs]);

  // Persist saved jobs to localStorage on every change
  // Sync saved jobs when bookmark changes happen in other components/tabs
  useEffect(() => {
    const handler = () => setSavedJobs(getSavedJobIds(user?.id));
    window.addEventListener(SAVED_JOBS_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(SAVED_JOBS_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, [user?.id]);

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { isSaved, list } = toggleJobBookmark(id, user?.id);
    setSavedJobs(list);
    if (isSaved) {
      toast.success(isAr ? 'تم حفظ الوظيفة في قائمة المحفوظات ⭐' : 'Job saved to your bookmarks ⭐');
    } else {
      toast.info(isAr ? 'تمت إزالة الوظيفة من المحفوظات' : 'Job removed from bookmarks');
    }
  };

  // Active view tab: 'all' (all matching jobs) or 'saved' (only bookmarked jobs)
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const listTopRef = useRef<HTMLDivElement>(null);

  // Scroll sync refs + spacer state (declared here, effects run after filteredJobs/paginatedJobs)
  const jobsScrollRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(1200);
  const isSyncingRef = useRef<'window' | 'feed' | null>(null);

  // Filter jobs by activeTab ('all' vs 'saved')
  const filteredJobs = useMemo(() => {
    if (activeTab === 'saved') {
      return jobs.filter((j) => savedJobs.includes(j.id));
    }
    return jobs;
  }, [jobs, activeTab, savedJobs]);

  const matchPercentage = useMemo(() => {
    if (filteredJobs.length > 0 && typeof filteredJobs[0]?.matchScore === 'number' && filteredJobs[0].matchScore > 0) {
      return Math.round(filteredJobs[0].matchScore);
    }
    if (analysis?.score && analysis.score > 0) {
      return Math.round(analysis.score);
    }
    return 0;
  }, [filteredJobs, analysis?.score]);

  const matchingJobsCount = filteredJobs.length;

  const realAvgSalary = useMemo(() => {
    const salaries: number[] = [];
    for (const j of filteredJobs) {
      if (!j.salaryRange) continue;
      const nums = j.salaryRange.match(/\d+[\d,]*/g);
      if (nums && nums.length > 0) {
        const val = parseInt(nums[0].replace(/,/g, ''), 10);
        if (val >= 3000 && val <= 300000) {
          salaries.push(val);
        }
      }
    }
    if (salaries.length > 0) {
      const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
      return `EGP ${Math.round(avg / 1000)}K`;
    }
    return marketOverview?.avgSalary?.replace('شهرياً', '').replace('/mo', '').trim() || 'EGP 18K';
  }, [filteredJobs, marketOverview?.avgSalary]);

  const marketDemandInfo = useMemo(() => {
    if (filteredJobs.length >= 15) {
      return { level: isAr ? 'مرتفع جداً' : 'Very High', sub: isAr ? 'فرص توظيف نشطة' : 'Active hiring pace' };
    } else if (filteredJobs.length >= 5) {
      return { level: isAr ? 'متوسط' : 'Moderate', sub: isAr ? 'طلب مستقر' : 'Steady demand' };
    } else {
      return { level: isAr ? 'محدود' : 'Limited', sub: isAr ? 'فرص متخصصة' : 'Niche openings' };
    }
  }, [filteredJobs.length, isAr]);

  const inDemandJobSkills = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const j of filteredJobs) {
      for (const s of (j.matchedSkills || [])) {
        if (s?.name) counts[s.name] = (counts[s.name] || 0) + 1;
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name]) => name);
    if (sorted.length >= 2) return sorted.slice(0, 4);
    return (inDemandSkills || []).map((s: any) => s.name).slice(0, 4);
  }, [filteredJobs, inDemandSkills]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));

  // Reset page when filters or active tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, locationQuery, seniorityFilter, workTypeFilter, matchScoreFilter, sortBy, activeTab]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    if (jobsScrollRef.current) {
      jobsScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Scroll Synchronization: native window scroll ↔ jobs feed column ──
  // 1. Measure feed scrollHeight → update the invisible spacer so browser scrollbar reflects full content
  useEffect(() => {
    const container = jobsScrollRef.current;
    if (!container) return;
    const updateSpacer = () => {
      const extra = Math.max(0, container.scrollHeight - container.clientHeight);
      setSpacerHeight(window.innerHeight + extra);
    };
    updateSpacer();
    const observer = new ResizeObserver(updateSpacer);
    observer.observe(container);
    window.addEventListener('resize', updateSpacer);
    return () => { observer.disconnect(); window.removeEventListener('resize', updateSpacer); };
  }, [filteredJobs, currentPage]);

  // 2. High-performance scroll sync with timestamp locks & non-blocking RAF (buttery smooth 60/120fps)
  useEffect(() => {
    const container = jobsScrollRef.current;
    if (!container) return;

    let windowRaf: number;
    let feedRaf: number;
    let lastSource: 'window' | 'feed' | null = null;
    let lastTime = 0;

    const onWindowScroll = () => {
      // If user recently scrolled the feed directly, avoid feedback echo
      if (lastSource === 'feed' && Date.now() - lastTime < 120) return;
      lastSource = 'window';
      lastTime = Date.now();

      cancelAnimationFrame(windowRaf);
      windowRaf = requestAnimationFrame(() => {
        container.scrollTop = window.scrollY;
      });
    };

    const onFeedScroll = () => {
      // If user recently scrolled the window directly, avoid feedback echo
      if (lastSource === 'window' && Date.now() - lastTime < 120) return;
      lastSource = 'feed';
      lastTime = Date.now();

      cancelAnimationFrame(feedRaf);
      feedRaf = requestAnimationFrame(() => {
        window.scrollTo({ top: container.scrollTop, behavior: 'instant' as ScrollBehavior });
      });
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    container.addEventListener('scroll', onFeedScroll, { passive: true });

    return () => {
      cancelAnimationFrame(windowRaf);
      cancelAnimationFrame(feedRaf);
      window.removeEventListener('scroll', onWindowScroll);
      container.removeEventListener('scroll', onFeedScroll);
    };
  }, []);

  // 3. Global wheel: if user scrolls over frozen areas (sidebar, header, etc.) → forward to feed
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('.jobs-feed-scroll') ||
        target?.closest('[role="dialog"]') ||
        target?.closest('[data-dropdown]')
      ) return;

      if (jobsScrollRef.current) {
        jobsScrollRef.current.scrollTop += e.deltaY;
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <AppShell
      title={isAr ? "الوظائف والفرص المتاحة" : "Jobs"}
      subtitle={isAr ? "استكشف وظائف تكنولوجيا المعلومات والبيانات المطابقة لمهاراتك وخبرتك." : "Discover roles that match your skills and career goals."}
      fixedLayout={true}
      scrollSpacerHeight={spacerHeight}
    >
      <div className="flex flex-col h-full min-h-0 gap-4">
        
        {/* Active CV Badge for Jobs Match */}
        <div className="shrink-0 flex items-center justify-between">
          {mounted && <ActiveCVBadge pageName={isAr ? "مطابقة الوظائف" : "Job Match"} />}
        </div>

        {/* ========================================================================= */}
        {/* 1. SEARCH & FILTERS HEADER CARD — FROZEN, NEVER SCROLLS                  */}
        {/* ========================================================================= */}
        <div className="shrink-0 relative z-20 rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs space-y-4">
          
          {/* Main Search Inputs Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            
            {/* Keywords Input */}
            <div className="relative">
              <label className="block text-[11.5px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isAr ? "المسمى أو المهارات" : "Keywords"}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={isAr ? "مثال: Data Analyst, Python, SQL..." : "e.g. Data Analyst, Python, SQL..."}
                  className="w-full h-11 ltr:pl-10 ltr:pr-8 rtl:pr-10 rtl:pl-8 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#070B14] text-[13.5px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => setKeyword('')}
                    className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Location Input */}
            <div className="relative">
              <label className="block text-[11.5px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {isAr ? "المحافظة أو النطاق" : "Location"}
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder={isAr ? "القرية الذكية، القاهرة، الجيزة..." : "Smart Village, Cairo, Giza..."}
                  className="w-full h-11 ltr:pl-10 ltr:pr-8 rtl:pr-10 rtl:pl-8 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#070B14] text-[13.5px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                {locationQuery && (
                  <button
                    type="button"
                    onClick={() => setLocationQuery('')}
                    className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>


          </div>

          {/* Filter Pills Row (Matching media_1787761309709.png 1:1) */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-100 dark:border-white/5">
            
            {/* 1. Match Score Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMatchMenuOpen(!matchMenuOpen);
                  setSeniorityMenuOpen(false);
                  setWorkTypeMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                  matchScoreFilter > 0
                    ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <span>
                  {matchScoreFilter === 0 
                    ? (isAr ? "نسبة التوافق: جميع النسب" : "Match: All")
                    : (isAr ? `نسبة التوافق: +${matchScoreFilter}%` : `Match: ${matchScoreFilter}%+`)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {matchMenuOpen && (
                <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1.5 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1726] p-1.5 shadow-2xl z-40 space-y-1 backdrop-blur-md">
                  {[
                    { score: 0, labelAr: 'جميع النسب (الكل)', labelEn: 'All Scores' },
                    { score: 60, labelAr: '+60% فما فوق', labelEn: '+60% and above' },
                    { score: 75, labelAr: '+75% توافق جيد', labelEn: '+75% Good Match' },
                    { score: 85, labelAr: '+85% توافق ممتاز', labelEn: '+85% High Match' }
                  ].map((item) => (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => {
                        setMatchScoreFilter(item.score);
                        setMatchMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                        matchScoreFilter === item.score 
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                      {matchScoreFilter === item.score && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Seniority Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSeniorityMenuOpen(!seniorityMenuOpen);
                  setMatchMenuOpen(false);
                  setWorkTypeMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                  seniorityFilter !== 'all'
                    ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <span>
                  {seniorityFilter === 'all' 
                    ? (isAr ? "المستوى: جميع المستويات" : "Seniority: All Levels")
                    : seniorityFilter === 'junior'
                    ? (isAr ? "المستوى: مبتدئ / خريج جديد (0 - 2 سنة)" : "Seniority: Junior / Fresh (0 - 2 yrs)")
                    : seniorityFilter === 'mid'
                    ? (isAr ? "المستوى: متوسط الخبرة (3 - 5 سنوات)" : "Seniority: Mid-Level (3 - 5 yrs)")
                    : (isAr ? "المستوى: خبير أول (+5 سنوات)" : "Seniority: Senior (+5 yrs)")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {seniorityMenuOpen && (
                <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1.5 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1726] p-1.5 shadow-2xl z-40 space-y-1 backdrop-blur-md">
                  {[
                    { id: 'all', label: isAr ? 'جميع المستويات (الكل)' : 'All Seniorities' },
                    { id: 'junior', label: isAr ? 'مبتدئ / خريج جديد (0 - 2 سنة)' : 'Junior / Fresh (0 - 2 yrs)' },
                    { id: 'mid', label: isAr ? 'متوسط الخبرة (3 - 5 سنوات)' : 'Mid-Level (3 - 5 yrs)' },
                    { id: 'senior', label: isAr ? 'خبير أول / قيادي (+5 سنوات)' : 'Senior / Lead (5+ yrs)' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSeniorityFilter(item.id);
                        setSeniorityMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                        seniorityFilter === item.id 
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {seniorityFilter === item.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Work Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setWorkTypeMenuOpen(!workTypeMenuOpen);
                  setMatchMenuOpen(false);
                  setSeniorityMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                  workTypeFilter !== 'all'
                    ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <span>
                  {workTypeFilter === 'all'
                    ? (isAr ? "نوع العمل: كل الأنواع" : "Work Type: All")
                    : workTypeFilter === 'hybrid'
                    ? (isAr ? "نوع العمل: هجين (Hybrid)" : "Work Type: Hybrid")
                    : workTypeFilter === 'remote'
                    ? (isAr ? "نوع العمل: عن بُعد (Remote)" : "Work Type: Remote")
                    : (isAr ? "نوع العمل: من المقر (On-site)" : "Work Type: On-site")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {workTypeMenuOpen && (
                <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1.5 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1726] p-1.5 shadow-2xl z-40 space-y-1 backdrop-blur-md">
                  {[
                    { id: 'all', label: isAr ? 'كل الأنواع (الكل)' : 'All Types' },
                    { id: 'hybrid', label: isAr ? 'هجين (Hybrid)' : 'Hybrid' },
                    { id: 'remote', label: isAr ? 'عن بُعد (Remote)' : 'Remote' },
                    { id: 'onsite', label: isAr ? 'من المقر (On-site)' : 'On-site' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setWorkTypeFilter(item.id);
                        setWorkTypeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                        workTypeFilter === item.id 
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {workTypeFilter === item.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Reset Filters Button */}
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setLocationQuery('');
                setMatchScoreFilter(0);
                setSeniorityFilter('all');
                setWorkTypeFilter('all');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-[12.5px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}</span>
            </button>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. RESULTS MAIN GRID (Left Feed + Right Intelligence Widgets)             */}
        {/* ========================================================================= */}
        <div className="flex-1 min-h-0 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          
          {/* Main Feed Column (Span 8) */}
          <div className="lg:col-span-8 h-full min-h-0 flex flex-col space-y-3">
            
            {/* Feed Navigation Bar: All Jobs vs Saved Jobs Tabs + Sorting — FROZEN, NEVER SCROLLS */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 py-1">
              {/* Premium Segmented Control */}
              <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-[#0F172A] border border-slate-200/80 dark:border-white/5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{isAr ? "جميع الوظائف" : "All Jobs"}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === 'all'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {jobs.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('saved')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                    activeTab === 'saved'
                      ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${activeTab === 'saved' || savedJobs.length > 0 ? 'fill-current text-blue-600 dark:text-blue-400' : ''}`} />
                  <span>{isAr ? "الوظائف المحفوظة" : "Saved Jobs"}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === 'saved'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : savedJobs.length > 0
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {savedJobs.length}
                  </span>
                </button>
              </div>

              {/* Feed Count Info & Sort Menu */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                  {loadingLive ? (
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{isAr ? "جاري التحميل..." : "Loading..."}</span>
                    </span>
                  ) : (
                    <>
                      <span className="font-bold text-slate-900 dark:text-white">{filteredJobs.length}</span>{" "}
                      {activeTab === 'saved'
                        ? (isAr ? "وظيفة محفوظة" : "saved jobs")
                        : (isAr ? "وظيفة متوافقة" : "matching jobs")}
                    </>
                  )}
                </p>

                {/* Sort By Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortMenuOpen(!sortMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-2xs"
                  >
                    <span>
                      {sortBy === 'match' 
                        ? (isAr ? "الأفضل تطابقاً" : "Best Match")
                        : sortBy === 'salary'
                        ? (isAr ? "الأكثر طلباً" : "Most Popular")
                        : (isAr ? "الأحدث" : "Most Recent")}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {sortMenuOpen && (
                    <div className="absolute top-full ltr:right-0 rtl:left-0 mt-1.5 w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-1.5 shadow-xl z-30 space-y-1">
                      {[
                        { id: 'match', label: isAr ? 'الأفضل تطابقاً' : 'Best Match' },
                        { id: 'salary', label: isAr ? 'الأكثر طلباً' : 'Most Popular' },
                        { id: 'recent', label: isAr ? 'الأحدث' : 'Most Recent' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSortBy(item.id as any);
                            setSortMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                            sortBy === item.id ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <span>{item.label}</span>
                          {sortBy === item.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ONLY Job Cards Feed Scrolls — Ultra smooth hardware-accelerated */}
            <div
              ref={jobsScrollRef}
              className="jobs-feed-scroll no-scrollbar flex-1 min-h-0 overflow-y-auto space-y-4 pb-10 pr-1 overscroll-contain"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                transform: 'translateZ(0)',
                willChange: 'scroll-position'
              }}
            >
            {/* Loading Skeleton */}
            {loadingLive && jobs.length === 0 && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs space-y-4 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                      <div className="flex-1 space-y-2.5">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-1/2" />
                        <div className="flex gap-2 mt-2">
                          <div className="h-6 w-16 bg-slate-100 dark:bg-slate-700 rounded-full" />
                          <div className="h-6 w-20 bg-slate-100 dark:bg-slate-700 rounded-full" />
                          <div className="h-6 w-14 bg-slate-100 dark:bg-slate-700 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loadingLive && filteredJobs.length === 0 && (
              activeTab === 'saved' ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-[24px] border border-dashed border-slate-200 dark:border-white/10 bg-gradient-to-b from-white to-slate-50/50 dark:from-[#0B1120] dark:to-[#070B14] p-8 space-y-3">
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                    <Bookmark className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <p className="text-[17px] font-bold text-slate-900 dark:text-white">
                    {isAr ? "لا توجد وظائف محفوظة حتى الآن" : "No saved jobs yet"}
                  </p>
                  <p className="text-[13.5px] text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                    {isAr
                      ? "يمكنك حفظ أي وظيفة تنال إعجابك بالضغط على أيقونة الإشارة المرجعية (🔖) على بطاقة الوظيفة للرجوع إليها والتقديم لاحقاً."
                      : "You can save any job that interests you by clicking the bookmark icon (🔖) on the job card to easily revisit and apply later."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{isAr ? "استعراض جميع الوظائف المتاحة" : "Browse All Jobs"}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? "لا توجد وظائف مطابقة" : "No matching jobs found"}
                  </p>
                  <p className="text-[13px] text-slate-400 max-w-[280px]">
                    {isAr ? "جرب تغيير الفلاتر أو البحث بكلمات مختلفة" : "Try adjusting your filters or search with different keywords"}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setKeyword(''); setLocationQuery(''); setMatchScoreFilter(0); setSeniorityFilter('all'); setWorkTypeFilter('all'); }}
                    className="mt-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
                  </button>
                </div>
              )
            )}

            {/* Scroll Anchor */}
            <div ref={listTopRef} />

            {/* Job Cards Feed */}
            {paginatedJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="rounded-[22px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-shadow transition-colors duration-150 space-y-4"
                >
                  {/* Top Row: Company Logo + Title + Match Ring + Menu */}
                  <div className="flex items-start justify-between gap-4">
                    
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Official Company Logo */}
                      <CompanyLogo
                        company={job.company}
                        logoUrl={job.companyLogo || (job as any).company_logo}
                        size="lg"
                        className="shrink-0"
                      />

                      <div className="min-w-0">
                        {/* Title with blue verified checkmark */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link 
                            href={`/jobs/${job.id}`}
                            className="text-[17px] font-bold text-[#0B132B] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
                          >
                            {isAr ? job.titleAr : job.title}
                          </Link>
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1B57E0] text-white text-[9px] font-black shrink-0">
                            ✓
                          </span>
                        </div>

                        {/* Company & Location */}
                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{isAr ? job.companyAr : job.company}</span>
                          {" • 📍 "}
                          <span>{isAr ? job.locationAr : job.location}</span>
                          {` (${isAr ? job.workTypeAr : job.workType})`}
                        </p>

                        {/* Salary and employment type pill */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {(
                            !job.salaryRange ||
                            job.salaryRange.includes('interview') ||
                            job.salaryRange.includes('Disclosed') ||
                            job.salaryRangeAr?.includes('تحدد أثناء المقابلة') ||
                            job.salaryRangeAr?.includes('يتحدد أثناء المقابلة') ||
                            job.salaryRange === 'تحدد أثناء المقابلة'
                          ) ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">
                              🤝 {isAr ? 'يتحدد أثناء المقابلة' : 'Disclosed upon interview'}
                            </span>
                          ) : (
                            <span className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400">
                              💰 {isAr ? job.salaryRangeAr.replace(/(دوام كامل|دوام جزئي).*/i, '').trim() : job.salaryRange.replace(/(Full Time|Part Time).*/i, '').trim()}
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/60 text-[11.5px] font-bold text-[#12B76A]">
                            {isAr ? job.employmentTypeAr : job.employmentType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Match Donut Ring + Posted Time + Menu */}
                    <div className="flex items-start gap-3 shrink-0">
                      <div className="flex flex-col items-center">
                        <div className="relative h-12 w-12">
                          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#E8F8F0" className="dark:stroke-emerald-950/60" strokeWidth="9" />
                            {job.matchScore != null && userSkills.length > 0 && (
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#12B76A"
                                strokeWidth="9"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 40}
                                strokeDashoffset={2 * Math.PI * 40 * (1 - job.matchScore / 100)}
                              />
                            )}
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[12px] font-black text-[#0B132B] dark:text-white leading-none">
                              {job.matchScore != null && userSkills.length > 0 ? `${job.matchScore}%` : '--%'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                          {job.matchScore != null && userSkills.length > 0 ? (isAr ? "توافق" : "Match") : (isAr ? "يتطلب CV" : "Needs CV")}
                        </span>
                        <span className="text-[10.5px] text-slate-400 mt-1">
                          {getLiveTimeAgo((job as any).postedAt, isAr ? job.postedAgoAr : job.postedAgo, isAr)}
                        </span>
                      </div>

                      <button type="button" className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Skills Match Section */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider ltr:mr-1 rtl:ml-1">
                        {isAr ? "المهارات المطابقة:" : "Top Skills Match:"}
                      </span>
                      {job.matchedSkills.map((skill) => (
                        <span 
                          key={skill.name}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E8F8F0] dark:bg-emerald-950/50 text-[12px] font-bold text-[#12B76A] border border-emerald-200/60 dark:border-emerald-500/20"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          {skill.name}
                        </span>
                      ))}
                      {job.missingSkills.map((skill) => (
                        <span 
                          key={skill.name}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF7ED] dark:bg-amber-950/50 text-[12px] font-bold text-[#F97316] border border-orange-200/60 dark:border-orange-500/20"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                          {skill.name}
                        </span>
                      ))}
                      {job.missingSkills.length > 0 && (
                        <span className="text-[12px] font-medium text-slate-400">
                          {isAr 
                            ? `${job.missingSkills.length} مهارة ناقصة`
                            : `${job.missingSkills.length} missing skill${job.missingSkills.length > 1 ? 's' : ''}`}
                        </span>
                      )}
                    </div>

                    {/* Dedicated Uniform Action Bar (Never jumps or flips based on skills length) */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100/70 dark:border-white/5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <a
                          href={job.applyUrl || (job as any).apply_url || `/jobs/${job.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            toast.success(isAr ? "جاري نقلك إلى موقع التقديم الرسمي للوظيفة..." : "Opening official application portal...");
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isAr ? "تقديم سريع ↗" : "Quick Apply ↗"}</span>
                        </a>

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-[12.5px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                        >
                          <span>{isAr ? "عرض التفاصيل والمطابقة" : "View Details & Fit"}</span>
                          <ArrowRight className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSave(job.id)}
                        aria-label={isSaved ? "Remove bookmark" : "Bookmark job"}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                          isSaved
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                        }`}
                      >
                        <Bookmark className={`w-4.5 h-4.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Premium Pagination Bar */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-xs">
                {/* Information */}
                <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                  {isAr ? (
                    <>
                      عرض <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, filteredJobs.length)}</span> من إجمالي <span className="font-bold text-blue-600 dark:text-blue-400">{filteredJobs.length}</span> وظيفة
                    </>
                  ) : (
                    <>
                      Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span>–<span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, filteredJobs.length)}</span> of <span className="font-bold text-blue-600 dark:text-blue-400">{filteredJobs.length}</span> jobs
                    </>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 px-3 text-[12.5px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-white/5 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`} />
                    <span>{isAr ? "السابق" : "Prev"}</span>
                  </button>

                  {/* Smart Window Pagination Numbers */}
                  {(() => {
                    const pages: (number | string)[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      if (currentPage <= 4) {
                        pages.push(1, 2, 3, 4, 5, '...', totalPages);
                      } else if (currentPage >= totalPages - 3) {
                        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                      } else {
                        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                      }
                    }

                    return pages.map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span
                            key={`dots-${idx}`}
                            className="flex h-9 w-7 items-center justify-center text-xs font-bold text-slate-400"
                          >
                            ...
                          </span>
                        );
                      }
                      const pageNum = Number(p);
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-[13px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20 scale-105'
                              : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 px-3 text-[12.5px] font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-white/5 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{isAr ? "التالي" : "Next"}</span>
                    <ChevronLeft className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`} />
                  </button>
                </div>
              </div>
            )}

            </div>{/* end jobs-feed-scroll */}
          </div>{/* end lg:col-span-8 flex col */}

          {/* Right Sidebar Column (Span 4) — Real Career Match Radar Card */}
          <div className="lg:col-span-4 shrink-0">
            {!mounted ? (
              <div className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-sm p-5 sm:p-6 space-y-5 animate-pulse">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      <div className="h-3 w-20 bg-slate-100 dark:bg-slate-700 rounded-md" />
                    </div>
                  </div>
                  <div className="h-7 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-md" />
                <div className="h-px bg-slate-100 dark:bg-white/5" />
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] space-y-2 text-center">
                      <div className="h-7 w-7 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800" />
                      <div className="h-2.5 w-12 mx-auto bg-slate-100 dark:bg-slate-700 rounded-md" />
                      <div className="h-3.5 w-14 mx-auto bg-slate-200 dark:bg-slate-800 rounded-md" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                    <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  </div>
                </div>
                <div className="h-11 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>
            ) : (
              <div className="rounded-[24px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-sm p-5 sm:p-6 space-y-5 transition-all">

                {/* ── 1. HEADER: Clean Modern Title & Dynamic Verified Match Score ── */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[16.5px] font-black text-slate-900 dark:text-white leading-tight truncate">
                        {isAr ? "رادار التوافق المهني" : "Career Match Radar"}
                      </h3>
                      <p className="text-[12.5px] font-bold text-[#1B57E0] dark:text-blue-400 truncate mt-0.5">
                        {primaryTargetRole}
                      </p>
                    </div>
                  </div>

                  {/* Real Dynamic Match Score Pill */}
                  {matchPercentage > 0 ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 shrink-0 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[14px] font-black leading-none">
                        {matchPercentage}%
                      </span>
                      <span className="text-[11px] font-bold">
                        {isAr ? "توافق" : "Match"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 shrink-0">
                      <span className="text-[11px] font-bold">
                        {isAr ? "غير محدد" : "N/A"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Subtitle description */}
                <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isAr
                    ? `تحليل ذكي ومطابقة فورية لسيرتك الذاتية مع الوظائف الشاغرة لمسار «${primaryTargetRole}».`
                    : `Real-time AI alignment analysis of your resume against open roles for "${primaryTargetRole}".`}
                </p>

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-white/5" />

                {/* ── 2. THREE REAL STATS ─────────────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {/* Demand */}
                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="flex justify-center mb-1">
                      <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {isAr ? "الطلب بالسوق" : "Demand"}
                    </span>
                    <span className="text-[13.5px] font-black text-slate-900 dark:text-white block leading-tight">
                      {marketDemandInfo.level}
                    </span>
                    <span className="text-[9.5px] font-bold text-purple-600 dark:text-purple-400 block truncate">
                      {marketDemandInfo.sub}
                    </span>
                  </div>

                  {/* Avg Salary */}
                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="flex justify-center mb-1">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {isAr ? "متوسط الراتب" : "Avg Salary"}
                    </span>
                    <span className="text-[13.5px] font-black text-slate-900 dark:text-white block leading-tight">
                      {realAvgSalary}
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 block">
                      {isAr ? "شهرياً" : "/mo"}
                    </span>
                  </div>

                  {/* Matching Jobs Count */}
                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="flex justify-center mb-1">
                      <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      {isAr ? "وظائف مطابقة" : "Matching"}
                    </span>
                    <span className="text-[15px] font-black text-slate-900 dark:text-white block leading-tight">
                      {matchingJobsCount}
                    </span>
                    <span className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 block">
                      {isAr ? "متاحة للتقديم" : "Available"}
                    </span>
                  </div>
                </div>

                {/* ── 3. SKILLS SECTION: Real Matched & In-Demand Skills ────────── */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {isAr ? "مهاراتك المتطابقة في السوق:" : "Your Matched Skills:"}
                      </span>
                    </div>
                    <Link href="/skills" className="text-[11.5px] font-bold text-[#1B57E0] dark:text-blue-400 hover:underline">
                      {isAr ? "عرض الكل" : "View all"}
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {/* Real User Verified Skills from their CV */}
                    {userSkills.length > 0 ? (
                      userSkills.slice(0, 5).map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11.5px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{skill}</span>
                        </span>
                      ))
                    ) : (
                      <p className="text-[11.5px] text-slate-400 italic">
                        {isAr ? "أضف مهاراتك في السيرة الذاتية لحساب نسبة التوافق بدقة." : "Add skills to your CV to compute match score."}
                      </p>
                    )}

                    {/* Top Market In-Demand Skills for this role */}
                    {inDemandJobSkills.filter((s: string) => !userSkills.includes(s)).slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10"
                      >
                        <span className="text-[9px] text-blue-500 font-bold">+</span>
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── 4. SMART TIP: Real Actionable Market Advice ───────────────── */}
                <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5">
                  <span className="text-[16px] shrink-0">💡</span>
                  <p className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {isAr 
                      ? `إضافة مهارات تحليلية معتمدة وربط المشاريع العملية يرفع نسبة قبولك بنسبة +15% في وظائف «${primaryTargetRole}».`
                      : `Adding verified portfolio projects boosts your interview callback rate by +15% for "${primaryTargetRole}".`}
                  </p>
                </div>

                {/* ── 5. ACTION BUTTON ─────────────────────────────────────────────── */}
                <Link
                  href="/cv-builder"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#1B57E0] hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-[13px] transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? "تحسين السيرة الذاتية لزيادة التوافق" : "Optimize CV to Boost Match"}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />
    </AppShell>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <JobsPageContent />
    </Suspense>
  );
}
