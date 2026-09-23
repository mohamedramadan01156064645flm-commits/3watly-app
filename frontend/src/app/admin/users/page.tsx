"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, ChevronLeft, ChevronRight,
  Shield, UserX, UserCheck, MoreHorizontal, RefreshCw, AlertTriangle, Crown,
  Trash2, X, AlertCircle, CheckCircle2, Clock, Sparkles, Check
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface AdminUser {
  id: string;
  full_name: string | null;
  email: string;
  role: 'owner' | 'admin' | 'user';
  account_status: 'active' | 'suspended';
  created_at: string;
  updated_at?: string;
  last_seen_at?: string;
  is_online?: boolean;
  onboarding_completed: boolean;
  avatar_url?: string | null;
}

type ActionModalType = 'make_owner' | 'make_admin' | 'make_user' | 'suspend' | 'activate';

interface ActionModalState {
  user: AdminUser;
  action: ActionModalType;
}

const ROLE_BADGE: Record<string, string> = {
  owner: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold',
  admin: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 font-bold',
  user: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-400/20 font-semibold',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold',
  suspended: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 font-semibold',
};

function formatDate(iso: string, isAr: boolean) {
  try {
    return new Date(iso).toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch { return iso; }
}

function formatLastSeen(iso: string | undefined, isOnline: boolean | undefined, isAr: boolean) {
  if (isOnline) {
    return isAr ? 'نشط الآن' : 'Active now';
  }
  if (!iso) {
    return isAr ? 'منذ فترة' : 'Recently';
  }
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMin = Math.floor(diffMs / (60 * 1000));
    if (diffMin < 1) return isAr ? 'منذ لحظات' : 'Just now';
    if (diffMin < 60) return isAr ? `منذ ${diffMin} دقيقة` : `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      if (isAr) {
        if (diffHours === 1) return 'منذ ساعة';
        if (diffHours === 2) return 'منذ ساعتين';
        if (diffHours <= 10) return `منذ ${diffHours} ساعات`;
        return `منذ ${diffHours} ساعة`;
      }
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      if (isAr) {
        if (diffDays === 1) return 'أمس';
        if (diffDays === 2) return 'منذ يومين';
        return `منذ ${diffDays} أيام`;
      }
      return `${diffDays}d ago`;
    }
    return new Date(iso).toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function AdminUsersPage() {
  const { isAr } = useLanguage();
  const { user, isOwner } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'owner' | 'admin' | 'user' | 'online'>('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Professional Delete Modal States
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Professional Promotion & Role/Status Action Modal States (Point 11)
  const [actionModal, setActionModal] = useState<ActionModalState | null>(null);
  const [actionModalLoading, setActionModalLoading] = useState(false);
  const [actionModalError, setActionModalError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const LIMIT = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const roleParam = activeTab === 'all' || activeTab === 'online' ? '' : activeTab;
      const presenceParam = activeTab === 'online' ? 'online' : '';

      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(search ? { search } : {}),
        ...(roleParam ? { role: roleParam } : {}),
        ...(presenceParam ? { presence: presenceParam } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTab, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (userToDelete && !deleteLoading) setUserToDelete(null);
        if (actionModal && !actionModalLoading) setActionModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userToDelete, deleteLoading, actionModal, actionModalLoading]);

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/users?userId=${userToDelete.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || (isAr ? 'فشل حذف المستخدم، يرجى المحاولة مرة أخرى.' : 'Failed to delete user. Please try again.'));
        return;
      }
      const targetName = userToDelete.full_name || userToDelete.email;
      setUserToDelete(null);
      setSuccessMessage(
        isAr
          ? `تم حذف المستخدم "${targetName}" نهائياً بنجاح.`
          : `User "${targetName}" has been permanently deleted.`
      );
      setTimeout(() => setSuccessMessage(null), 4500);
      await fetchUsers();
    } catch (e: any) {
      setDeleteError(isAr ? 'حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.' : 'Network error. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Execute Role or Status Change via Confirmation Modal (Point 11)
  const handleConfirmAction = async () => {
    if (!actionModal) return;
    setActionModalLoading(true);
    setActionModalError(null);

    try {
      const updates: { role?: string; accountStatus?: string } = {};
      if (actionModal.action === 'make_owner') updates.role = 'owner';
      if (actionModal.action === 'make_admin') updates.role = 'admin';
      if (actionModal.action === 'make_user') updates.role = 'user';
      if (actionModal.action === 'suspend') updates.accountStatus = 'suspended';
      if (actionModal.action === 'activate') updates.accountStatus = 'active';

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: actionModal.user.id, ...updates }),
      });

      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionModalError(d.error || (isAr ? 'فشل تحديث الصلاحيات، يرجى المحاولة مرة أخرى.' : 'Failed to update user.'));
        return;
      }

      const targetName = actionModal.user.full_name || actionModal.user.email;
      let msg = '';
      if (actionModal.action === 'make_owner') {
        msg = isAr ? `تمت ترقية "${targetName}" إلى مالك للمنصة (Owner) بنجاح 👑` : `Promoted "${targetName}" to Owner 👑`;
      } else if (actionModal.action === 'make_admin') {
        msg = isAr ? `تمت ترقية "${targetName}" إلى مسؤول (Admin) بنجاح 🛡️` : `Promoted "${targetName}" to Admin 🛡️`;
      } else if (actionModal.action === 'make_user') {
        msg = isAr ? `تم تحويل "${targetName}" إلى مستخدم عادي بنجاح.` : `Changed "${targetName}" to regular user.`;
      } else if (actionModal.action === 'suspend') {
        msg = isAr ? `تم تعليق وتجميد حساب "${targetName}".` : `Suspended account "${targetName}".`;
      } else {
        msg = isAr ? `تم تنشيط وتفعيل حساب "${targetName}" بنجاح.` : `Activated account "${targetName}".`;
      }

      setActionModal(null);
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 4500);
      await fetchUsers();
    } catch (e: any) {
      setActionModalError(isAr ? 'خطأ في الاتصال بالشبكة.' : 'Network error.');
    } finally {
      setActionModalLoading(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6 pb-12">
      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage(null)} className="p-1 rounded-lg hover:bg-emerald-500/15 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{actionError}</span>
          </div>
          <button type="button" onClick={() => setActionError(null)} className="p-1 rounded-lg hover:bg-red-500/15 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white/70 to-blue-100/60 dark:bg-gradient-to-r dark:from-[#0D2452]/60 dark:via-[#091738]/70 dark:to-[#061026]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-cyan-500/25 shadow-xl shadow-cyan-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isAr ? 'إدارة المستخدمين والصلاحيات v2.0' : 'User Accounts & Roles v2.0'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
            {isAr ? 'إدارة حسابات المستخدمين والتواجد' : 'User Accounts & Presence'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {isAr ? `${total.toLocaleString()} مستخدم مسجل مع تتبع النشاط وحالة التواجد المباشرة` : `${total.toLocaleString()} registered users with live presence tracking`}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-white/70 dark:bg-[#0D2452]/50 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12316B]/60 transition-all cursor-pointer disabled:opacity-50 self-start shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {isAr ? 'تحديث البيانات' : 'Refresh Data'}
        </button>
      </div>

      {/* Structured Modern Filter System (Point 14) */}
      <div className="space-y-3.5">
        {/* Row 1: Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: isAr ? 'الكل' : 'All Users', icon: Users },
            { id: 'online', label: isAr ? '🟢 النشطون الآن' : '🟢 Online Now', icon: Sparkles },
            { id: 'owner', label: isAr ? '👑 الملاك' : '👑 Owners', icon: Crown },
            { id: 'admin', label: isAr ? '🛡️ المسؤولون' : '🛡️ Admins', icon: Shield },
            { id: 'user', label: isAr ? '👤 المستخدمون' : '👤 Regular Users', icon: UserCheck },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id as any); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                  active
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                    : 'bg-white/80 dark:bg-[#0B1E45]/60 text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-cyan-500/20 hover:border-slate-300 dark:hover:border-cyan-500/40'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Search Input + Status Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isAr ? 'بحث بالاسم، البريد الإلكتروني أو المعرف...' : 'Search by name, email or ID...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full ps-10 pe-10 py-2.5 rounded-xl bg-white/90 dark:bg-gradient-to-r dark:from-[#0B1E45]/60 dark:to-[#07132B]/70 border border-slate-200 dark:border-cyan-500/25 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 shadow-xs backdrop-blur-md"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Account Status Filter */}
          <div className="w-full sm:w-52">
            <CustomDropdown
              options={[
                { value: '', label: isAr ? 'كل الحالات' : 'All Statuses' },
                { value: 'active', label: isAr ? '🟢 مفعّل ونشط' : '🟢 Active' },
                { value: 'suspended', label: isAr ? '🔴 معلق ومجمد' : '🔴 Suspended' },
              ]}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-gradient-to-b from-blue-50/60 via-white/70 to-blue-50/60 dark:bg-gradient-to-b dark:from-[#0B1E45]/55 dark:via-[#07132B]/65 dark:to-[#040C1E]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#0E2656]/30 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <th className="text-start px-6 py-4">{isAr ? 'المستخدم' : 'User'}</th>
                <th className="text-center px-6 py-4">{isAr ? 'الدور' : 'Role'}</th>
                <th className="text-center px-6 py-4">{isAr ? 'آخر ظهور' : 'Last Seen'}</th>
                <th className="text-start px-6 py-4 hidden md:table-cell">{isAr ? 'تاريخ التسجيل' : 'Joined'}</th>
                <th className="text-end px-6 py-4">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/6">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/8 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                      {isAr ? 'لا يوجد مستخدمون مطابقون لمعايير البحث.' : 'No users match your criteria.'}
                    </td>
                  </tr>
                )
                : users.map((u) => {
                  const isCurrentUser = Boolean(user?.email && u.email.toLowerCase() === user.email.toLowerCase());
                  const displayName = u.full_name || u.email.split('@')[0];
                  const initial = displayName[0]?.toUpperCase() || 'U';

                  return (
                    <tr
                      key={u.id}
                      className={`
                        border-b border-slate-200/90 dark:border-white/10 transition-colors group
                        ${isCurrentUser
                          ? 'bg-amber-500/10 dark:bg-amber-500/15 border-s-4 border-s-amber-500 hover:bg-amber-500/15'
                          : 'hover:bg-slate-50/90 dark:hover:bg-cyan-500/5'
                        }
                      `}
                    >
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          {/* Avatar Image or Fallback with Online indicator */}
                          <div className="relative shrink-0">
                            {u.avatar_url ? (
                              <img
                                src={u.avatar_url}
                                alt={displayName}
                                className={`w-10 h-10 rounded-full object-cover border ${isCurrentUser ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 dark:border-cyan-500/30'} shadow-sm`}
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${isCurrentUser ? 'from-amber-500 to-orange-600' : 'from-cyan-500 to-indigo-600'} text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0 border border-white/20`}>
                                {initial}
                              </div>
                            )}
                            {u.is_online && (
                              <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#07132B] shadow-xs" title={isAr ? 'نشط الآن' : 'Online'} />
                            )}
                            {isCurrentUser && (
                              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] shadow-sm">
                                👑
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
                                {u.full_name || '—'}
                              </p>
                              {isCurrentUser && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-xs">
                                  {isAr ? 'أنت (حسابك الحالي)' : 'You (Current Account)'}
                                </span>
                              )}
                              {u.account_status === 'suspended' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                                  {isAr ? 'معلق' : 'Suspended'}
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5 text-center">
                        <span className={`inline-block text-[11px] px-3 py-0.5 rounded-full border font-bold ${ROLE_BADGE[u.role] ?? ROLE_BADGE.user}`}>
                          {u.role === 'owner' ? (isAr ? '👑 المالك' : '👑 Owner') : u.role === 'admin' ? (isAr ? '🛡️ مسؤول' : '🛡️ Admin') : (isAr ? '👤 مستخدم' : '👤 User')}
                        </span>
                      </td>

                      {/* Last Seen / Presence (Point 14) */}
                      <td className="px-6 py-4.5 text-center">
                        {u.is_online ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {isAr ? 'نشط الآن' : 'Active Now'}
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatLastSeen(u.last_seen_at || u.updated_at, false, isAr)}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4.5 hidden md:table-cell">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{formatDate(u.created_at, isAr)}</span>
                      </td>

                      <td className="px-6 py-4.5 text-end">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                            disabled={actionLoading === u.id}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-40"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {openMenu === u.id && (
                            <div className="absolute end-0 mt-1.5 w-60 rounded-2xl bg-white/95 dark:bg-[#07132B]/95 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/30 shadow-2xl z-30 py-1.5 overflow-hidden animate-in fade-in zoom-in-95">
                              {/* Delete User */}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null);
                                  setDeleteError(null);
                                  setUserToDelete(u);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-start"
                              >
                                <Trash2 className="w-4 h-4" />
                                {isAr ? 'حذف المستخدم' : 'Delete User'}
                              </button>

                              {/* Status Toggle (Suspend / Activate) */}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null);
                                  setActionModalError(null);
                                  setActionModal({
                                    user: u,
                                    action: u.account_status === 'active' ? 'suspend' : 'activate'
                                  });
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-start"
                              >
                                {u.account_status === 'active' ? (
                                  <>
                                    <UserX className="w-4 h-4 text-amber-500" />
                                    {isAr ? 'تعليق الحساب مؤقتاً' : 'Suspend Account'}
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 text-emerald-500" />
                                    {isAr ? 'رفع التعليق وتنشيط الحساب' : 'Activate Account'}
                                  </>
                                )}
                              </button>

                              {/* Role changes — owner only (Point 11: opens Modal) */}
                              {isOwner && (
                                <>
                                  <div className="border-t border-slate-100 dark:border-white/8 my-1" />
                                  {u.role !== 'owner' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenu(null);
                                        setActionModalError(null);
                                        setActionModal({ user: u, action: 'make_owner' });
                                      }}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer text-start"
                                    >
                                      <Crown className="w-4 h-4 text-amber-500" />
                                      {isAr ? '👑 ترقية لمالك (Owner)' : '👑 Make Owner'}
                                    </button>
                                  )}
                                  {u.role !== 'admin' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenu(null);
                                        setActionModalError(null);
                                        setActionModal({ user: u, action: 'make_admin' });
                                      }}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors cursor-pointer text-start"
                                    >
                                      <Shield className="w-4 h-4" />
                                      {isAr ? '🛡️ ترقية لمسؤول (Admin)' : '🛡️ Make Admin'}
                                    </button>
                                  )}
                                  {u.role !== 'user' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenu(null);
                                        setActionModalError(null);
                                        setActionModal({ user: u, action: 'make_user' });
                                      }}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-start"
                                    >
                                      <UserCheck className="w-4 h-4" />
                                      {isAr ? '👤 تحويل لمستخدم عادي' : '👤 Make Regular User'}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-white/8 bg-slate-50/50 dark:bg-white/2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? `عرض ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} من ${total}`
                : `Showing ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} of ${total}`}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODAL 1: Role Change & Status Promotion Modal (Point 11) */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => !actionModalLoading && setActionModal(null)}
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#07132B] border border-slate-200/90 dark:border-cyan-500/30 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header with Custom Icon & Gradient */}
            <div className={`flex items-center justify-between p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 ${
              actionModal.action === 'make_owner'
                ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent'
                : actionModal.action === 'make_admin'
                ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent'
                : actionModal.action === 'suspend'
                ? 'bg-gradient-to-r from-red-500/15 via-rose-500/10 to-transparent'
                : 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                  actionModal.action === 'make_owner'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30'
                    : actionModal.action === 'make_admin'
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'
                    : actionModal.action === 'suspend'
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30'
                }`}>
                  {actionModal.action === 'make_owner' && <Crown className="w-5 h-5" />}
                  {actionModal.action === 'make_admin' && <Shield className="w-5 h-5" />}
                  {actionModal.action === 'make_user' && <UserCheck className="w-5 h-5" />}
                  {actionModal.action === 'suspend' && <UserX className="w-5 h-5" />}
                  {actionModal.action === 'activate' && <CheckCircle2 className="w-5 h-5" />}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {actionModal.action === 'make_owner' && (isAr ? 'تأكيد الترقية لمالك (Owner)' : 'Promote to Platform Owner')}
                    {actionModal.action === 'make_admin' && (isAr ? 'تأكيد الترقية لمسؤول (Admin)' : 'Promote to Admin')}
                    {actionModal.action === 'make_user' && (isAr ? 'تأكيد التحويل لمستخدم عادي' : 'Demote to Regular User')}
                    {actionModal.action === 'suspend' && (isAr ? 'تأكيد تعليق الحساب' : 'Suspend User Account')}
                    {actionModal.action === 'activate' && (isAr ? 'تأكيد تنشيط الحساب' : 'Activate User Account')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'يرجى مراجعة تفاصيل التغيير قبل التأكيد' : 'Please review details before confirming.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !actionModalLoading && setActionModal(null)}
                disabled={actionModalLoading}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* User Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/4 border border-slate-200/80 dark:border-white/8 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                  {(actionModal.user.full_name || actionModal.user.email)[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {actionModal.user.full_name || actionModal.user.email.split('@')[0]}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${ROLE_BADGE[actionModal.user.role] ?? ROLE_BADGE.user}`}>
                      {actionModal.user.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                    {actionModal.user.email}
                  </p>
                </div>
              </div>

              {/* Description & Impact Notice */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                actionModal.action === 'make_owner'
                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-900 dark:text-amber-200'
                  : actionModal.action === 'suspend'
                  ? 'bg-red-500/10 border-red-500/25 text-red-900 dark:text-red-200'
                  : 'bg-blue-500/10 border-blue-500/25 text-blue-900 dark:text-blue-200'
              }`}>
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    {actionModal.action === 'make_owner' && (isAr ? 'تنبيه أمني لصلاحيات المالك:' : 'Security Notice for Owner Role:')}
                    {actionModal.action === 'make_admin' && (isAr ? 'صلاحيات الإدارة:' : 'Admin Privileges:')}
                    {actionModal.action === 'make_user' && (isAr ? 'إلغاء الصلاحيات:' : 'Revoke Privileges:')}
                    {actionModal.action === 'suspend' && (isAr ? 'تأثير التعليق:' : 'Suspension Impact:')}
                    {actionModal.action === 'activate' && (isAr ? 'تفعيل الحساب:' : 'Account Activation:')}
                  </p>
                  <p className="text-[11.5px] leading-normal opacity-90">
                    {actionModal.action === 'make_owner' && (
                      isAr
                        ? 'أنت على وشك منح هذا الحساب صلاحية "مالك المنصة" (Owner). سيكون له كامل الصلاحيات لإدارة جميع المستخدمين، تعيين أو سحب الأدوار، وحذف أي حسابات.'
                        : 'You are granting this user Owner status. They will have complete platform access, role management, and deletion authority.'
                    )}
                    {actionModal.action === 'make_admin' && (
                      isAr
                        ? 'سيتم منح المستخدم صلاحية "مسؤول" (Admin) للوصول إلى لوحة التحكم، استعراض السير الذاتية وإدارة المصادر التعليمية.'
                        : 'Granting Admin role will allow this user to access the Admin Studio, inspect CV documents, and manage resources.'
                    )}
                    {actionModal.action === 'make_user' && (
                      isAr
                        ? 'سيتم إرجاع الحساب إلى مستخدم عادي وإلغاء كافة الصلاحيات الإدارية الخاصة به فوراً.'
                        : 'This user will be demoted to a regular user and all administrative privileges will be revoked.'
                    )}
                    {actionModal.action === 'suspend' && (
                      isAr
                        ? 'سيتم تجميد وتعليق هذا الحساب ومنعه من تسجيل الدخول أو استخدام المنصة حتى يتم رفع التعليق يدوياً.'
                        : 'The account will be suspended and blocked from accessing any platform services.'
                    )}
                    {actionModal.action === 'activate' && (
                      isAr
                        ? 'سيتم تفعيل الحساب فوراً والسماح للمستخدم بالدخول مجدداً إلى خدمات المنصة بصورة طبيعية.'
                        : 'The account will be unlocked and the user can sign in normally.'
                    )}
                  </p>
                </div>
              </div>

              {/* Error inside modal */}
              {actionModalError && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="font-medium">{actionModalError}</p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 p-5 sm:p-6 pt-3 border-t border-slate-100 dark:border-white/8 bg-slate-50/50 dark:bg-white/2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                disabled={actionModalLoading}
                className="px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6 transition-colors cursor-pointer disabled:opacity-40"
              >
                {isAr ? 'إلغاء الأمر' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={actionModalLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                  actionModal.action === 'make_owner'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30'
                    : actionModal.action === 'suspend'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-600/30'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30'
                }`}
              >
                {actionModalLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري التنفيذ...' : 'Applying...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'تأكيد التغيير الآن' : 'Confirm Change'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: Delete Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => !deleteLoading && setUserToDelete(null)}
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#07132B] border border-slate-200/90 dark:border-red-500/30 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-red-500/15 via-rose-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {isAr ? 'تأكيد الحذف النهائي للمستخدم' : 'Confirm User Deletion'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'هذا الإجراء نهائي ولا يمكن التراجع عنه' : 'This action is permanent and irreversible.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !deleteLoading && setUserToDelete(null)}
                disabled={deleteLoading}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/4 border border-slate-200/80 dark:border-white/8 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                  {(userToDelete.full_name || userToDelete.email)[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {userToDelete.full_name || userToDelete.email.split('@')[0]}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${ROLE_BADGE[userToDelete.role] ?? ROLE_BADGE.user}`}>
                      {userToDelete.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                    {userToDelete.email}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/8 dark:bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs leading-relaxed flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-red-600 dark:text-red-400">
                    {isAr ? 'تحذير أمني هام:' : 'Important Security Warning:'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-[11.5px] leading-normal">
                    {isAr
                      ? 'سيتم حذف هذا الحساب نهائياً من قاعدة البيانات مع كافة السير الذاتية (CVs)، ونتائج التحليلات، وسجلات النشاط المرتبطة به. لا يمكن استعادة هذه البيانات بعد إتمام الحذف.'
                      : 'This account will be permanently deleted from the database along with all associated CVs, analysis results, and activity records.'}
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="font-medium">{deleteError}</p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 p-5 sm:p-6 pt-3 border-t border-slate-100 dark:border-white/8 bg-slate-50/50 dark:bg-white/2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleteLoading}
                className="px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6 transition-colors cursor-pointer disabled:opacity-40"
              >
                {isAr ? 'إلغاء الأمر' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري الحذف...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{isAr ? 'نعم، احذف نهائياً' : 'Yes, Delete Permanently'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
