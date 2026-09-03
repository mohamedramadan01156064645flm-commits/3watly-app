import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

        // Query profiles table in Supabase
        let onboardingCompleted = false;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            // Existing user: Preserve existing profile data and check onboarding
            onboardingCompleted = profile.onboarding_completed === true;
          } else {
            // First time user: Create initial profile record with Google / OAuth metadata
            await supabase.from('profiles').insert({
              id: user.id,
              full_name: fullName,
              avatar_url: avatarUrl,
              onboarding_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            onboardingCompleted = false;
          }
        } catch (dbErr) {
          console.warn('Profiles table query fallback:', dbErr);
          onboardingCompleted = metadata.onboarding_completed === true;
        }

        // Determine destination: Dashboard for returning users, Onboarding for first-time users
        const target = requestedNext
          ? requestedNext
          : onboardingCompleted
          ? '/dashboard'
          : '/onboarding/career-path';

        return NextResponse.redirect(`${origin}${target}`);
      }
    }
  }

  // Fallback to login with error notification
  return NextResponse.redirect(`${origin}/login?error=oauth_exchange_failed`);
}
