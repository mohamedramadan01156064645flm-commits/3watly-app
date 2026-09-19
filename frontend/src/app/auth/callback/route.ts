import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SAFE_NEXT_PATH_REGEX = /^\/(?!\/)[A-Za-z0-9\-_/]*$/;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const requestedNext = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.user) {
        const user = data.user;
        const metadata = user.user_metadata || {};
        const fullName =
          metadata.full_name ||
          metadata.name ||
          metadata.display_name ||
          (user.email ? user.email.split('@')[0] : 'User');
        const avatarUrl = metadata.avatar_url || metadata.picture || null;

        // Query/Upsert profiles table in Supabase
        let onboardingCompleted = false;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            onboardingCompleted = profile.onboarding_completed === true;
          } else {
            await supabase.from('profiles').upsert(
              {
                id: user.id,
                full_name: fullName,
                avatar_url: avatarUrl,
                onboarding_completed: false,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            );
            onboardingCompleted = false;
          }
        } catch (dbErr) {
          console.warn('Profiles table sync notice:', dbErr);
          onboardingCompleted = metadata.onboarding_completed === true;
        }

        // Validate destination to prevent open-redirect attacks
        let target = onboardingCompleted ? '/dashboard' : '/onboarding/career-path';
        if (requestedNext && SAFE_NEXT_PATH_REGEX.test(requestedNext)) {
          target = requestedNext;
        }

        return NextResponse.redirect(new URL(target, origin));
      }
    }
  }

  // Fallback to login with error notification
  return NextResponse.redirect(new URL('/login?error=oauth_exchange_failed', origin));
}
