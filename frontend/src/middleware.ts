import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Routes that require an authenticated session */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/copilot',
  '/cv-builder',
  '/skill-gap',
  '/skills',
  '/ats-diagnostics',
  '/settings',
  '/profile',
  '/onboarding',
];

/** Routes where logged-in users are redirected to dashboard */
const AUTH_ONLY_ROUTES = ['/login', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth session
  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthOnly = AUTH_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 1. If trying to access protected route without active session -> redirect to login
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and visiting login -> redirect to dashboard
  if (isAuthOnly && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|logo.png|images/.*|backgrounds/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot)$).*)',
  ],
};

