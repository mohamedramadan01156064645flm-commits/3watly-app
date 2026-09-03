"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  FileCheck2,
  FileText, 
  Settings, 
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AppSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({
  mobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAr } = useLanguage();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success(isAr ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
    router.push('/login');
  };

  const navGroups = isAr
    ? [
        {
          group: "الرئيسية",
          items: [
            { label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
            { label: "الوظائف والفرص", href: "/jobs", icon: Briefcase },
          ]
        },
        {
          group: "أدوات السيرة والمهارات",
          items: [
            { label: "فاحص الـ ATS والتشخيص", href: "/ats-diagnostics", icon: FileCheck2 },
            { label: "صانع السيرة الذاتية", href: "/cv-builder", icon: FileText },
            { label: "فجوة المهارات وتطويرها", href: "/skills", icon: Zap },
          ]
        },
        {
          group: "السوق والذكاء الاصطناعي",
          items: [
            { label: "مؤشرات سوق العمل", href: "/market", icon: TrendingUp },
            { label: "المساعد الذكي (Copilot)", href: "/copilot", icon: Sparkles },
          ]
        }
      ]
    : [
        {
          group: "MAIN",
          items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { label: "Jobs & Opportunities", href: "/jobs", icon: Briefcase },
          ]
        },
        {
          group: "CV & SKILLS TOOLS",
          items: [
            { label: "ATS Diagnostics & Checker", href: "/ats-diagnostics", icon: FileCheck2 },
            { label: "Smart CV Builder", href: "/cv-builder", icon: FileText },
            { label: "Skill Gap Matrix", href: "/skills", icon: Zap },
          ]
        },
        {
          group: "MARKET & AI",
          items: [
            { label: "Market Intelligence", href: "/market", icon: TrendingUp },
            { label: "AI Career Copilot", href: "/copilot", icon: Sparkles },
          ]
        }
      ];

  const sidebarContent = (
    <div className={`flex h-full flex-col justify-between bg-white dark:bg-[#070C18] text-slate-900 dark:text-[#F8FAFC] ${
      isCollapsed ? 'p-3' : 'p-4 sm:p-5'
    } select-none overflow-hidden transition-all duration-300`}>
      
      {/* Top Area: Logo + Nav Items */}
      <div className="space-y-4">
        
        {/* Brand Header with Collapse Toggle Button */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'} px-1 pt-1 pb-1`}>
          <Link href="/" className="transition-transform hover:scale-105" title="3WATLY | عواطلي">
            <Logo size="md" iconOnly={isCollapsed} />
          </Link>

          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? (isAr ? 'توسيع القائمة' : 'Expand Sidebar') : (isAr ? 'طي القائمة' : 'Collapse Sidebar')}
              className="hidden lg:flex p-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs"
            >
              {isCollapsed ? (
                <PanelLeftOpen className={`w-4.5 h-4.5 ${isAr ? 'rotate-180' : ''}`} />
              ) : (
                <PanelLeftClose className={`w-4.5 h-4.5 ${isAr ? 'rotate-180' : ''}`} />
              )}
            </button>
          )}

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-white/[0.08]" />

        {/* Nav Groups */}
        <nav className="space-y-3.5">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isCollapsed ? (
                <span className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                  {group.group}
                </span>
              ) : (
                <div className="h-px bg-slate-100 dark:bg-white/5 my-2 mx-1" />
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === '/jobs' && pathname.startsWith('/jobs'));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={item.label}
                      className={`flex items-center ${
                        isCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3.5 px-3.5 py-2.5 rounded-xl'
                      } text-[13.5px] font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-[#1B57E0] dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-white font-bold shadow-md shadow-blue-600/25 ring-1 ring-blue-500/20 dark:ring-white/10'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-white/[0.08] active:scale-[0.98]'
                      }`}
                    >
                      <Icon className={`${isCollapsed ? 'w-5.5 h-5.5' : 'w-4.5 h-4.5'} shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-[#1B57E0] dark:group-hover:text-blue-400'
                      }`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </div>

      {/* Bottom Area: Settings + Logout only */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] space-y-1.5">
        
        {/* Settings link */}
        <Link
          href="/settings"
          onClick={onCloseMobile}
          title={isAr ? "الإعدادات" : "Settings"}
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3.5 px-3.5 py-2.5 rounded-xl'
          } text-[13.5px] font-semibold transition-all duration-150 group ${
            pathname === '/settings'
              ? 'bg-[#1B57E0] dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-white font-bold shadow-md shadow-blue-600/25 ring-1 ring-blue-500/20 dark:ring-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-white/[0.08] active:scale-[0.98]'
          }`}
        >
          <Settings className={`${isCollapsed ? 'w-5.5 h-5.5' : 'w-4.5 h-4.5'} transition-transform duration-150 group-hover:rotate-45 ${
            pathname === '/settings' ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-[#1B57E0] dark:group-hover:text-blue-400'
          }`} />
          {!isCollapsed && <span>{isAr ? "الإعدادات" : "Settings"}</span>}
        </Link>

        {/* Direct Log Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          title={isAr ? "تسجيل الخروج" : "Log out"}
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3.5 px-3.5 py-2.5'
          } w-full text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-150 cursor-pointer group active:scale-[0.98]`}
        >
          <LogOut className={`${isCollapsed ? 'w-5.5 h-5.5' : 'w-4.5 h-4.5'} text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5`} />
          {!isCollapsed && <span>{isAr ? "تسجيل الخروج" : "Log out"}</span>}
        </button>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className={`hidden lg:flex ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex-col fixed top-0 ltr:left-0 rtl:right-0 bottom-0 z-40 border-r rtl:border-r-0 rtl:border-l border-slate-200/90 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
