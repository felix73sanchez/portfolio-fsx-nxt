import { NextRequest, NextResponse } from 'next/server';

// In-memory store (use Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
    windowMs: number;      // Time window in milliseconds
    maxRequests: number;   // Max requests per window
    keyPrefix?: string;    // Prefix for rate limit key
    message?: string;      // Custom error message
}

export function createRateLimiter(config: RateLimitConfig) {
    const {
        windowMs,
        maxRequests,
        keyPrefix = 'rl',
        message = 'Demasiadas peticiones. Intenta de nuevo más tarde.',
    } = config;

    return async function rateLimit(request: NextRequest): Promise<NextResponse | null> {
        // Generate key from IP + prefix
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
        const key = `${keyPrefix}:${ip}`;

        const now = Date.now();
        const record = rateLimitStore.get(key);

        if (!record || now > record.resetAt) {
            // First request or window expired
            rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
            return null; // Allow request
        }

        if (record.count >= maxRequests) {
            // Rate limited
            const retryAfter = Math.ceil((record.resetAt - now) / 1000);
            return NextResponse.json(
                { error: message, retryAfter },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': String(maxRequests),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(Math.ceil(record.resetAt / 1000)),
                    },
                }
            );
        }

        // Increment and allow
        record.count++;
        rateLimitStore.set(key, record);

        return null; // Allow request
    };
}

// Pre-configured limiters for auth endpoints
export const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,           // 5 attempts per 15 min
    keyPrefix: 'auth',
    message: 'Demasiados intentos de autenticación. Intenta en 15 minutos.',
});

export const registerRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,           // 3 registrations per hour
    keyPrefix: 'register',
    message: 'Demasiados registros. Intenta en 1 hora.',
});

export const passwordRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,          // 10 password changes per hour
    keyPrefix: 'password',
    message: 'Demasiados cambios de contraseña. Intenta en 1 hora.',
});

export const forgotPasswordRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3,           // 3 forgot-password requests per 15 min
    keyPrefix: 'forgot',
    message: 'Demasiadas solicitudes de recuperación. Intenta en 15 minutos.',
});

// Cleanup old entries periodically (run once per minute)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of rateLimitStore.entries()) {
            if (now > record.resetAt) {
                rateLimitStore.delete(key);
            }
        }
    }, 60 * 1000);
}