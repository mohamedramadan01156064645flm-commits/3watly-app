import { NextResponse } from 'next/server';
import { requireAdmin, writeAuditLog } from '@/lib/admin/authorization';
import { createAdminClient } from '@/lib/supabase/admin';
import { SKILLS } from '@/data/skillCatalog';

function mapKind(kind: string): 'video' | 'article' | 'course' | 'repo' | 'practice' | 'book' | 'other' {
  const k = (kind || '').toLowerCase();
  if (k === 'video') return 'video';
  if (k === 'course') return 'course';
  if (k === 'docs' || k === 'article') return 'article';
  if (k === 'project' || k === 'repo') return 'repo';
  if (k === 'practice') return 'practice';
  if (k === 'book') return 'book';
  return 'other';
}

export async function POST() {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    return err as NextResponse;
  }

  try {
    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Admin service unavailable' }, { status: 503 });
    }

    const rowsToInsert: any[] = [];
    let order = 0;

    for (const [skillKey, skillDef] of Object.entries(SKILLS)) {
      if (!skillDef.resources || !Array.isArray(skillDef.resources)) continue;

      for (const res of skillDef.resources) {
        order += 1;
        rowsToInsert.push({
          skill_key: skillKey,
          title: res.title,
          title_ar: null,
          provider: res.provider || 'Other',
          provider_icon: null,
          kind: mapKind(res.kind),
          url: res.url,
          duration_hours: res.hours ? Number(res.hours) : null,
          is_free: res.free !== false,
          language: 'en',
          is_active: true,
          display_order: order,
          created_by: session.userId,
        });
      }
    }

    if (rowsToInsert.length === 0) {
      return NextResponse.json({ message: 'No resources found in catalog to seed', count: 0 });
    }

    // Insert all rows
    const { data, error } = await supabase
      .from('resources')
      .insert(rowsToInsert)
      .select();

    if (error) throw error;

    await writeAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      action: 'resources.seed_catalog',
      targetType: 'resources',
      metadata: { count: rowsToInsert.length },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${rowsToInsert.length} resources into database`,
      count: rowsToInsert.length,
      resources: data,
    });
  } catch (e: any) {
    console.error('[/api/admin/resources/seed POST]', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
