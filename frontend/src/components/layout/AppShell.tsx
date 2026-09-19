"use client";

import React, { useState, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { useAuth } from '@/contexts/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  fixedLayout?: boolean;
  scrollSpacerHeight?: number;
}

export function AppShell({
  children,
  title,
  subtitle,
  showSearch = true,
  fixedLayout = false,
  scrollSpacerHeight
}: AppShellProps) {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Immediate protection: if user signs out and hits browser Back, redirect to landing page
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const hasSession = Boolean(
        localStorage.getItem('3watly_user') || localStorage.getItem('majra_user')
      );
      if (!loading && !user && !hasSession) {
        window.location.replace('/');
      }
    };

    checkAuthAndRedirect();

    // Prevent Back-Forward Cache (bfcache) restoration of authenticated pages
    const handlePageShow = (event: PageTransitionEvent) => {
      const hasSession = Boolean(
        localStorage.getItem('3watly_user') || localStorage.getItem('majra_user')
      );
      if (!hasSession) {
        window.location.replace('/');
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', checkAuthAndRedirect);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', checkAuthAndRedirect);
    };
  }, [user, loading]);

  useEffect(() => {
    const saved = localStorage.getItem('majra-sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  // When fixedLayout is used, disable smooth scroll on html to prevent animation feedback loops and jitter
  useEffect(() => {
    if (fixedLayout) {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      return () => {
        document.documentElement.style.scrollBehavior = prev;
      };
    }
  }, [fixedLayout]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('majra-sidebar-collapsed', String(next));
      return next;
    });
  };

  const hasSession = typeof window !== 'undefined'
    ? Boolean(localStorage.getItem('3watly_user') || localStorage.getItem('majra_user'))
    : true;

  if (!loading && !user && !hasSession) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F8FAFC] dark:bg-[#040816] text-[#1E293B] dark:text-[#F8FAFC] flex transition-colors duration-300">
      
      {/* Dynamic Background Graphics */}
      <div 
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 bg-[url('/backgrounds/dashboard-light.png')] dark:bg-[url('/backgrounds/dashboard-dark.png')] opacity-100 dark:opacity-90"
      />

      {/* Invisible dummy spacer to activate native browser window scrollbar when fixedLayout is used */}
      {fixedLayout && scrollSpacerHeight !== undefined && scrollSpacerHeight > 0 && (
        <div 
          aria-hidden="true"
          className="pointer-events-none opacity-0 select-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1px',
            height: `${scrollSpacerHeight}px`,
            zIndex: -1
          }}
        />
      )}

      {/* Shared Collapsible Sidebar */}
      <AppSidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={() => setMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Area */}
      <div className={`z-10 flex flex-col min-w-0 ${
        fixedLayout ? 'fixed inset-0' : 'relative flex-1'
      } ${
        isCollapsed ? 'lg:ltr:pl-20 lg:rtl:pr-20' : 'lg:ltr:pl-64 lg:rtl:pr-64'
      } transition-all duration-300`}>
        {/* Shared Topbar */}
        <AppTopbar 
          onOpenMobile={() => setMobileOpen(true)} 
          title={title} 
          subtitle={subtitle}
          showSearch={showSearch}
        />

        {/* Page Inner Content */}
        <main className={`flex-1 max-w-[1500px] w-full mx-auto ${
          fixedLayout
            ? 'p-4 sm:px-7 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col min-h-0'
            : 'p-4 sm:p-7 lg:p-8'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}
