import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that don't require authentication
const publicRoutes = [
    '/admin/login',
    '/admin/register',
];

// Routes that require authentication (prefix matching)
const protectedPrefixes = [
    '/admin',
];

// Get JWT secret as Uint8Array for jose library
function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // In development, use a default (matches auth/index.ts behavior)
        console.warn('⚠️  Middleware: JWT_SECRET not set, using development default');
        return new TextEncoder().encode('dev-only-insecure-secret-do-not-use-in-prod');
    }
    return new TextEncoder().encode(secret);
}

async function verifyToken(token: string): Promise<boolean> {
    try {
        const secret = getJwtSecret();
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this is a protected route
    const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
    const isPublicRoute = publicRoutes.includes(pathname);

    // If it's not a protected route, or it's a public admin route, allow access
    if (!isProtectedRoute || isPublicRoute) {
        return NextResponse.next();
    }

    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    // If no token, redirect to login
    if (!token) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const isValid = await verifyToken(token);
    if (!isValid) {
        // Invalid token, clear it and redirect to login
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('auth-token');
        return response;
    }

    // Token is valid, allow access
    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        // Match all admin routes
        '/admin/:path*',
    ],
};
