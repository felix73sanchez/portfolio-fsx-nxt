import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ============================================
// CSP Nonce Generation
// ============================================

function generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Buffer.from(array).toString('base64');
}

function buildCspHeader(nonce: string, isDev: boolean): string {
    const scriptSrc = [
        "'self'",
        `'nonce-${nonce}'`,
        isDev ? "'unsafe-inline'" : '', // Turbopack dev scripts
        isDev ? "'unsafe-eval'" : '',   // React Compiler / Turbopack eval in dev
    ].filter(Boolean).join(' ');

    const styleSrc = [
        "'self'",
        "'unsafe-inline'", // Tailwind v4 + custom CSS uses inline styles
        'fonts.googleapis.com',
    ].join(' ');

    const fontSrc = [
        "'self'",
        'data:',
        'fonts.gstatic.com',
    ].join(' ');

    const imgSrc = [
        "'self'",
        'data:',
        'blob:',
        'avatars.githubusercontent.com',
        'lh3.googleusercontent.com', // Google OAuth avatars if ever used
    ].join(' ');

    const connectSrc = [
        "'self'",
        isDev ? 'ws:' : '', // Turbopack HMR websocket
    ].filter(Boolean).join(' ');

    const frameAncestors = "'none'";
    const baseUri = "'self'";
    const formAction = "'self'";

    return [
        `default-src 'self'`,
        `script-src ${scriptSrc}`,
        `style-src ${styleSrc}`,
        `font-src ${fontSrc}`,
        `img-src ${imgSrc}`,
        `connect-src ${connectSrc}`,
        `frame-ancestors ${frameAncestors}`,
        `base-uri ${baseUri}`,
        `form-action ${formAction}`,
        `object-src 'none'`,
        `base-uri ${baseUri}`,
    ].join('; ');
}

// ============================================
// Security Headers Helper
// ============================================

function setSecurityHeaders(response: NextResponse, cspHeader: string, nonce: string, isDev: boolean): void {
    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('x-csp-nonce', nonce);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (isDev) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    if (!isDev) {
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=63072000; includeSubDomains; preload'
        );
    }

    response.headers.set('X-Powered-By', '');
}

// ============================================
// Auth Configuration
// ============================================

const publicRoutes = [
    '/admin/login',
    '/admin/register',
    '/admin/forgot-password',
    '/admin/reset-password',
];
const protectedPrefixes = ['/admin'];

function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.warn('⚠️  Proxy: JWT_SECRET not set, using development default');
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

// ============================================
// Main Proxy
// ============================================

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isDev = process.env.NODE_ENV === 'development';

    // Generate CSP nonce for this request
    const nonce = generateNonce();
    const cspHeader = buildCspHeader(nonce, isDev);

    // Create response with security headers
    const response = NextResponse.next();
    setSecurityHeaders(response, cspHeader, nonce, isDev);

    // ============================================
    // Auth Logic (only for /admin/* routes)
    // ============================================
    const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
    const isPublicRoute = publicRoutes.includes(pathname);

    if (isProtectedRoute && !isPublicRoute) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const redirectResponse = NextResponse.redirect(loginUrl);
            setSecurityHeaders(redirectResponse, cspHeader, nonce, isDev);
            return redirectResponse;
        }

        const isValid = await verifyToken(token);
        if (!isValid) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const redirectResponse = NextResponse.redirect(loginUrl);
            setSecurityHeaders(redirectResponse, cspHeader, nonce, isDev);
            redirectResponse.cookies.delete('auth-token');
            return redirectResponse;
        }
    }

    return response;
}

// Match ALL routes for CSP, but auth logic only triggers on /admin/*
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, robots.txt, sitemap.xml
         * - public folder assets
         */
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.svg$).*)',
    ],
};