import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireOwner, writeAuditLog } from '@/lib/admin/authorization';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/users — list all users (admin+)
export async function GET(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role') ?? '';
    const status = searchParams.get('status') ?? '';
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100);
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }

    let query = supabase
      .from('profiles')
      .select('id, full_name, email, role, account_status, created_at, updated_at, onboarding_completed, avatar_url', { count: 'exact' });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (role) {
      if (role === 'staff') {
        query = query.in('role', ['admin', 'owner']);
      } else {
        query = query.eq('role', role);
      }
    }
    if (status) {
      query = query.eq('account_status', status);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Fetch auth users to get authentic last_sign_in_at and updated_at
    const authUsersRes = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 }).catch(() => null);
    const authUsersMap = new Map<string, any>();
    if (authUsersRes?.data?.users) {
      authUsersRes.data.users.forEach((u: any) => {
        if (u.id) authUsersMap.set(u.id, u);
        if (u.email) authUsersMap.set(u.email.toLowerCase(), u);
      });
    }

    const fortyFiveMinutesAgo = Date.now() - 45 * 60 * 1000;

    let enrichedUsers = (data ?? []).map((u: any) => {
      const authUser = authUsersMap.get(u.id) || (u.email ? authUsersMap.get(u.email.toLowerCase()) : null);
      const lastSeen = authUser?.last_sign_in_at || authUser?.updated_at || u.updated_at || u.created_at;
      const isOnline = lastSeen ? (new Date(lastSeen).getTime() >= fortyFiveMinutesAgo) : false;

      return {
        ...u,
        last_seen_at: lastSeen,
        is_online: isOnline,
      };
    });

    const presence = searchParams.get('presence');
    if (presence === 'online') {
      enrichedUsers = enrichedUsers.filter((u: any) => u.is_online);
    }

    return NextResponse.json({
      users: enrichedUsers,
      total: presence === 'online' ? enrichedUsers.length : (count ?? 0),
      page,
      limit,
    });
  } catch (e) {
    console.error('[/api/admin/users GET] Error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/users — update a user's role or status (owner only for role)
export async function PATCH(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  try {
    const body = await request.json();
    const { userId, role, accountStatus } = body as {
      userId?: string;
      role?: string;
      accountStatus?: string;
    };

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Role changes require owner
    if (role !== undefined && session.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden — only owner can change roles' }, { status: 403 });
    }

    // Validate values
    if (role && !['owner', 'admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    if (accountStatus && !['active', 'suspended'].includes(accountStatus)) {
      return NextResponse.json({ error: 'Invalid account_status' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }
    const updates: Record<string, string> = {};
    if (role !== undefined) updates.role = role;
    if (accountStatus !== undefined) updates.account_status = accountStatus;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;

    // Write audit log
    await writeAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      action: role !== undefined ? 'user.role_change' : 'user.status_change',
      targetType: 'user',
      targetId: userId,
      metadata: { role, accountStatus },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[/api/admin/users PATCH] Error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users?userId=xxx — delete a user (owner/admin)
export async function DELETE(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (errorResponse) {
    return errorResponse as NextResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('[/api/admin/users DELETE] Error deleting from auth:', authError);
      return NextResponse.json({ error: 'Failed to delete user from auth' }, { status: 500 });
    }

    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
    if (profileError) {
      console.error('[/api/admin/users DELETE] Error deleting from profiles:', profileError);
    }

    await writeAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'user.delete',
      targetType: 'user',
      targetId: userId,
      metadata: {},
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[/api/admin/users DELETE] Error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
