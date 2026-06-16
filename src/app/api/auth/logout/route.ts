import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({
        message: 'Sesión cerrada exitosamente',
    });

    // Clear the auth cookie
    const isSecure = request.headers.get('x-forwarded-proto') === 'https'
        || request.nextUrl.protocol === 'https:';
    response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 0, // Expire immediately
        path: '/',
    });

    return response;
}

// Also support GET for simple logout links
export async function GET(request: NextRequest) {
    return POST(request);
}
