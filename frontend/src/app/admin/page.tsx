"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, UserCheck, UserX, FileCheck2, Briefcase, BookOpen,
  RefreshCw, AlertTriangle, ChevronRight, ChevronLeft, ArrowRight,
  TrendingUp, Sparkles, ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

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
  gradientDark: string;
  gradientLight: string;
  borderDark: string;
  borderLight: string;
  textColor: string;
  href: string;
}

function buildStatCards(stats: Stats): StatCardConfig[] {
  return [
    {
      label: 'Total Users',
      labelAr: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: Users,
      gradientDark: 'from-[#0C224E] via-[#091738] to-[#060D20]',
      gradientLight: 'from-blue-50 to-blue-100/60',
      borderDark: 'border-blue-500/30',
      borderLight: 'border-blue-300',
      textColor: 'text-blue-400 dark:text-blue-300',
      href: '/admin/users',
    },
    {
      label: 'Admins & Staff',
      labelAr: 'المستخدمون النشطون',
      value: stats.adminUsers,
      icon: UserCheck,
      gradientDark: 'from-[#1E1B4B] via-[#131135] to-[#0A0920]',
      gradientLight: 'from-indigo-50 to-indigo-100/60',
      borderDark: 'border-indigo-500/30',
      borderLight: 'border-indigo-300',
      textColor: 'text-indigo-400 dark:text-indigo-300',
      href: '/admin/users',
    },
    {
      label: 'Suspended',
      labelAr: 'المعلقون',
      value: stats.suspendedUsers,
      icon: UserX,
      gradientDark: 'from-[#4C0519] via-[#2F0310] to-[#190208]',
      gradientLight: 'from-rose-50 to-rose-100/60',
      borderDark: 'border-rose-500/30',
      borderLight: 'border-rose-300',
      textColor: 'text-rose-400 dark:text-rose-300',
      href: '/admin/users',
    },
    {
      label: 'Active CV Analyses',
      labelAr: 'تطبيقات السير الذاتية النشطة',
      value: stats.totalCvAnalyses,
      icon: FileCheck2,
      gradientDark: 'from-[#064E3B] via-[#033024] to-[#021A14]',
      gradientLight: 'from-teal-50 to-teal-100/60',
      borderDark: 'border-teal-500/30',
      borderLight: 'border-teal-300',
      textColor: 'text-teal-400 dark:text-teal-300',
      href: '/admin/analytics',
    },
    {
      label: 'Jobs in Platform',
      labelAr: 'الوظائف في منصة البيانات',
      value: stats.totalJobs,
      icon: Briefcase,
      gradientDark: 'from-[#451A03] via-[#2B1002] to-[#170801]',
      gradientLight: 'from-amber-50 to-amber-100/60',
      borderDark: 'border-amber-500/30',
      borderLight: 'border-amber-300',
      textColor: 'text-amber-400 dark:text-amber-300',
      href: '/jobs',
    },
    {
      label: 'Active Resources',
      labelAr: 'المصادر النشطة',
      value: stats.activeResources,
      icon: BookOpen,
      gradientDark: 'from-[#3B0764] via-[#24043D] to-[#120220]',
      gradientLight: 'from-purple-50 to-purple-100/60',
      borderDark: 'border-purple-500/30',
      borderLight: 'border-purple-300',
      textColor: 'text-purple-400 dark:text-purple-300',
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
  const { user } = useAuth();

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
  const userName = user?.fullName?.split(' ')[0] ?? (isAr ? 'أحمد' : 'Admin');

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? `أهلاً، ${userName} 👋` : `Welcome, ${userName} 👋`}
          </h1>
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

      {/* 6 Stat Cards Grid matching Image 3 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-white/40 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/8" />
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className={`
                    group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200
                    hover:scale-[1.02] hover:shadow-xl
                    bg-gradient-to-br ${card.gradientLight} dark:${card.gradientDark}
                    ${card.borderLight} dark:${card.borderDark}
                  `}
                >
                  {/* Top: Icon in glowing rounded container */}
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-white/70 dark:bg-white/8 border border-white/40 dark:border-white/10 shadow-xs">
                      <Icon className={`w-5 h-5 ${card.textColor}`} />
                    </div>
                  </div>

                  {/* Middle: Big Metric Number + Label */}
                  <div className="my-2">
                    <p className={`text-2xl sm:text-3xl font-black ${card.textColor} tracking-tight`}>
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-tight">
                      {isAr ? card.labelAr : card.label}
                    </p>
                  </div>

                  {/* Bottom: Chevron arrow */}
                  <div className="flex items-center text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors pt-1">
                    {isAr ? (
                      <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
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
