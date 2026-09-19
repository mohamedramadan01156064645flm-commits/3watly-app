"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, UserCheck, UserPlus, FileCheck2, Database, BookOpen,
  RefreshCw, AlertTriangle, ChevronRight, ChevronLeft, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { resolveDisplayName } from '@/utils/formatName';

interface Stats {
  totalUsers: number;
  adminUsers: number;
  suspendedUsers: number;
  totalCvAnalyses: number;
  totalJobs: number;
  activeResources: number;
}

interface RecentUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  account_status: string;
  created_at: string;
}

interface StatCardConfig {
  label: string;
  labelAr: string;
  value: number;
  icon: React.ElementType;
  watermarkIcon: React.ElementType;
  iconGradient: string;
  iconShadow: string;
  watermarkColor: string;
  valueColor: string;
  trendValue: string;
  trendType: 'up' | 'neutral' | 'down';
  cardBorder: string;
  cardGlow: string;
  cardBg: string;
  cornerGradient: string;
  cornerBorder: string;
  cornerGlow: string;
  href: string;
}

function buildStatCards(stats: Stats): StatCardConfig[] {
  return [
    {
      label: 'Total Users',
      labelAr: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: Users,
      watermarkIcon: Users,
      iconGradient: 'from-[#6366F1] to-[#3B82F6]',
      iconShadow: 'shadow-[0_4px_18px_rgba(99,102,241,0.45)]',
      watermarkColor: 'text-indigo-400/20 dark:text-indigo-400/15',
      valueColor: 'text-white dark:text-white',
      trendValue: '+18%',
      trendType: 'up',
      cardBorder: 'border-indigo-200/80 dark:border-indigo-500/25 hover:border-indigo-400/60 dark:hover:border-indigo-400/50',
      cardGlow: 'shadow-lg shadow-indigo-950/15 dark:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(79,70,229,0.45)]',
      cardBg: 'bg-gradient-to-b from-indigo-50/90 via-white/80 to-indigo-100/60 dark:from-[#0d1633]/90 dark:via-[#070d20]/90 dark:to-[#040610]/95',
      cornerGradient: 'bg-gradient-to-tl from-indigo-500/50 via-indigo-600/25 to-transparent',
      cornerBorder: 'border-indigo-300/40 dark:border-indigo-400/30',
      cornerGlow: 'bg-indigo-500/40',
      href: '/admin/users',
    },
    {
      label: 'Active Users',
      labelAr: 'المستخدمون النشطون',
      value: stats.adminUsers,
      icon: UserCheck,
      watermarkIcon: UserCheck,
      iconGradient: 'from-[#3B82F6] to-[#1D4ED8]',
      iconShadow: 'shadow-[0_4px_18px_rgba(59,130,246,0.45)]',
      watermarkColor: 'text-blue-400/20 dark:text-blue-400/15',
      valueColor: 'text-[#93C5FD] dark:text-[#93C5FD]',
      trendValue: '+50%',
      trendType: 'up',
      cardBorder: 'border-blue-200/80 dark:border-blue-500/25 hover:border-blue-400/60 dark:hover:border-blue-400/50',
      cardGlow: 'shadow-lg shadow-blue-950/15 dark:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(59,130,246,0.45)]',
      cardBg: 'bg-gradient-to-b from-blue-50/90 via-white/80 to-blue-100/60 dark:from-[#0c1a36]/90 dark:via-[#070f21]/90 dark:to-[#040812]/95',
      cornerGradient: 'bg-gradient-to-tl from-blue-500/50 via-blue-600/25 to-transparent',
      cornerBorder: 'border-blue-300/40 dark:border-blue-400/30',
      cornerGlow: 'bg-blue-500/40',
      href: '/admin/users',
    },
    {
      label: 'Current Users',
      labelAr: 'المستخدمون الحاليون',
      value: stats.suspendedUsers,
      icon: UserPlus,
      watermarkIcon: UserPlus,
      iconGradient: 'from-[#F43F5E] to-[#BE123C]',
      iconShadow: 'shadow-[0_4px_18px_rgba(244,63,94,0.45)]',
      watermarkColor: 'text-rose-400/20 dark:text-rose-400/15',
      valueColor: 'text-[#FDA4AF] dark:text-[#FDA4AF]',
      trendValue: '0%',
      trendType: 'neutral',
      cardBorder: 'border-rose-200/80 dark:border-rose-500/25 hover:border-rose-400/60 dark:hover:border-rose-400/50',
      cardGlow: 'shadow-lg shadow-rose-950/15 dark:shadow-[0_8px_25px_-5px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(244,63,94,0.45)]',
      cardBg: 'bg-gradient-to-b from-rose-50/90 via-white/80 to-rose-100/60 dark:from-[#220d16]/90 dark:via-[#14060c]/90 dark:to-[#0a0306]/95',
      cornerGradient: 'bg-gradient-to-tl from-rose-500/50 via-rose-600/25 to-transparent',
      cornerBorder: 'border-rose-300/40 dark:border-rose-400/30',
      cornerGlow: 'bg-rose-500/40',
      href: '/admin/users',
    },
    {
      label: 'Active CV Analyses',
      labelAr: 'الملفات السير الذاتية النشطة',
      value: stats.totalCvAnalyses,
      icon: FileCheck2,
      watermarkIcon: FileCheck2,
      iconGradient: 'from-[#10B981] to-[#0D9488]',
      iconShadow: 'shadow-[0_4px_18px_rgba(16,185,129,0.45)]',
      watermarkColor: 'text-teal-400/20 dark:text-teal-400/15',
      valueColor: 'text-[#2DD4BF] dark:text-[#2DD4BF]',
      trendValue: '0%',
      trendType: 'neutral',
      cardBorder: 'border-teal-200/80 dark:border-teal-500/25 hover:border-teal-400/60 dark:hover:border-teal-400/50',
      cardGlow: 'shadow-lg shadow-teal-950/15 dark:shadow-[0_8px_25px_-5px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(20,184,166,0.45)]',
      cardBg: 'bg-gradient-to-b from-teal-50/90 via-white/80 to-teal-100/60 dark:from-[#0a1e1b]/90 dark:via-[#061311]/90 dark:to-[#030a09]/95',
      cornerGradient: 'bg-gradient-to-tl from-teal-400/50 via-teal-500/25 to-transparent',
      cornerBorder: 'border-teal-300/40 dark:border-teal-400/30',
      cornerGlow: 'bg-teal-500/40',
      href: '/admin/analytics',
    },
    {
      label: 'Jobs in Platform',
      labelAr: 'المؤلفات في منصة البيانات',
      value: stats.totalJobs,
      icon: Database,
      watermarkIcon: Database,
      iconGradient: 'from-[#F59E0B] to-[#D97706]',
      iconShadow: 'shadow-[0_4px_18px_rgba(245,158,11,0.45)]',
      watermarkColor: 'text-amber-400/20 dark:text-amber-400/15',
      valueColor: 'text-[#FBBF24] dark:text-[#FBBF24]',
      trendValue: '+8%',
      trendType: 'up',
      cardBorder: 'border-amber-200/80 dark:border-amber-500/25 hover:border-amber-400/60 dark:hover:border-amber-400/50',
      cardGlow: 'shadow-lg shadow-amber-950/15 dark:shadow-[0_8px_25px_-5px_rgba(245,158,11,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(245,158,11,0.45)]',
      cardBg: 'bg-gradient-to-b from-amber-50/90 via-white/80 to-amber-100/60 dark:from-[#21180a]/90 dark:via-[#140e05]/90 dark:to-[#0a0702]/95',
      cornerGradient: 'bg-gradient-to-tl from-amber-500/50 via-amber-600/25 to-transparent',
      cornerBorder: 'border-amber-300/40 dark:border-amber-400/30',
      cornerGlow: 'bg-amber-500/40',
      href: '/jobs',
    },
    {
      label: 'Available Resources',
      labelAr: 'المصادر المتاحة',
      value: stats.activeResources,
      icon: BookOpen,
      watermarkIcon: BookOpen,
      iconGradient: 'from-[#9333EA] to-[#7C3AED]',
      iconShadow: 'shadow-[0_4px_18px_rgba(147,51,234,0.45)]',
      watermarkColor: 'text-purple-400/20 dark:text-purple-400/15',
      valueColor: 'text-white dark:text-white',
      trendValue: '+12%',
      trendType: 'up',
      cardBorder: 'border-purple-200/80 dark:border-purple-500/25 hover:border-purple-400/60 dark:hover:border-purple-400/50',
      cardGlow: 'shadow-lg shadow-purple-950/15 dark:shadow-[0_8px_25px_-5px_rgba(147,51,234,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(147,51,234,0.45)]',
      cardBg: 'bg-gradient-to-b from-purple-50/90 via-white/80 to-purple-100/60 dark:from-[#17122e]/90 dark:via-[#0e0b20]/90 dark:to-[#080614]/95',
      cornerGradient: 'bg-gradient-to-tl from-purple-500/50 via-purple-600/25 to-transparent',
      cornerBorder: 'border-purple-300/40 dark:border-purple-400/30',
      cornerGlow: 'bg-purple-500/40',
      href: '/admin/resources',
    },
  ];
}

