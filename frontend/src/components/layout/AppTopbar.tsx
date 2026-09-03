"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Menu, 
  CheckCircle2, 
  TrendingUp, 
  Briefcase, 
  LogOut, 
  Settings, 
  User,
  ChevronDown,
  Camera,
  RotateCcw
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { UserAvatar, getInitials } from '@/components/ui/UserAvatar';
import { formatTopbarName, resolveDisplayName, buildDynamicGreeting } from '@/utils/formatName';
import { useNotifications } from '@/hooks/useNotifications';

interface AppTopbarProps {
  onOpenMobile?: () => void;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function AppTopbar({ 
  onOpenMobile, 
  title, 
  subtitle,
  showSearch = true 
}: AppTopbarProps) {
  const router = useRouter();
  const { isAr } = useLanguage();
  const { user, logout, updateAvatar } = useAuth();
  const { reset: resetOnboarding } = useOnboarding();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic user details
  const resolvedFullName = resolveDisplayName({
    fullName: user?.fullName,
    email: user?.email,
    isAr
  });
  const displayName = formatTopbarName(resolvedFullName, isAr);
  const userEmail = user?.email || (isAr ? 'حسابك في عواطلي' : 'Your 3WATLY Account');

  // Dynamic time-based greeting (5am-12pm Morning, 12pm-5pm Afternoon, 5pm-10pm Evening, 10pm-5am Night)
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    setCurrentHour(new Date().getHours());
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const rawFirstName = resolvedFullName && resolvedFullName !== 'User' && resolvedFullName !== 'مستخدم' && resolvedFullName !== '3WATLY User' && resolvedFullName !== 'مستخدم عواطلي'
    ? resolvedFullName.split(/\s+/)[0]
    : null;

  const dynamicGreeting = buildDynamicGreeting(
    rawFirstName,
    isAr,
    currentHour !== null ? currentHour : undefined
  );

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateAvatar(file);
  };

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close menus on outside click
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#060913]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      <div className="flex h-18 items-center justify-between px-4 sm:px-8 gap-4">
        
        {/* Left Side: Mobile Menu Button + Page Greeting/Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {onOpenMobile && (
            <button
              type="button"
              onClick={onOpenMobile}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-[17px] sm:text-[20px] font-black text-[#0B132B] dark:text-white leading-tight truncate">
              {title || dynamicGreeting}
            </h1>
            <p className="hidden sm:block text-[12.5px] font-normal text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {subtitle || (isAr ? "ملخص مسارك المهني وفرصك اليوم." : "Here's your career overview for today.")}
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        {showSearch && (
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <Search className="pointer-events-none absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن وظائف، مهارات، شركات..." : "Search jobs, skills, companies..."}
              className="w-full h-11 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#0B1120] text-[13.5px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </form>
        )}

        {/* Right Side: ThemeToggle + LanguageToggle + Notifications + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Language Switcher */}
          <LanguageToggle />

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-label={isAr ? "الإشعارات" : "Notifications"}
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute ltr:right-0 rtl:left-0 top-12 w-[calc(100vw-2rem)] max-w-[360px] sm:w-96 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">
                      {isAr ? "الوظائف المقترحة لك" : "Matched Job Offers"}
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {unreadCount} {isAr ? "جديد" : "new"}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllAsRead()}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {isAr ? "تحديد الكل كمقروء" : "Mark all read"}
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-80 overflow-y-auto ltr:pr-0.5 rtl:pl-0.5">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-500" />
                      <p className="text-[13px] font-medium">
                        {isAr ? "لا توجد إشعارات وظائف جديدة حالياً" : "No new job alerts at the moment"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {isAr ? "سنعلمك فور توفر وظائف تناسب ملفك الشخصي" : "We'll notify you as soon as matching jobs arrive"}
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button 
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markAsRead(n.id);
                          setNotifOpen(false);
                          router.push(n.url);
                        }}
                        className={`w-full text-left ltr:text-left rtl:text-right flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer border ${
                          n.read
                            ? 'border-transparent hover:bg-slate-50 dark:hover:bg-white/5 opacity-80'
                            : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50 shadow-xs'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-white dark:bg-[#131E35] border border-slate-200/80 dark:border-white/10 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[12.5px] font-bold text-slate-900 dark:text-slate-100 leading-snug truncate">
                              {isAr ? n.titleAr : n.title}
                            </p>
                            {!n.read && (
                              <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11.5px] text-slate-600 dark:text-slate-300 font-medium mt-0.5 line-clamp-1">
                            {isAr ? n.descriptionAr : n.description}
                          </p>
                          <span className="text-[10.5px] text-slate-400 mt-1 block">
                            {isAr ? n.timeAr : n.time}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <UserAvatar
                avatarUrl={user?.avatarUrl}
                name={displayName}
                size="sm"
              />

              <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                {displayName}
              </span>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute ltr:right-0 rtl:left-0 top-12 w-60 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100 dark:divide-white/5">
                {/* User Info Header */}
                <div className="p-3 flex items-center gap-3">
                  <UserAvatar
                    avatarUrl={user?.avatarUrl}
                    name={displayName}
                    size="md"
                    className="ring-2 ring-blue-500/30"
                  />

                  <div className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-bold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </span>
                    <span className="block text-[11px] text-slate-400 truncate">
                      {userEmail}
                    </span>
                  </div>
                </div>

                {/* Navigation Actions */}
                <div className="py-1.5 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{isAr ? "الملف الشخصي" : "My Profile"}</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>{isAr ? "الإعدادات" : "Settings"}</span>
                  </Link>
                </div>

                {/* Logout Action */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>{isAr ? "تسجيل الخروج" : "Log Out"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
