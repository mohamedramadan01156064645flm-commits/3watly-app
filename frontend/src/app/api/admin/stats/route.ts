import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/authorization';
import { createAdminClient } from '@/lib/supabase/admin';

let cachedStats: { data: any; exp: number } | null = null;

export async function GET() {
  try {
    await requireAdmin();
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  // Return cached stats if fresh (< 15s)
  const now = Date.now();
  if (cachedStats && cachedStats.exp > now) {
    return NextResponse.json(cachedStats.data);
  }

  try {
    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }
    // Run all count queries in parallel
    const [
      usersResult,
      adminResult,
      suspendedResult,
      cvResult,
      jobsResult,
      resourcesResult,
      recentUsersResult,
    ] = await Promise.allSettled([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['admin', 'owner']),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('account_status', 'suspended'),
      supabase.from('cv_analyses').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase
        .from('profiles')
        .select('id, full_name, email, role, account_status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const safe = <T,>(result: PromiseSettledResult<T>, fallback: T): T =>
      result.status === 'fulfilled' ? result.value : fallback;

    const usersRes = safe(usersResult, { count: 0 } as any);
    const adminRes = safe(adminResult, { count: 0 } as any);
    const suspendedRes = safe(suspendedResult, { count: 0 } as any);
    const cvRes = safe(cvResult, { count: 0 } as any);
    const jobsRes = safe(jobsResult, { count: 0 } as any);
    const resourcesRes = safe(resourcesResult, { count: 0 } as any);
    const recentUsersRes = safe(recentUsersResult, { data: [] } as any);

    const responseData = {
      stats: {
        totalUsers: usersRes.count ?? 0,
        adminUsers: adminRes.count ?? 0,
        suspendedUsers: suspendedRes.count ?? 0,
        totalCvAnalyses: cvRes.count ?? 0,
        totalJobs: jobsRes.count ?? 0,
        activeResources: resourcesRes.count ?? 0,
      },
      recentUsers: recentUsersRes.data ?? [],
    };

    cachedStats = { data: responseData, exp: now + 15_000 };

    return NextResponse.json(responseData);
  } catch (e) {
    console.error('[/api/admin/stats] Error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
