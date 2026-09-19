'use client';

export interface SavedJobRecord {
  id: string;
  title: string;
  titleAr?: string;
  company: string;
  companyAr?: string;
  companyLogo?: string;
  location: string;
  locationAr?: string;
  workType?: string;
  salaryRange?: string;
  postedAgo?: string;
  postedAgoAr?: string;
  matchScore?: number | null;
  matchedSkills?: { name: string; isMatched: boolean }[];
  skills?: { name: string; isMatched: boolean }[];
  extraSkillsCount?: number;
  description?: string;
  savedAt?: string;
}

const GLOBAL_STORAGE_KEY = '3watly_saved_jobs';
const GLOBAL_OBJECTS_KEY = '3watly_saved_job_objects';
export const SAVED_JOBS_EVENT = '3watly_saved_jobs_updated';

function getCurrentUserId(providedId?: string | null): string | null {
  if (providedId) return providedId;
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('3watly_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return u.id;
    }
  } catch {}
  return null;
}

export function getSavedJobIds(userId?: string | null): string[] {
  if (typeof window === 'undefined') return [];
  const uid = getCurrentUserId(userId);
  try {
    if (uid) {
      const rawUser = localStorage.getItem(`3watly_saved_jobs_${uid}`);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (Array.isArray(parsed)) return parsed.map(String);
      }
    }
    const raw = localStorage.getItem(GLOBAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function getSavedJobObjects(userId?: string | null): SavedJobRecord[] {
  if (typeof window === 'undefined') return [];
  const uid = getCurrentUserId(userId);
  try {
    if (uid) {
      const rawUser = localStorage.getItem(`3watly_saved_job_objects_${uid}`);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        const list = Array.isArray(parsed) ? parsed : Object.values(parsed);
        if (list.length > 0) return list;
      }
    }
    const raw = localStorage.getItem(GLOBAL_OBJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : Object.values(parsed);
  } catch {
    return [];
  }
}

export function isJobBookmarked(id: string | number, userId?: string | null): boolean {
  const ids = getSavedJobIds(userId);
  return ids.includes(String(id));
}

export function toggleJobBookmark(jobOrId: any, userId?: string | null): { isSaved: boolean; list: string[] } {
  if (typeof window === 'undefined') return { isSaved: false, list: [] };

  const id = String(jobOrId?.id ?? jobOrId);
  const uid = getCurrentUserId(userId);
  const currentIds = getSavedJobIds(uid);
  const willBeSaved = !currentIds.includes(id);

  let nextIds: string[];
  let objectsMap: Record<string, any> = {};

  try {
    // Load existing objects map
    const existingObjects = getSavedJobObjects(uid);
    existingObjects.forEach((j: any) => {
      if (j?.id) objectsMap[String(j.id)] = j;
    });
  } catch {}

  if (willBeSaved) {
    nextIds = Array.from(new Set([...currentIds, id]));
    if (typeof jobOrId === 'object' && jobOrId !== null) {
      objectsMap[id] = {
        ...jobOrId,
        id,
        savedAt: new Date().toISOString()
      };
    } else if (!objectsMap[id]) {
      objectsMap[id] = { id, savedAt: new Date().toISOString() };
    }
  } else {
    nextIds = currentIds.filter(item => item !== id);
    delete objectsMap[id];
  }

  try {
    const idsJson = JSON.stringify(nextIds);
    const objsJson = JSON.stringify(objectsMap);

    // Save to global keys
    localStorage.setItem(GLOBAL_STORAGE_KEY, idsJson);
    localStorage.setItem(GLOBAL_OBJECTS_KEY, objsJson);

    // Save to user-scoped keys if logged in
    if (uid) {
      localStorage.setItem(`3watly_saved_jobs_${uid}`, idsJson);
      localStorage.setItem(`3watly_saved_job_objects_${uid}`, objsJson);
    }

    // Broadcast update across tabs and components
    window.dispatchEvent(new CustomEvent(SAVED_JOBS_EVENT, { detail: { id, isSaved: willBeSaved, list: nextIds } }));
  } catch (e) {
    console.warn('Failed to persist saved jobs to localStorage:', e);
  }

  return { isSaved: willBeSaved, list: nextIds };
}
