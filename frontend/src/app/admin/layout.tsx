"use client";

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAr } = useLanguage();

  return (
    <AdminGuard>
      <div
        className="min-h-screen bg-[#F4F7FC] dark:bg-[#040816] bg-[url('/images/admin/bg-light.png')] dark:bg-[url('/images/admin/bg-dark.png')] bg-cover bg-fixed bg-center flex text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Sidebar */}
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
