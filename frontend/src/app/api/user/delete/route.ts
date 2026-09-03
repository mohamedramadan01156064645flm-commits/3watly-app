import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    // 1. Validate request body for strong confirmation
    const body = await request.json().catch(() => ({}));
    const confirmation = typeof body?.confirmation === 'string' ? body.confirmation.trim().toUpperCase() : '';

    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Confirmation failed. You must enter "DELETE" to confirm account deletion.' },
        { status: 400 }
      );
    }

    // 2. Resolve Authenticated User strictly from session or token (never trust client userId)
    let userId: string | null = null;

    // A. Check SSR cookie session
    const supabase = await createClient();
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          userId = user.id;
        }
      } catch (e) {
        console.warn('[DELETE /api/user/delete] Session resolution notice:', e);
      }
    }

    // B. Initialize Admin client — required for auth.admin.deleteUser()
    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      // createAdminClient already logs the exact missing env var(s)
      console.error(
        '[DELETE /api/user/delete] FATAL: Admin client is null. ' +
        'Account deletion requires SUPABASE_SERVICE_ROLE_KEY in .env.local. ' +
        'Get it from: Supabase Dashboard → Project Settings → API → service_role (secret).'
      );
      return NextResponse.json(
        { error: 'Account deletion service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // C. Fallback: resolve user from Authorization Bearer token via admin client
    if (!userId) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '').trim();
        if (token) {
          try {
            const { data: { user: tokenUser } } = await adminSupabase.auth.getUser(token);
            if (tokenUser?.id) {
              userId = tokenUser.id;
            }
          } catch (e) {
            console.warn('[DELETE /api/user/delete] Bearer token auth notice:', e);
          }
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to delete your account.' },
        { status: 401 }
      );
    }

    console.log(`[DELETE /api/user/delete] Starting account deletion for user: ${userId}`);

    // 3. Storage Cleanup: Remove avatar files for this user (non-blocking — best effort)
    try {
      const { data: files } = await adminSupabase.storage
        .from('avatars')
        .list(userId);

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${userId}/${f.name}`);
        const { error: removeErr } = await adminSupabase.storage.from('avatars').remove(filePaths);
        if (removeErr) {
          console.warn(`[DELETE /api/user/delete] Avatar cleanup warning for ${userId}:`, removeErr.message);
        } else {
          console.log(`[DELETE /api/user/delete] Removed ${filePaths.length} avatar file(s) for ${userId}`);
        }
      }
    } catch (storageErr: any) {
      // Storage cleanup is best-effort — don't block account deletion for this
      console.warn('[DELETE /api/user/delete] Avatar storage cleanup error (continuing):', storageErr?.message);
    }

    // 4. Database Cleanup: Explicitly purge user-owned records
    //    The schema has ON DELETE CASCADE on profiles, cv_documents, copilot_messages
    //    referencing auth.users(id), so deleting the auth user would cascade.
    //    However, we explicitly delete first for safety and clear logging,
    //    and the auth.admin.deleteUser will cascade anything remaining.
    const tablesToPurge = [
      { table: 'copilot_messages', column: 'user_id' },
      { table: 'cv_documents',    column: 'user_id' },
      { table: 'profiles',        column: 'id' },
    ];

    for (const { table, column } of tablesToPurge) {
      try {
        const { error: delErr, count } = await adminSupabase
          .from(table)
          .delete({ count: 'exact' })
          .eq(column, userId);

        if (delErr) {
          console.error(`[DELETE /api/user/delete] Error deleting from ${table} for ${userId}:`, delErr.message);
          // Do NOT return early — the ON DELETE CASCADE on auth.users will clean up.
          // Log the error and continue.
        } else {
          console.log(`[DELETE /api/user/delete] Deleted ${count ?? '?'} row(s) from ${table} for ${userId}`);
        }
      } catch (dbErr: any) {
        console.error(`[DELETE /api/user/delete] Exception deleting from ${table}:`, dbErr?.message);
      }
    }

    // 5. Supabase Auth Deletion: Permanently delete user from auth.users
    //    This is the critical step. ON DELETE CASCADE in the schema will also
    //    remove any remaining rows in profiles, cv_documents, copilot_messages.
    const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error(
        `[DELETE /api/user/delete] CRITICAL: auth.admin.deleteUser failed for ${userId}:`,
        authDeleteError.message,
        authDeleteError
      );
      return NextResponse.json(
        { error: 'Unable to delete your account right now. Please try again later.' },
        { status: 500 }
      );
    }

    console.log(`[DELETE /api/user/delete] SUCCESS: User ${userId} permanently deleted at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Your account and associated data have been permanently deleted.'
    });

  } catch (err: any) {
    console.error('[DELETE /api/user/delete] Unhandled error:', err?.message, err?.stack);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting your account. Please try again.' },
      { status: 500 }
    );
  }
}
