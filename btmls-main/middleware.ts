import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isProtected = ['/dashboard', '/brands', '/reports'].some(prefix =>
    req.nextUrl.pathname.startsWith(prefix)
  );

  if (!session && isProtected) {
    // Quick workaround: don't perform server-side redirect here so the
    // client-side auth flow can manage navigation. This prevents an
    // immediate redirect back to the login page when the session is
    // only stored client-side (localStorage).
    return res;
  }

  if (session && isAuthPage) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/brands',
    '/brands/:path*',
    '/brands/ad/:path*',
    '/reports',
    '/reports/:path*',
  ],
};