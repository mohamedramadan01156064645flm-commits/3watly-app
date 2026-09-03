/**
 * 3WATLY Unified API Client
 * Connects directly to internal Next.js Server & Supabase routes
 */

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('3watly_token') || localStorage.getItem('majra_token')) : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!res.ok) {
      console.warn(`API error on ${endpoint}: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`Network error on ${endpoint}`);
    return null;
  }
}

export const ApiService = {
  // Jobs
  getJobs: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchFromApi<any>(`/api/jobs${qs}`);
  },
  getJobDetails: (id: string) => fetchFromApi<any>(`/api/jobs/${id}`),

  // Market Analytics
  getMarketStats: () => fetchFromApi<any>('/api/market/stats'),
  getMarketOverview: () => fetchFromApi<any>('/api/market/stats'),

  // Candidate Matching
  matchUser: (data: { candidate_skills: string[]; experience_years?: number; target_role?: string; preferred_locations?: string[] }) => {
    const qs = '?' + new URLSearchParams({
      skills: data.candidate_skills.join(','),
      seniority: data.experience_years ? (data.experience_years > 4 ? 'senior' : data.experience_years > 2 ? 'mid' : 'junior') : 'all',
      location: data.preferred_locations?.[0] || 'all'
    }).toString();
    return fetchFromApi<any>(`/api/jobs${qs}`);
  },

  // Real CV Upload & ATS Analysis
  uploadAndParseCv: (formData: FormData) => {
    return fetch('/api/cv/parse', {
      method: 'POST',
      body: formData
    }).then(r => r.ok ? r.json() : null).catch(() => null);
  },

  analyzeCv: (formData: FormData) => {
    return fetch('/api/cv/parse', {
      method: 'POST',
      body: formData
    }).then(r => r.ok ? r.json() : null).catch(() => null);
  },
};
