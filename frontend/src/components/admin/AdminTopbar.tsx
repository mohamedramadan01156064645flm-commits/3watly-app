"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Shield, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { formatTopbarName, resolveDisplayName } from '@/utils/formatName';

const BREADCRUMBS: Record<string, { label: string; labelAr: string }> = {
  '/admin': { label: 'Dashboard', labelAr: 'الواجهة الرئيسية' },
  '/admin/users': { label: 'Users', labelAr: 'المستخدمون' },
  '/admin/resources': { label: 'Resources', labelAr: 'المصادر التعليمية' },
  '/admin/analytics': { label: 'Analytics', labelAr: 'التحليلات' },
  '/admin/audit-logs': { label: 'Audit Logs', labelAr: 'سجل العمليات' },
  '/admin/settings': { label: 'Settings', labelAr: 'الإعدادات' },
};

interface AdminTopbarProps {
  onOpenMobile?: () => void;
}

export function AdminTopbar({ onOpenMobile }: AdminTopbarProps) {
  const { isAr } = useLanguage();
  const { user, isOwner } = useAuth();
  const pathname = usePathname();

  const displayName = formatTopbarName(
    resolveDisplayName({ fullName: user?.fullName, email: user?.email, isAr }),
    isAr
  );

  const currentCrumb = BREADCRUMBS[pathname] ?? { label: 'Admin', labelAr: 'استوديو الإدارة' };

  const roleLabel = isOwner
    ? (isAr ? 'مالك المنصة' : 'Platform Owner')
    : (isAr ? 'مسؤول' : 'Admin');

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-blue-50/70 via-white/60 to-blue-50/70 dark:bg-gradient-to-r dark:from-[#0B1E45]/60 dark:via-[#07132B]/75 dark:to-[#0B1E45]/60 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200 shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

        {/* Start / Left: Profile pill + Toggles */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onOpenMobile && (
            <button
              type="button"
              onClick={onOpenMobile}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 p-1.5 pe-3.5 rounded-2xl bg-white/70 dark:bg-gradient-to-r dark:from-[#0D2452]/50 dark:to-[#091735]/60 border border-slate-200 dark:border-cyan-500/25 shadow-sm backdrop-blur-md">
            <UserAvatar
              avatarUrl={user?.avatarUrl}
              name={displayName}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
                {displayName}
              </span>
              <span className={`text-[10px] font-bold ${isOwner ? 'text-amber-500 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                {roleLabel}
              </span>
            </div>
          </div>

          <ThemeToggle />
          <LanguageToggle />
        </div>

        {/* End / Right: Breadcrumb Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/70 dark:bg-gradient-to-r dark:from-[#0D2452]/40 dark:to-[#081838]/50 border border-slate-200 dark:border-cyan-500/25 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <Link
              href="/admin"
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            >
              {isAr ? 'استوديو الإدارة' : 'Admin Studio'}
            </Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180" />
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {isAr ? currentCrumb.labelAr : currentCrumb.label}
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
