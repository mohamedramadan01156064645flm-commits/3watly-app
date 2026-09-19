import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Routes that require an authenticated session */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/copilot',
  '/cv-builder',
  '/skills',
  '/ats-diagnostics',
  '/settings',
  '/profile',
  '/onboarding',
  '/api/user',
  '/api/copilot',
  '/admin',
  '/api/admin',
];

/** Routes where logged-in users are redirected to dashboard (disabled so users can always access signup) */
const AUTH_ONLY_ROUTES: string[] = [];

function matchesPath(pathname: string, target: string): boolean {
  return pathname === target || pathname.startsWith(target + '/');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => matchesPath(pathname, prefix));
  const isAuthOnly = AUTH_ONLY_ROUTES.some((route) => matchesPath(pathname, route));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtected) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 500 });
      }
      return new NextResponse('Authentication service unavailable', { status: 500 });
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

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

  // 1. If trying to access protected route without active session
  if (isProtected && !user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and visiting login/signup -> redirect to dashboard
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

