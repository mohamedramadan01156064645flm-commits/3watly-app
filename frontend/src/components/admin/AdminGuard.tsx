"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminGuardProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

/**
 * Client-side admin guard (Layer 1 of 3-layer security).
 * Renders children only if the user is admin or owner.
 * Layer 2 (server API) and Layer 3 (RLS) provide backend protection.
 */
export function AdminGuard({ children, requireOwner = false }: AdminGuardProps) {
  const { user, loading, isAdmin, isOwner } = useAuth();
  const { isAr } = useLanguage();
  const router = useRouter();

  // While session is loading, show a minimal spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#040816] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  // Not logged in — middleware should have already redirected, but guard against race
  if (!user) {
    router.replace('/login');
    return null;
  }

  // Insufficient role
  const hasAccess = requireOwner ? isOwner : isAdmin;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#040816] flex flex-col items-center justify-center gap-6 px-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20">
          <Shield className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold text-white mb-2">
            {isAr ? 'غير مصرح لك بالدخول' : 'Access Denied'}
          </h1>
          <p className="text-sm text-slate-400">
            {requireOwner
              ? (isAr ? 'هذه الصفحة مخصصة لمالك المنصة فقط.' : 'This page is restricted to the platform owner only.')
              : (isAr ? 'تحتاج صلاحيات مسؤول للوصول لهذه الصفحة.' : 'You need admin privileges to access this page.')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isAr ? 'العودة للوحة الرئيسية' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
