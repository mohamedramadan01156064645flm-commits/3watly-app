"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import type { JobItem } from '@/data/jobs';

export interface JobNotification {
  id: string;
  jobId: string;
  title: string;
  titleAr: string;
  company: string;
  companyAr: string;
  location: string;
  locationAr: string;
  matchScore: number;
  time: string;
  timeAr: string;
  url: string;
  read: boolean;
  description: string;
  descriptionAr: string;
}

/** Maximum age of notifications to display (in days). */
const NOTIFICATION_RETENTION_DAYS = 14;

/**
 * Build a per-user localStorage key so read/unread state is isolated
 * between different user accounts while also syncing with a global fallback.
 */
function getStorageKey(userId: string | undefined): string {
  if (userId) return `3watly_read_notifications_${userId}`;
  return '3watly_read_notifications_anonymous';
}

/**
 * Calculate the cutoff date for the notification display window.
 * Returns the retention cutoff (last 14 days) so newly scraped active jobs
 * are always presented to the candidate.
 */
function getNotificationCutoff(): string {
  const now = new Date();
  const retentionCutoff = new Date(now.getTime() - NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  return retentionCutoff.toISOString();
}

export function useNotifications() {
  const { isAr } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<JobNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Per-user storage key — changes when user changes
  const storageKey = getStorageKey(user?.id);

  // Helper to get read IDs from both per-user and global localStorage
  const getReadIds = useCallback((): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    const ids = new Set<string>();
    try {
      const rawUser = localStorage.getItem(storageKey);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (Array.isArray(parsed)) parsed.forEach(id => ids.add(String(id)));
      }
      const rawGlobal = localStorage.getItem('3watly_read_notifications_global');
      if (rawGlobal) {
        const parsed = JSON.parse(rawGlobal);
        if (Array.isArray(parsed)) parsed.forEach(id => ids.add(String(id)));
      }
    } catch {}
    return ids;
  }, [storageKey]);

  // Fetch real matched jobs from the live database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      // Extract candidate skills and target role from parsed CV or active CV versions
      let userSkills = '';
      let targetRole = '';
      if (typeof window !== 'undefined') {
        try {
          const parsed = localStorage.getItem('3watly_parsed_cv');
          if (parsed) {
            const data = JSON.parse(parsed);
            if (Array.isArray(data.skills) && data.skills.length > 0) {
              userSkills = data.skills.join(',');
            }
            targetRole = data.targetRole || data.currentTitle || '';
          }
          if (!userSkills) {
            const versionsRaw = localStorage.getItem('3watly_cv_versions');
            if (versionsRaw) {
              const vers = JSON.parse(versionsRaw);
              if (Array.isArray(vers) && vers[0]?.cvData?.skills) {
                const sList: string[] = [];
                vers[0].cvData.skills.forEach((g: any) => {
                  if (Array.isArray(g.skills)) sList.push(...g.skills);
                });
                if (sList.length > 0) userSkills = sList.join(',');
              }
              if (!targetRole && vers?.[0]?.targetRole) {
                targetRole = vers[0].targetRole;
              }
            }
          }
        } catch {}
      }

      const cutoff = getNotificationCutoff();

      const params = new URLSearchParams({
        limit: '100',
        sortBy: 'recent',
        postedAfter: cutoff,
      });
      if (userSkills) params.set('skills', userSkills);
      if (targetRole) params.set('targetRole', targetRole);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch job notifications');

      const data = await res.json();
      const jobs: (JobItem & { postedAt?: string | null })[] = Array.isArray(data.jobs) ? data.jobs : [];

      const readIds = getReadIds();

      // Only notify for jobs that actually match the candidate (matchScore >= 50%),
      // sorted by match score descending so top opportunities are highlighted first
      const matchedJobs = jobs
        .filter(j => (j.matchScore || 0) >= 50)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      const finalJobs = matchedJobs.length > 0
        ? matchedJobs
        : jobs.filter(j => (j.matchScore || 0) >= 35).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      const notifs: JobNotification[] = finalJobs.slice(0, 8).map((job) => {
        const notifId = `notif_${job.id}`;
        const isRead = readIds.has(notifId);

        const descEn = `${job.matchScore}% Match · ${job.company} in ${job.location}`;
        const descAr = `مطابقة بنسبة ${job.matchScore}% · شركة ${job.companyAr || job.company} في ${job.locationAr || job.location}`;

        return {
          id: notifId,
          jobId: job.id,
          title: job.title || 'New Job Opportunity',
          titleAr: job.titleAr || job.title || 'فرصة عمل جديدة',
          company: job.company || 'Company',
          companyAr: job.companyAr || job.company || 'جهة العمل',
          location: job.location || 'Cairo, Egypt',
          locationAr: job.locationAr || job.location || 'القاهرة، مصر',
          matchScore: job.matchScore || 80,
          time: job.postedAgo || 'Recently',
          timeAr: job.postedAgoAr || 'مؤخراً',
          url: `/jobs/${job.id}`,
          read: isRead,
          description: descEn,
          descriptionAr: descAr,
        };
      });

      setNotifications(notifs);
    } catch (err) {
      console.warn('Error fetching dynamic notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [getReadIds]);

  // Initial fetch and refetch when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, user?.id]);

  // Periodic polling every 60s & on window focus / custom events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000);

    const onFocus = () => fetchNotifications();
    // Defer event-triggered fetches by one tick to prevent "setState during render" React warnings
    const onJobsUpdated = () => setTimeout(() => fetchNotifications(), 0);

    window.addEventListener('focus', onFocus);
    window.addEventListener('3watly_jobs_updated', onJobsUpdated);
    window.addEventListener('3watly_active_cv_changed', onJobsUpdated);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('3watly_jobs_updated', onJobsUpdated);
      window.removeEventListener('3watly_active_cv_changed', onJobsUpdated);
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    try {
      const readIds = getReadIds();
      readIds.add(notificationId);
      const arr = Array.from(readIds);
      localStorage.setItem(storageKey, JSON.stringify(arr));
      localStorage.setItem('3watly_read_notifications_global', JSON.stringify(arr));
    } catch {}
  }, [getReadIds, storageKey]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const readIds = getReadIds();
      notifications.forEach((n) => readIds.add(n.id));
      const arr = Array.from(readIds);
      localStorage.setItem(storageKey, JSON.stringify(arr));
      localStorage.setItem('3watly_read_notifications_global', JSON.stringify(arr));
    } catch {}
  }, [notifications, getReadIds, storageKey]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
  };
}
