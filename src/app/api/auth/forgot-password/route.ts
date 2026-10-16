import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, setResetToken, verifyServerSecret } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';
import { forgotPasswordRateLimiter } from '@/lib/rate-limit';
import crypto from 'node:crypto';

export async function POST(request: NextRequest) {
    // Rate limiting
    const rateLimitResponse = await forgotPasswordRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        initializeDatabase();

        const body = await request.json();
        const { email, secretCode } = body;

        if (!email || !secretCode) {
            return NextResponse.json(
                { error: 'El email y el código de seguridad del servidor son requeridos' },
                { status: 400 }
            );
        }

        const secretCheck = verifyServerSecret(String(secretCode).trim());
        if (!secretCheck.configured) {
            return NextResponse.json(
                { error: 'Recuperación no configurada. Define INVITATION_CODE o ADMIN_RESET_SECRET en el servidor.' },
                { status: 503 }
            );
        }

        if (!secretCheck.valid) {
            return NextResponse.json(
                { error: 'Código de seguridad inválido' },
                { status: 403 }
            );
        }

        const user = getUserByEmail(String(email).trim());
        if (!user) {
            return NextResponse.json(
                { error: 'No se encontró una cuenta registrada con ese email' },
                { status: 404 }
            );
        }

        // Generar token único (se guarda su hash SHA-256 en la BD)
        const rawToken = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hora

        setResetToken(user.email, rawToken, expiry);

        // Construir link de reset
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
        const resetPath = `/admin/reset-password?token=${rawToken}`;
        const resetUrl = `${baseUrl}${resetPath}`;

        return NextResponse.json({
            message: 'Código verificado. Redirigiendo…',
            resetPath,
            resetUrl,
        });
    } catch (error) {
        console.error('Error en forgot-password:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
