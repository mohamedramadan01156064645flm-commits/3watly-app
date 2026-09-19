"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  SparklesIcon,
  PlusCircleIcon,
  MoreVerticalIcon,
  DownloadIcon,
  CopyIcon,
  Trash2Icon,
  MessageSquarePlusIcon,
  Loader2Icon,
  UploadIcon,
  CheckCircle2Icon,
  BriefcaseIcon,
  TargetIcon,
} from 'lucide-react';
import { ChatThread } from '@/components/copilot/ChatThread';
import { ChatComposer } from '@/components/copilot/ChatComposer';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { downloadFile } from '@/utils/marketData';
import { AppShell } from '@/components/layout/AppShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActiveCVBadge } from '@/components/cv/CVVersionManager';
import { useCV } from '@/contexts/CVContext';

const arabicEmptyPrompts = [
  {
    title: "🔍 أقرب الوظائف المطابقة لخبراتي",
    prompt: "ما هي أقرب الوظائف المتاحة حالياً في السوق المصري المناسبة لمهاراتي وخبراتي ولماذا؟"
  },
  {
    title: "📈 أهم المهارات المطلوب تعلمها الآن",
    prompt: "ما هي أهم المهارات التقنية الناقصة في ملفي والتي سترفع نسبة قبولي في الشركات الكبرى؟"
  },
  {
    title: "📄 فحص وتحسين الـ CV لـ ATS",
    prompt: "حلل نقاط القوة والضعف في سيرتي الذاتية واقترح صياغة رقمية أفضل لإنجازاتي."
  },
  {
    title: "🎯 رفع الـ Match Score للوظائف",
    prompt: "كيف أرفع نسبة التطابق (Match Score) لوظائف الشركات الرائدة في القاهرة؟"
  }
];

const englishEmptyPrompts = [
  {
    title: "🔍 Top Matching Jobs for My Skills",
    prompt: "What are the closest live Egyptian market opportunities matching my profile and why?"
  },
  {
    title: "📈 High-Impact Skills to Learn Next",
    prompt: "What are the most critical skill gaps I should close to maximize my hiring probability?"
  },
  {
    title: "📄 ATS CV Optimization & Audit",
    prompt: "Review my CV structure, keywords, and quantified achievements for Egyptian tech companies."
  },
  {
    title: "🎯 Boost Job Match Scores",
    prompt: "How can I increase my match score for top tech roles in Cairo and Alexandria?"
  }
];

