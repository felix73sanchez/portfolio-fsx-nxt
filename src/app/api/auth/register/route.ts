import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, generateToken } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';

// Código de invitación secreto - cámbialo a algo seguro
const INVITATION_CODE = process.env.INVITATION_CODE || 'FSX1996TARGARYEN';

export async function POST(request: NextRequest) {
    try {
        // Inicializar la base de datos
        initializeDatabase();

        const body = await request.json();
        const { email, password, name, invitationCode } = body;

        // Validar campos requeridos
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, contraseña y nombre son requeridos' },
                { status: 400 }
            );
        }

        // Validar código de invitación
        if (!invitationCode || invitationCode !== INVITATION_CODE) {
            return NextResponse.json(
                { error: 'Código de invitación inválido' },
                { status: 403 }
            );
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Formato de email inválido' },
                { status: 400 }
            );
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Verificar si el usuario ya existe
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email ya está registrado' },
                { status: 409 }
            );
        }

        // Crear el usuario
        const user = createUser(email, password, name);

        // Generar token
        const token = generateToken(user.id, user.email);

        // Create response
        const response = NextResponse.json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        });

        // Set HTTP-only cookie for middleware authentication
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Error detallado en registro:', error);

        let errorMessage = 'Error interno del servidor';
        if (error?.code === 'SQLITE_READONLY') {
            errorMessage = 'Error de permisos: La base de datos es de solo lectura. Verifica los permisos de escritura en la carpeta data.';
        } else if (error?.code === 'SQLITE_CANTOPEN') {
            errorMessage = 'No se pudo abrir la base de datos. Verifica que la carpeta data exista y tenga permisos.';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }

}
