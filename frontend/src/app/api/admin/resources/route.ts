import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, writeAuditLog } from '@/lib/admin/authorization';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/resources — list resources (admin+)
export async function GET(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    return err as NextResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const skillKey = searchParams.get('skill_key') ?? '';
    const kind = searchParams.get('kind') ?? '';
    const activeOnly = searchParams.get('active_only') === 'true';

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }
    let query = supabase
      .from('resources')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,provider.ilike.%${search}%,skill_key.ilike.%${search}%`);
    }
    if (skillKey) query = query.eq('skill_key', skillKey);
    if (kind) query = query.eq('kind', kind);
    if (activeOnly) query = query.eq('is_active', true);

    const { data, count, error } = await query.order('display_order', { ascending: true });
    if (error) throw error;

    return NextResponse.json({ resources: data ?? [], total: count ?? 0 });
  } catch (e) {
    console.error('[/api/admin/resources GET]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/resources — create a new resource (admin+)
export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    return err as NextResponse;
  }

  try {
    const body = await request.json();
    const {
      skill_key, title, title_ar, provider, provider_icon,
      kind, url, duration_hours, is_free, language, display_order
    } = body;

    if (!skill_key || !title || !provider || !url) {
      return NextResponse.json({ error: 'skill_key, title, provider, and url are required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }
    const { data, error } = await supabase
      .from('resources')
      .insert({
        skill_key, title, title_ar, provider, provider_icon,
        kind: kind ?? 'video', url,
        duration_hours: duration_hours ?? null,
        is_free: is_free ?? true,
        language: language ?? 'en',
        display_order: display_order ?? 0,
        created_by: session.userId,
      })
      .select()
      .single();

    if (error) throw error;

    await writeAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'resource.create',
      targetType: 'resource',
      targetId: data.id,
      metadata: { skill_key, title },
    });

    return NextResponse.json({ resource: data }, { status: 201 });
  } catch (e) {
    console.error('[/api/admin/resources POST]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/resources — update a resource (admin+)
export async function PATCH(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    return err as NextResponse;
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Remove read-only fields
    delete updates.created_by;
    delete updates.created_at;

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await writeAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'resource.update',
      targetType: 'resource',
      targetId: id,
      metadata: updates,
    });

    return NextResponse.json({ resource: data });
  } catch (e) {
    console.error('[/api/admin/resources PATCH]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/resources — delete a resource (admin+)
export async function DELETE(request: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    return err as NextResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await writeAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'resource.delete',
      targetType: 'resource',
      targetId: id,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[/api/admin/resources DELETE]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