export default function CopilotPage() {
  const {
    messages,
    isThinking,
    isLoading,
    sendMessage,
    resetChat,
    setFeedback,
    buildTranscript,
  } = useChat();
  const { user } = useAuth();
  const { isAr } = useLanguage();
  const { activeVersion } = useCV();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(menuOpen, () => setMenuOpen(false));
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const [activeCvStats, setActiveCvStats] = useState<{
    hasCv: boolean;
    role?: string;
    skillsCount: number;
    atsScore?: number;
    cvName?: string;
  }>({ hasCv: false, skillsCount: 0 });

  useEffect(() => {
    // 1. Try from activeVersion in CVContext
    if (activeVersion && (activeVersion.cvData?.skills?.length || activeVersion.cvData?.experience?.length || activeVersion.name)) {
      const sCount = activeVersion.cvData.skills.reduce((acc, g) => acc + (Array.isArray(g.skills) ? g.skills.length : 0), 0);
      setActiveCvStats({
        hasCv: true,
        role: activeVersion.targetRole || activeVersion.cvData.contact.jobTitle || '',
        skillsCount: sCount,
        atsScore: (activeVersion as any).analysis?.score ?? undefined,
        cvName: activeVersion.name,
      });
      return;
    }

    // 2. Fallback to 3watly_parsed_cv in localStorage
    try {
      const raw = localStorage.getItem('3watly_parsed_cv');
      if (raw) {
        const p = JSON.parse(raw);
        const sCount = Array.isArray(p.skills) ? p.skills.length : 0;
        if (sCount > 0 || p.targetRole || p.fullName) {
          setActiveCvStats({
            hasCv: true,
            role: p.targetRole || p.currentTitle || '',
            skillsCount: sCount,
            atsScore: p.atsReport?.score ?? undefined,
            cvName: p.filename || (isAr ? 'السيرة الذاتية الأساسية' : 'Primary Resume'),
          });
          return;
        }
      }

      // 3. Fallback to 3watly_cv_versions
      const versRaw = localStorage.getItem('3watly_cv_versions');
      if (versRaw) {
        const vers = JSON.parse(versRaw);
        if (Array.isArray(vers) && vers.length > 0) {
          const v = vers[0];
          const sCount = v.cvData?.skills?.reduce((acc: number, g: any) => acc + (Array.isArray(g.skills) ? g.skills.length : 0), 0) || 0;
          setActiveCvStats({
            hasCv: true,
            role: v.targetRole || v.cvData?.contact?.jobTitle || '',
            skillsCount: sCount,
            atsScore: v.analysis?.score ?? undefined,
            cvName: v.name,
          });
          return;
        }
      }
    } catch {}
  }, [activeVersion, isAr]);

  // Dedicated scroll helper: locks scroll directly to bottom of container
  const scrollToBottom = React.useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
    endRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  // When messages change or model is thinking, smoothly scroll down
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, isThinking, scrollToBottom]);

  // When component mounts or finishes loading, guarantee bottom position immediately
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom('auto');
      const t1 = setTimeout(() => scrollToBottom('auto'), 60);
      const t2 = setTimeout(() => scrollToBottom('auto'), 200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isLoading, scrollToBottom]);

  // Auto-lock to bottom when user re-focuses tab or returns to page
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        scrollToBottom('auto');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onVisibility);
    };
  }, [scrollToBottom]);

  const copyConversation = async () => {
    setMenuOpen(false);
    if (messages.length === 0) {
      toast.info(isAr ? 'لا توجد رسائل للنسخ' : 'Nothing to copy yet');
      return;
    }
    try {
      await navigator.clipboard.writeText(buildTranscript());
      toast.success(isAr ? 'تم نسخ المحادثة إلى الحافظة' : 'Conversation copied to clipboard');
    } catch {
      toast.error(isAr ? 'تعذر الوصول إلى الحافظة' : 'Could not access the clipboard');
    }
  };

  const exportTranscript = () => {
    setMenuOpen(false);
    if (messages.length === 0) {
      toast.info(isAr ? 'لا توجد محادثة لتصديرها' : 'Nothing to export yet');
      return;
    }
    downloadFile('3watly-copilot-conversation.txt', buildTranscript(), 'text/plain;charset=utf-8');
    toast.success(isAr ? 'تم تصدير المحادثة كملف نصي' : 'Conversation exported', {
      description: '3watly-copilot-conversation.txt',
    });
  };

  const clearConversation = async () => {
    setMenuOpen(false);
    if (messages.length === 0) {
      toast.info(isAr ? 'المحادثة فارغة بالفعل' : 'This chat is already empty');
      return;
    }
    await resetChat();
    toast.success(isAr ? 'تم مسح المحادثة' : 'Conversation cleared');
  };

  const emptyStatePrompts = isAr ? arabicEmptyPrompts : englishEmptyPrompts;

  return (
    <AppShell
      title={isAr ? "المساعد المهني الذكي (AI Career Copilot)" : "AI Career Copilot"}
      subtitle={
        isAr
          ? "مرشدك الذكي للمسار المهني، مستند إلى بيانات حقيقية لآلاف الوظائف في السوق المصري."
          : "Your intelligent career guide, powered by real Egyptian market data."
      }
      showSearch={false}
    >
      <div className="mx-auto flex h-[calc(100vh-210px)] max-w-[1100px] flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-xs">
        {/* Header Bar - Enhanced with Official 3D Logo & Dynamic Active CV Banner */}
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] px-6 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Official 3D Logo Avatar with Active Pulse */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-600/15 to-emerald-500/10 p-1 border border-blue-500/20 shadow-xs">
              <img
                src="/logo.png"
                alt="3WATLY Copilot"
                className="h-full w-full object-contain drop-shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-[#0B1120]"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white">
                  {isAr ? "محادثة المساعد المهني الذكي" : "AI Career Copilot"}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-500/30 px-2 py-0.5 text-[10.5px] font-bold text-blue-700 dark:text-blue-300">
                  <SparklesIcon className="h-3 w-3" />
                  {isAr ? "مساعد ذكي" : "AI Assistant"}
                </span>
                <ActiveCVBadge pageName={isAr ? "المساعد الذكي" : "Copilot"} />
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11.5px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {isAr ? "المحتوى مُولّد بالذكاء الاصطناعي — يرجى مراجعته" : "AI-generated content — review recommended"}
                </span>
                {activeCvStats.role && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                      {activeCvStats.role}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ltr:ml-auto rtl:mr-auto">
            <button
              type="button"
              onClick={async () => {
                await resetChat();
                toast.success(isAr ? 'تم بدء محادثة جديدة' : 'Started a new chat');
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white px-3.5 text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98"
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span>{isAr ? "محادثة جديدة" : "New Chat"}</span>
            </button>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Conversation options"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer shadow-2xs"
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute ltr:right-0 rtl:left-0 top-[42px] z-30 w-52 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-1.5 shadow-xl"
                  >
                    <MenuRow
                      icon={CopyIcon}
                      label={isAr ? "نسخ المحادثة" : "Copy conversation"}
                      onClick={copyConversation}
                    />
                    <MenuRow
                      icon={DownloadIcon}
                      label={isAr ? "تصدير كملف txt" : "Export as .txt"}
                      onClick={exportTranscript}
                    />
                    <MenuRow
                      icon={Trash2Icon}
                      label={isAr ? "مسح المحادثة" : "Clear conversation"}
                      danger
                      onClick={clearConversation}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Messages Area with scrollContainerRef */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-5 scroll-slim space-y-4"
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center py-16">
              <Loader2Icon className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              isAr={isAr}
              userName={user?.fullName || (user as any)?.name || ''}
              stats={activeCvStats}
              prompts={emptyStatePrompts}
              onPick={sendMessage}
            />
          ) : (
            <ChatThread
              messages={messages}
              onFeedback={setFeedback}
              onSendMessage={sendMessage}
            />
          )}
          <div ref={endRef} />
        </div>

        {/* Composer Input Area */}
        <div className="shrink-0 border-t border-slate-100 dark:border-white/5 p-4">
          <ChatComposer onSend={sendMessage} isThinking={isThinking} />
        </div>
      </div>
    </AppShell>
  );
}

