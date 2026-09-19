import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export type AdminSession = {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'user';
};

/**
 * Verifies that the current request comes from an authenticated user
 * with role = 'admin' OR 'owner'. Use in API route handlers.
 * Throws a NextResponse (403/401/503) on failure; returns AdminSession on success.
 */
// In-memory role cache to eliminate redundant database round-trips (30s TTL)
const roleCache = new Map<string, { role: AdminSession['role']; email: string; exp: number }>();

export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();

  if (!supabase) {
    throw NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 });
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check cache first
  const now = Date.now();
  const cached = roleCache.get(user.id);
  if (cached && cached.exp > now) {
    if (cached.role !== 'admin' && cached.role !== 'owner') {
      throw NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return {
      userId: user.id,
      email: cached.email || user.email || '',
      role: cached.role,
    };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    throw NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = (profile?.role ?? 'user') as AdminSession['role'];

  // Save in cache for 30 seconds
  roleCache.set(user.id, { role, email: user.email ?? '', exp: now + 30_000 });

  if (role !== 'admin' && role !== 'owner') {
    throw NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return {
    userId: user.id,
    email: user.email ?? '',
    role: role as AdminSession['role'],
  };
}

/**
 * Same as requireAdmin but only allows 'owner' role.
 */
export async function requireOwner(): Promise<AdminSession> {
  const session = await requireAdmin();

  if (session.role !== 'owner') {
    throw NextResponse.json({ error: 'Forbidden — owner only' }, { status: 403 });
  }

  return session;
}

/**
 * Writes an entry to the audit_logs table (non-fatal, fire-and-forget).
 */
export async function writeAuditLog({
  actorId,
  actorEmail,
  action,
  targetType,
  targetId,
  metadata = {},
}: {
  actorId: string;
  actorEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const adminClient = createAdminClient();
    if (!adminClient) return;
    await adminClient.from('audit_logs').insert({
      actor_id: actorId,
      actor_email: actorEmail,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata,
    });
  } catch (e) {
    console.error('[AuditLog] Failed to write audit log:', e);
  }
}
