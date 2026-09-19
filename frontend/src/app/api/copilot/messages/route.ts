import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { user, errorResponse } = await requireUser();
    if (errorResponse) {
      return errorResponse;
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ messages: [] });
    }

    const { data: messages, error } = await supabase
      .from('copilot_messages')
      .select('id, role, content, feedback, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.warn('Error fetching copilot_messages:', error);
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err: unknown) {
    console.error('Error in GET /api/copilot/messages:', err);
    return NextResponse.json({ error: 'Failed to retrieve messages.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { user, errorResponse } = await requireUser();
    if (errorResponse) {
      return errorResponse;
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    const { error } = await supabase
      .from('copilot_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting copilot_messages:', error);
      return NextResponse.json({ error: 'Failed to delete message history.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error in DELETE /api/copilot/messages:', err);
    return NextResponse.json({ error: 'Failed to process deletion request.' }, { status: 500 });
  }
}
