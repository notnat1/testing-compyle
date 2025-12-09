import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/login', '/register', '/forgot-password'];

// Paths that require admin role
const adminPaths = ['/users', '/settings'];

// Get token from request
function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookie
  const token = request.cookies.get('auth_token')?.value;
  return token || null;
}

// Verify token and get user info
function verifyToken(token: string): { user: any; valid: boolean } {
  try {
    // In a real app, this would verify JWT token
    // For now, we'll decode the base64 token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');

    // Mock user lookup - in real app, this would be database lookup
    const users = [
      { id: '1', role: 'admin', name: 'Admin User' },
      { id: '2', role: 'staff', name: 'Staff User' },
    ];

    const user = users.find(u => u.id === userId);
    return {
      user: user || null,
      valid: !!user,
    };
  } catch {
    return { user: null, valid: false };
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // If user is already logged in, redirect to dashboard
    const token = getToken(request);
    if (token && pathname === '/login') {
      const { valid } = verifyToken(token);
      if (valid) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // For API routes, handle auth differently
  if (pathname.startsWith('/api/')) {
    // Skip auth verification for public API endpoints
    const publicApiPaths = ['/api/auth/login', '/api/auth/register'];
    if (publicApiPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Verify token for protected API endpoints
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { valid, user } = verifyToken(token);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For all other paths, require authentication
  const token = getToken(request);
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { valid, user } = verifyToken(token);
  if (!valid) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin-only paths
  if (adminPaths.some(path => pathname.startsWith(path)) && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user info to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);
  requestHeaders.set('x-user-role', user.role);
  requestHeaders.set('x-user-name', user.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};