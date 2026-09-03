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
const NOTIFICATION_RETENTION_DAYS = 7;

/**
 * Build a per-user localStorage key so read/unread state is fully isolated
 * between different user accounts on the same browser/device.
 */
function getStorageKey(userId: string | undefined): string {
  if (userId) return `3watly_read_notifications_${userId}`;
  return '3watly_read_notifications_anonymous';
}

/**
 * Calculate the cutoff date for the notification display window.
 * Combines two rules:
 *   1. Never show notifications older than NOTIFICATION_RETENTION_DAYS (7 days)
 *   2. Never show notifications posted before the user signed up
 * Returns the MORE RECENT of the two dates as an ISO string.
 */
function getNotificationCutoff(userCreatedAt: string | undefined): string {
  const now = new Date();
  const retentionCutoff = new Date(now.getTime() - NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000);

  if (userCreatedAt) {
    const signupDate = new Date(userCreatedAt);
    // Use whichever is MORE recent — the 7-day window or the signup date
    const cutoff = signupDate > retentionCutoff ? signupDate : retentionCutoff;
    return cutoff.toISOString();
  }

  return retentionCutoff.toISOString();
}

export function useNotifications() {
  const { isAr } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<JobNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Per-user storage key — changes when user changes
  const storageKey = getStorageKey(user?.id);

  // Helper to get read IDs from per-user localStorage
  const getReadIds = useCallback((): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    } catch {}
    return new Set();
  }, [storageKey]);

  // Fetch real matched jobs from the live database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      // Extract candidate skills from parsed CV in storage if available
      let userSkills = '';
      if (typeof window !== 'undefined') {
        try {
          const parsed = localStorage.getItem('3watly_parsed_cv');
          if (parsed) {
            const data = JSON.parse(parsed);
            if (Array.isArray(data.skills) && data.skills.length > 0) {
              userSkills = data.skills.join(',');
            }
          }
        } catch {}
      }

      // Calculate the cutoff: max(7 days ago, user signup date)
      const cutoff = getNotificationCutoff(user?.createdAt);

      const params = new URLSearchParams({
        limit: '10',
        sortBy: 'recent',
        postedAfter: cutoff, // Server-side filter: only jobs posted after cutoff
      });
      if (userSkills) params.set('skills', userSkills);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch job notifications');

      const data = await res.json();
      const jobs: (JobItem & { postedAt?: string | null })[] = Array.isArray(data.jobs) ? data.jobs : [];

      const readIds = getReadIds();

      const notifs: JobNotification[] = jobs.slice(0, 8).map((job) => {
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
  }, [getReadIds, user?.createdAt]);

  // Refetch when the user changes (login/logout/switch account)
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    try {
      const readIds = getReadIds();
      readIds.add(notificationId);
      localStorage.setItem(storageKey, JSON.stringify(Array.from(readIds)));
    } catch {}
  }, [getReadIds, storageKey]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const readIds = getReadIds();
      notifications.forEach((n) => readIds.add(n.id));
      localStorage.setItem(storageKey, JSON.stringify(Array.from(readIds)));
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
