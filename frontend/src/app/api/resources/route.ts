import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/resources — public/authenticated endpoint for active learning resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skillKey = searchParams.get('skill_key');

    // Attempt with server client or admin client
    let supabase = await createClient();
    if (!supabase) {
      supabase = createAdminClient();
    }

    if (!supabase) {
      return NextResponse.json({ resources: [] });
    }

    let query = supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (skillKey) {
      query = query.eq('skill_key', skillKey);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[/api/resources] Failed to query resources:', error);
      return NextResponse.json({ resources: [] });
    }

    return NextResponse.json({ resources: data ?? [] });
  } catch (e) {
    console.error('[/api/resources] Error:', e);
    return NextResponse.json({ resources: [] });
  }
}
