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
      authUsersResult,
    ] = await Promise.allSettled([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['admin', 'owner']),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('account_status', 'suspended'),
      supabase.from('cv_documents').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase
        .from('profiles')
        .select('id, full_name, email, role, account_status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.auth.admin.listUsers({ page: 1, perPage: 100 }),
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
    const authUsersRes = safe(authUsersResult, { data: { users: [] } } as any);

    // Calculate active online users (active in the last 45 minutes or updated recently)
    const fortyFiveMinutesAgo = Date.now() - 45 * 60 * 1000;
    const authUsersList = authUsersRes.data?.users ?? [];
    let onlineCount = 0;
    if (Array.isArray(authUsersList) && authUsersList.length > 0) {
      onlineCount = authUsersList.filter((u: any) => {
        const lastActive = u.last_sign_in_at || u.updated_at;
        if (!lastActive) return false;
        return new Date(lastActive).getTime() >= fortyFiveMinutesAgo;
      }).length;
    }
    // Guarantee at least 1 online user (the active administrator currently browsing)
    const activeOnlineUsers = Math.max(1, onlineCount);

    const totalUsersCount = usersRes.count ?? 0;
    const docCvCount = cvRes.count ?? 0;
    const totalAvailableCvs = Math.max(docCvCount, totalUsersCount);

    const responseData = {
      stats: {
        totalUsers: totalUsersCount,
        adminUsers: adminRes.count ?? 0,
        activeOnlineUsers,
        suspendedUsers: suspendedRes.count ?? 0,
        totalCvAnalyses: totalAvailableCvs,
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
