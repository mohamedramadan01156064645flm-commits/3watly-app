import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ messages: [] });
    }

    let userId: string | null = null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    if (!userId) {
      userId = request.nextUrl.searchParams.get('userId');
    }

    if (!userId) {
      return NextResponse.json({ messages: [] });
    }

    const { data: messages, error } = await supabase
      .from('copilot_messages')
      .select('id, role, content, feedback, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.warn('Error fetching copilot_messages:', error);
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err: unknown) {
    console.error('Error in GET /api/copilot/messages:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    let userId: string | null = null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    if (!userId) {
      userId = request.nextUrl.searchParams.get('userId');
    }

    if (userId) {
      const { error } = await supabase
        .from('copilot_messages')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.warn('Error deleting copilot_messages:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error in DELETE /api/copilot/messages:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
