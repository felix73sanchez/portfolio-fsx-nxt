import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, setResetToken } from '@/lib/auth';
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
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'El email es requerido' },
                { status: 400 }
            );
        }

        const user = getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' },
                { status: 200 }
            );
        }

        // Generar token único
        const rawToken = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hora

        setResetToken(email, rawToken, expiry);

        // Construir link de reset
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
        const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;

        // En un entorno con email, aquí se enviaría el correo.
        // Como es un panel personal, devolvemos el link en la respuesta.
        console.log(`[Password Reset] Link para ${email}: ${resetUrl}`);

        return NextResponse.json({
            message: 'Link de recuperación generado.',
            resetUrl, // visible para el admin (personal panel)
        });
    } catch (error) {
        console.error('Error en forgot-password:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
