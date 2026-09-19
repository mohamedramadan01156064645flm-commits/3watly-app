import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    // 1. Validate request body for confirmation string
    const body = await request.json().catch(() => ({}));
    const confirmation = typeof body?.confirmation === 'string' ? body.confirmation.trim().toUpperCase() : '';

    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Confirmation failed. You must enter "DELETE" to confirm account deletion.' },
        { status: 400 }
      );
    }

    // 2. Resolve Authenticated User strictly from verified session
    const { user, errorResponse } = await requireUser();
    if (errorResponse) {
      return errorResponse;
    }

    const userId = user.id;

    // 3. Initialize Admin client required for auth.admin.deleteUser
    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      console.error('[DELETE /api/user/delete] Admin client is not configured.');
      return NextResponse.json(
        { error: 'Account deletion service is currently unavailable.' },
        { status: 503 }
      );
    }

    // 4. Delete Auth User first — Foreign keys with ON DELETE CASCADE
    //    will automatically and atomically purge profiles, cv_documents, and copilot_messages
    const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error('[DELETE /api/user/delete] auth.admin.deleteUser failed:', authDeleteError.message);
      return NextResponse.json(
        { error: 'Unable to delete your account right now. Please try again later.' },
        { status: 500 }
      );
    }

    // 5. Storage Cleanup: Remove avatar files for this user (best effort after auth deletion)
    try {
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const { data: files, error: listError } = await adminSupabase.storage
          .from('avatars')
          .list(userId, { limit, offset });

        if (listError || !files || files.length === 0) {
          hasMore = false;
          break;
        }

        const filePaths = files.map((f) => `${userId}/${f.name}`);
        await adminSupabase.storage.from('avatars').remove(filePaths);

        if (files.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }
    } catch (storageErr) {
      console.warn('[DELETE /api/user/delete] Storage cleanup warning:', storageErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your account and associated data have been permanently deleted.',
    });
  } catch (err: unknown) {
    console.error('[DELETE /api/user/delete] Unexpected error in account deletion');
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting your account. Please try again.' },
      { status: 500 }
    );
  }
}
