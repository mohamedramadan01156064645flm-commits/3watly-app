import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function detectImageMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  // GIF: 47 49 46 38 (GIF87a or GIF89a)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return 'image/gif';
  }
  // WebP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user via verified cookie session only
    const { user, errorResponse } = await requireUser();
    if (errorResponse) {
      return errorResponse;
    }

    const userId = user.id;
    if (!UUID_REGEX.test(userId)) {
      return NextResponse.json({ error: 'Invalid user identifier.' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image size exceeds maximum limit of 5MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 2. Validate magic bytes (prevent file-type spoofing)
    const detectedMime = detectImageMimeType(fileBuffer);
    if (!detectedMime) {
      return NextResponse.json(
        { error: 'Invalid file content. Please upload a valid PNG, JPEG, GIF, or WebP image.' },
        { status: 400 }
      );
    }

    // 3. Initialize Admin Supabase Client
    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      return NextResponse.json({ error: 'Storage service unavailable.' }, { status: 503 });
    }

    // 4. Clean up existing avatars for this user
    try {
      const { data: existingFiles } = await adminSupabase.storage
        .from('avatars')
        .list(userId, { limit: 20 });

      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map((f) => `${userId}/${f.name}`);
        await adminSupabase.storage.from('avatars').remove(filesToRemove);
      }
    } catch (cleanupErr) {
      console.warn('Notice: non-critical error during previous avatar cleanup:', cleanupErr);
    }

    // 5. Upload with safe derived extension & contentType
    const extMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const safeExt = extMap[detectedMime] || 'png';
    const filePath = `${userId}/avatar-${Date.now()}.${safeExt}`;

    const { error: uploadError } = await adminSupabase.storage
      .from('avatars')
      .upload(filePath, fileBuffer, {
        contentType: detectedMime,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Storage upload failed. Please try again.' },
        { status: 500 }
      );
    }

    // 6. Get Permanent Public CDN URL
    const { data: { publicUrl } } = adminSupabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to retrieve public avatar URL.' }, { status: 500 });
    }

    // 7. Persist URL to profiles table
    try {
      await adminSupabase.from('profiles').upsert({
        id: userId,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Warning updating profiles table:', dbErr);
    }

    // 8. Update auth user metadata
    try {
      await adminSupabase.auth.admin.updateUserById(userId, {
        user_metadata: { avatar_url: publicUrl },
      });
    } catch (authErr) {
      console.warn('Warning updating user metadata:', authErr);
    }

    return NextResponse.json({
      success: true,
      avatarUrl: publicUrl,
      message: 'Profile picture updated successfully.',
    });
  } catch (err: unknown) {
    console.error('Error in POST /api/user/avatar:', err);
    return NextResponse.json({ error: 'An unexpected error occurred while processing avatar.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // 1. Authenticate user via verified cookie session only
    const { user, errorResponse } = await requireUser();
    if (errorResponse) {
      return errorResponse;
    }

    const userId = user.id;
    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      return NextResponse.json({ error: 'Storage service unavailable.' }, { status: 503 });
    }

    // 2. Remove avatar files from storage
    try {
      const { data: existingFiles } = await adminSupabase.storage
        .from('avatars')
        .list(userId, { limit: 20 });

      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map((f) => `${userId}/${f.name}`);
        await adminSupabase.storage.from('avatars').remove(filesToRemove);
      }
    } catch (e) {
      console.warn('Notice removing avatar storage objects:', e);
    }

    // 3. Update database profile
    try {
      await adminSupabase.from('profiles').update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
    } catch (e) {
      console.warn('Error clearing profile avatar:', e);
    }

    // 4. Update auth user metadata
    try {
      await adminSupabase.auth.admin.updateUserById(userId, {
        user_metadata: { avatar_url: null },
      });
    } catch (e) {
      console.warn('Error clearing metadata avatar:', e);
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
