"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Search, ChevronLeft, ChevronRight, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminGuard } from '@/components/admin/AdminGuard';

interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  'user.role_change': 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30',
  'user.status_change': 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/30',
  'resource.create': 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30',
  'resource.update': 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  'resource.delete': 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30',
  'resources.seed_catalog': 'bg-purple-500/15 text-purple-500 dark:text-purple-400 border-purple-500/30',
};

function formatDate(iso: string, isAr: boolean) {
  try {
    return new Date(iso).toLocaleString(isAr ? 'ar-EG' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return iso; }
}

function AuditLogsContent() {
  const { isAr } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 25;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(search ? { action: search } : {}),
      });
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white/70 to-blue-100/60 dark:bg-gradient-to-r dark:from-[#0D2452]/60 dark:via-[#091738]/70 dark:to-[#061026]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-cyan-500/25 shadow-xl shadow-cyan-950/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-500" />
            {isAr ? 'سجل العمليات الإدارية (Audit Logs)' : 'Administrative Audit Logs'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {isAr ? `${total.toLocaleString()} عملية مسجلة في النظام (حصرية للمالك)` : `${total.toLocaleString()} logged operations (Owner only)`}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-white/70 dark:bg-[#0D2452]/50 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#12316B]/60 transition-all cursor-pointer disabled:opacity-50 self-start shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={isAr ? 'بحث في أسماء الإجراءات...' : 'Filter by action name...'}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white/80 dark:bg-gradient-to-r dark:from-[#0B1E45]/60 dark:to-[#07132B]/70 border border-slate-200 dark:border-cyan-500/25 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 shadow-xs backdrop-blur-md"
        />
      </div>

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
                <th className="text-start px-6 py-4">{isAr ? 'الإجراء' : 'Action'}</th>
                <th className="text-start px-6 py-4">{isAr ? 'المنفذ' : 'Actor'}</th>
                <th className="text-start px-6 py-4 hidden md:table-cell">{isAr ? 'الهدف والبيانات' : 'Target & Data'}</th>
                <th className="text-start px-6 py-4">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/8 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : logs.length === 0
                ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                      {isAr ? 'لا توجد سجلات بعد.' : 'No audit logs yet.'}
                    </td>
                  </tr>
                )
                : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border font-mono font-bold ${
                        ACTION_COLORS[log.action] ?? 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-400/20'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 font-mono">
                        {log.actor_email || log.actor_id || 'System'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {log.target_type ? `${log.target_type}:${log.target_id || ''}` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(log.created_at, isAr)}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-2">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <AdminGuard requireOwner>
      <AuditLogsContent />
    </AdminGuard>
  );
}
