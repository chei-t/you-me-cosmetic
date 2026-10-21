// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. M-Pesa callback must bypass auth — Safaricom calls it unauthenticated
  if (pathname.startsWith('/api/payments/mpesa/callback')) {
    return NextResponse.next();
  }

  // 2. Admin routes require a valid admin session cookie
  if (pathname.startsWith('/admin')) {
    const adminSession = req.cookies.get('tawas_admin_session')?.value;
    if (!adminSession) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Full session verification happens in /admin/layout.tsx via lib/auth/admin.ts
    // Middleware only checks presence to prevent flash of admin UI.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/payments/mpesa/callback/:path*',
  ],
};