import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/authorization';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/audit-logs — list audit logs (admin+)
export async function GET(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    return err as NextResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 100);
    const offset = (page - 1) * limit;
    const action = searchParams.get('action') ?? '';

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    if (action) query = query.ilike('action', `%${action}%`);

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ logs: data ?? [], total: count ?? 0, page, limit });
  } catch (e) {
    console.error('[/api/admin/audit-logs GET]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