function formatDate(iso: string, isAr: boolean) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

const ROLE_BADGE: Record<string, { label: string; labelAr: string; style: string }> = {
  owner: { label: 'Owner', labelAr: 'Owner', style: 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold' },
  admin: { label: 'Admin', labelAr: 'Admin', style: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 font-bold' },
  user:  { label: 'USER', labelAr: 'USER', style: 'bg-slate-700/30 text-slate-300 dark:text-slate-400 border-slate-600/30 font-semibold' },
};

export default function AdminDashboardPage() {
  const { isAr } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data.stats);
      setRecentUsers(data.recentUsers ?? []);
    } catch (e: any) {
      setError(e.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = stats ? buildStatCards(stats) : [];

  // Dynamic Admin User Name from AuthContext
  const resolvedName = resolveDisplayName({
    fullName: user?.fullName,
    email: user?.email,
    isAr,
  });

  const isGeneric = !resolvedName || resolvedName === 'User' || resolvedName === 'مستخدم';
  const dynamicName = isGeneric ? (isAr ? 'المسؤول' : 'Admin') : resolvedName;

  const nameParts = dynamicName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const restName = nameParts.slice(1).join(' ');
  const isArabicName = /[\u0600-\u06FF]/.test(dynamicName);

  return (
    <div className="space-y-7">
      {/* Welcome Banner matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {authLoading && !user ? (
            <div className="flex items-center gap-2 h-9">
              <span className="text-2xl sm:text-3xl select-none">👋</span>
              <div className="h-8 w-44 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
            </div>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="text-2xl sm:text-3xl select-none shrink-0">👋</span>
              <span
                dir={isArabicName ? 'rtl' : 'ltr'}
                className="inline-flex items-center gap-1.5"
              >
                <span>{firstName}</span>
                {restName && <span className="text-[#38BDF8]">{restName}</span>}
              </span>
            </h1>
          )}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isAr ? 'إليك نظرة عامة على حالة المنصة والمستخدمين.' : "Here's an overview of the platform status."}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50 self-start shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* 6 Stat Cards Grid matching Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[195px] sm:min-h-[210px] rounded-[22px] bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl animate-pulse border border-slate-200/60 dark:border-white/8 p-4 sm:p-5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-200 dark:bg-white/10" />
                  <div className="w-12 h-12 rounded-xl bg-slate-200/40 dark:bg-white/5" />
                </div>
                <div className="space-y-2 my-2">
                  <div className="w-14 h-8 rounded-lg bg-slate-200 dark:bg-white/10" />
                  <div className="w-24 h-4 rounded-md bg-slate-200/70 dark:bg-white/5" />
                </div>
                <div className="w-28 h-3 rounded-md bg-slate-200/50 dark:bg-white/5" />
              </div>
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              const Watermark = card.watermarkIcon;
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  dir="ltr"
                  className={`
                    group relative flex flex-col justify-between p-4 sm:p-5 rounded-[22px] border transition-all duration-300
                    hover:-translate-y-1 hover:scale-[1.01] min-h-[195px] sm:min-h-[210px] overflow-hidden
                    backdrop-blur-xl
                    ${card.cardBg}
                    ${card.cardBorder}
                    ${card.cardGlow}
                  `}
                >
                  {/* Watermark Ghost Icon (Top-Right) */}
                  <div className="absolute -top-1 -right-1 pointer-events-none p-3.5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                    <Watermark className={`w-14 h-14 sm:w-16 sm:h-16 ${card.watermarkColor} stroke-[1.2]`} />
                  </div>

                  {/* Bottom-Right Glowing Corner Arc */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none overflow-hidden rounded-br-[22px]">
                    {/* Ambient Glow */}
                    <div 
                      className={`absolute -bottom-6 -right-6 w-28 h-28 rounded-tl-[75px] ${card.cornerGlow} blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-300`} 
                    />
                    {/* Defined Arc with Rim Highlight */}
                    <div 
                      className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-tl-[65px] border-t border-l ${card.cornerBorder} ${card.cornerGradient} opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300`} 
                    />
                  </div>

                  {/* Top: Solid Vibrant Icon Container */}
                  <div className="flex items-start justify-between relative z-10">
                    <div
                      className={`
                        w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center
                        bg-gradient-to-br ${card.iconGradient} ${card.iconShadow}
                        transition-transform duration-300 group-hover:scale-105
                      `}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2]" />
                    </div>
                  </div>

                  {/* Middle: Big Metric Number + Label */}
                  <div className="my-2 sm:my-3 relative z-10">
                    <p className={`text-3xl sm:text-[34px] font-black ${card.valueColor} tracking-tight leading-none text-left`}>
                      {card.value.toLocaleString()}
                    </p>
                    <p 
                      className={`text-xs sm:text-[12.5px] font-semibold text-slate-700 dark:text-slate-200 mt-2.5 leading-snug line-clamp-2 ${isAr ? 'text-right' : 'text-left'}`}
                      dir={isAr ? 'rtl' : 'ltr'}
                    >
                      {isAr ? card.labelAr : card.label}
                    </p>
                  </div>

                  {/* Bottom Row: Trend Badge */}
                  <div 
                    className="flex items-center gap-1.5 text-[11px] font-medium pt-1 relative z-10"
                    dir="ltr"
                  >
                    {card.trendType === 'up' ? (
                      <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{card.trendValue}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-bold">
                        <span className="text-xs font-black">-</span>
                        <span>{card.trendValue}</span>
                      </span>
                    )}
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[10.5px]">
                      {isAr ? 'من الأسبوع الماضي' : 'from last week'}
                    </span>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Recent Users Table Section */}
      <div className="rounded-3xl bg-white/85 dark:bg-gradient-to-b dark:from-[#0B1E45]/60 dark:via-[#07132B]/75 dark:to-[#040C1E]/85 backdrop-blur-2xl border border-slate-200/90 dark:border-cyan-500/25 shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
              {isAr ? 'أحدث المستخدمين' : 'Recent Users'}
            </h2>
          </div>

          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
          >
            <span>{isAr ? 'عرض الكل' : 'View All'}</span>
            {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-white/6 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="text-start px-6 py-3.5">{isAr ? 'المستخدم' : 'User'}</th>
                <th className="text-start px-6 py-3.5 hidden sm:table-cell">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="text-center px-6 py-3.5">{isAr ? 'الدور' : 'Role'}</th>
                <th className="text-start px-6 py-3.5 hidden md:table-cell">{isAr ? 'تاريخ الانضمام' : 'Joined Date'}</th>
                <th className="text-end px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-slate-200 dark:bg-white/6 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    {isAr ? 'لا يوجد مستخدمون مسجلون حتى الآن.' : 'No users registered yet.'}
                  </td>
                </tr>
              ) : (
                recentUsers.map((u) => {
                  const roleConfig = ROLE_BADGE[u.role] ?? ROLE_BADGE.user;
                  const initial = (u.full_name ?? u.email)?.[0]?.toUpperCase() ?? '?';

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/3 transition-colors group"
                    >
                      {/* User (Avatar + Name) */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                              {u.full_name || u.email.split('@')[0]}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate sm:hidden">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                          {u.email}
                        </span>
                      </td>

                      {/* Role Pill */}
                      <td className="px-6 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] border ${roleConfig.style}`}>
                          {isAr ? roleConfig.labelAr : roleConfig.label}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(u.created_at, isAr)}
                        </span>
                      </td>

                      {/* Row Action Link */}
                      <td className="px-6 py-3.5 text-end">
                        <Link
                          href="/admin/users"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors inline-block"
                        >
                          {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
