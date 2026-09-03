import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bodyUserId = formData.get('userId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image size exceeds maximum limit of 5MB.' }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_TYPES.includes(mimeType) && !file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a PNG, JPG, JPEG, or WEBP image.' },
        { status: 400 }
      );
    }

    // Step 1: Resolve Authenticated User ID
    let userId: string | null = null;
    const supabase = await createClient();

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
        }
      } catch (e) {
        console.warn('Session resolution notice in avatar upload:', e);
      }
    }

    if (!userId && bodyUserId) {
      userId = bodyUserId.trim();
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. User ID required.' }, { status: 401 });
    }

    // Step 2: Upload to Supabase Storage using Admin Service Role Client
    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      return NextResponse.json({ error: 'Storage service unavailable.' }, { status: 503 });
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminSupabase.storage
      .from('avatars')
      .upload(filePath, fileBuffer, {
        contentType: mimeType || 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Step 3: Get Permanent Public CDN URL
    const { data: { publicUrl } } = adminSupabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to retrieve public avatar URL.' }, { status: 500 });
    }

    // Step 4: Persist URL to profiles table
    try {
      await adminSupabase.from('profiles').upsert({
        id: userId,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Warning updating profiles table:', dbErr);
    }

    // Step 5: Update auth user metadata
    try {
      await adminSupabase.auth.admin.updateUserById(userId, {
        user_metadata: { avatar_url: publicUrl },
      });
    } catch (authErr) {
      // Ignored if user is non-auth ID
    }

    return NextResponse.json({
      success: true,
      avatarUrl: publicUrl,
      message: 'Profile picture updated successfully.',
    });
  } catch (err: unknown) {
    console.error('Error in POST /api/user/avatar:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let userId: string | null = null;
    const supabase = await createClient();

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
        }
      } catch (e) {}
    }

    if (!userId) {
      const q = request.nextUrl.searchParams.get('userId');
      if (q) userId = q.trim();
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      // Update database profile
      try {
        await adminSupabase.from('profiles').update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
      } catch (e) {
        console.warn('Error clearing profile avatar:', e);
      }

      // Update auth user metadata
      try {
        await adminSupabase.auth.admin.updateUserById(userId, {
          user_metadata: { avatar_url: null },
        });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: 'Profile picture removed successfully.',
    });
  } catch (err: unknown) {
    console.error('Error in DELETE /api/user/avatar:', err);
    return NextResponse.json({ error: 'Failed to remove avatar.' }, { status: 500 });
  }
}
