import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export type RequireUserResult =
  | { user: User; errorResponse: null }
  | { user: null; errorResponse: NextResponse };

/**
 * Server-side session guard for route handlers.
 * Verifies cookie-based Supabase session via getUser().
 * If invalid or missing, returns a 401 NextResponse.
 */
export async function requireUser(): Promise<RequireUserResult> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 500 }
      ),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  return { user, errorResponse: null };
}
