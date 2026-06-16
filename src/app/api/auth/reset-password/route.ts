import { NextRequest, NextResponse } from 'next/server';
import { getUserByResetToken, updatePassword } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';
import { passwordRateLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    // Rate limiting
    const rateLimitResponse = await passwordRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        initializeDatabase();

        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token y nueva contraseña son requeridos' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        const user = getUserByResetToken(token);
        if (!user) {
            return NextResponse.json(
                { error: 'El token es inválido o ha expirado. Solicita uno nuevo.' },
                { status: 400 }
            );
        }

        updatePassword(user.id, password);

        return NextResponse.json({
            message: 'Contraseña actualizada exitosamente. Ya podés iniciar sesión con tu nueva contraseña.',
        });
    } catch (error) {
        console.error('Error en reset-password:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
