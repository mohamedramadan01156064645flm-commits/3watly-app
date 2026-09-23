"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  BookOpen,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/brand/Logo';

interface NavItem {
  label: string;
  labelAr: string;
  href: string;
  icon: React.ElementType;
  ownerOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    labelAr: 'الواجهة الرئيسية',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    labelAr: 'المستخدمون',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'CV Documents',
    labelAr: 'ملفات السير الذاتية',
    href: '/admin/cvs',
    icon: FileCheck2,
  },
  {
    label: 'Resources',
    labelAr: 'المصادر التعليمية',
    href: '/admin/resources',
    icon: BookOpen,
  },
  {
    label: 'Audit Logs',
    labelAr: 'سجل العمليات',
    href: '/admin/audit-logs',
    icon: FileText,
    ownerOnly: true,
  },
  {
    label: 'Settings',
    labelAr: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
];

const STORAGE_KEY = '3watly_admin_sidebar_collapsed';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const { isAr } = useLanguage();
  const { isOwner } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setCollapsed(stored === 'true');
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.ownerOnly || isOwner
  );

  const sidebarContent = (
    <div className={`
      flex flex-col h-full
      bg-gradient-to-b from-blue-50/80 via-white/70 to-blue-100/60
      dark:bg-gradient-to-b dark:from-[#0B1E45]/70 dark:via-[#051128]/80 dark:to-[#020612]/90
      backdrop-blur-2xl border-e border-slate-200/80 dark:border-white/10 shadow-2xl
      transition-all duration-300 ease-in-out select-none
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-slate-200/80 dark:border-white/10 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" className="transition-transform hover:scale-105">
            <Logo size="sm" iconOnly />
          </Link>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isAr
            ? (collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
            : (collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
          }
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        {visibleItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? (isAr ? item.labelAr : item.label) : undefined}
              className={`
                relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[13.5px] font-semibold
                transition-all duration-150 group
                ${active
                  ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-transparent text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent'
                }
                ${collapsed ? 'justify-center px-2' : ''}
              `}
            >
              {/* Active cyan dot indicator on leading edge */}
              {active && (
                <span className="absolute start-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]" />
              )}
              
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-110 ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200'}`} />
              
              {!collapsed && (
                <span className="truncate">{isAr ? item.labelAr : item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to App Link */}
      <div className={`p-4 border-t border-slate-200/80 dark:border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
        <Link
          href="/dashboard"
          onClick={onMobileClose}
          className={`
            flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-semibold
            text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors group
            ${collapsed ? 'justify-center px-2' : ''}
          `}
          title={collapsed ? (isAr ? 'العودة للتطبيق' : 'Back to App') : undefined}
        >
          {isAr ? (
            <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          )}
          {!collapsed && <span>{isAr ? 'العودة للتطبيق' : 'Back to App'}</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative z-10 flex h-full">
            <div className="flex flex-col h-full w-64 bg-white dark:bg-[#070C18] border-e border-slate-200 dark:border-white/10 shadow-2xl">
              <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-white/10">
                <Logo size="md" />
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`
                        relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[13.5px] font-semibold
                        transition-all duration-150
                        ${active
                          ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/25'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                        }
                      `}
                    >
                      {active && (
                        <span className="absolute start-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                      )}
                      <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-400'}`} />
                      <span>{isAr ? item.labelAr : item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-200 dark:border-white/10">
                <Link
                  href="/dashboard"
                  onClick={onMobileClose}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <span>{isAr ? 'العودة للتطبيق' : 'Back to App'}</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