function EmptyState({
  isAr,
  userName,
  stats,
  prompts,
  onPick,
}: {
  isAr: boolean;
  userName?: string;
  stats: { hasCv: boolean; role?: string; skillsCount: number; atsScore?: number };
  prompts: Array<{ title: string; prompt: string }>;
  onPick: (prompt: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center py-8 text-center max-w-[720px] mx-auto">
      {/* Personalized Welcome Card */}
      <div className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/60 p-5 text-left rtl:text-right mb-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr
                ? `أهلاً بك${userName ? ` يا ${userName}` : ''} في عواطلي Copilot`
                : `Welcome${userName ? `, ${userName}` : ''} to 3WATLY Copilot`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? "مساعدك المتخصص لربط مهاراتك بشواغر وفرص سوق العمل المصري."
                : "Your AI advisor grounded in Egyptian tech market criteria."}
            </p>
          </div>
        </div>

        {/* Dynamic Status Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/70 dark:border-white/5">
          {stats.hasCv ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2Icon className="h-3.5 w-3.5" />
                {stats.role || 'Data Analyst'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-[11.5px] font-semibold text-blue-700 dark:text-blue-400">
                <TargetIcon className="h-3.5 w-3.5" />
                {stats.skillsCount} {isAr ? 'مهارة مسجلة' : 'Skills Detected'}
              </span>
              {stats.atsScore !== undefined && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 text-[11.5px] font-semibold text-purple-700 dark:text-purple-400">
                  <BriefcaseIcon className="h-3.5 w-3.5" />
                  ATS: {stats.atsScore}/100
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] text-slate-500">
                {isAr
                  ? "لم ترفع سيرتك الذاتية بعد. ارفعها لتحصل على تحليل فوري مخصص."
                  : "No CV uploaded yet. Upload your resume for tailored insights."}
              </span>
              <button
                type="button"
                onClick={() => router.push('/onboarding/cv-upload')}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1 text-[11.5px] font-semibold text-white transition-colors cursor-pointer"
              >
                <UploadIcon className="h-3 w-3" />
                {isAr ? "رفع سيرة ذاتية" : "Upload CV"}
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
        {isAr ? "ما الذي يشغل بالك اليوم؟ اختر موضوعاً للبدء:" : "What would you like to explore today?"}
      </h3>

      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3">
        {prompts.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onPick(item.prompt)}
            className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] p-3.5 text-left rtl:text-right shadow-2xs transition-all hover:border-blue-500 hover:shadow-xs cursor-pointer group"
          >
            <p className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {item.title}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
              {item.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function MenuRow({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left rtl:text-right text-[13px] font-medium transition-colors cursor-pointer ${
        danger
          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}
