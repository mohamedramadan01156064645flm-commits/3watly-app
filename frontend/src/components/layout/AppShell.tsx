"use client";

import React, { useState, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function AppShell({ children, title, subtitle, showSearch = true }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('majra-sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('majra-sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F8FAFC] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex transition-colors duration-300">
      
      {/* Dynamic Background Graphics */}
      <div 
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 bg-[url('/backgrounds/dashboard-light.png')] dark:bg-[url('/backgrounds/dashboard-dark.png')] opacity-100 dark:opacity-90"
      />

      {/* Shared Collapsible Sidebar */}
      <AppSidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={() => setMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Area */}
      <div className={`relative z-10 flex-1 flex flex-col min-w-0 ${
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
        <main className="flex-1 p-4 sm:p-7 lg:p-8 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
