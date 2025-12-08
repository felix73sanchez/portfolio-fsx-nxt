import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, comparePasswords, generateToken } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';

export async function POST(request: NextRequest) {
    try {
        // Inicializar la base de datos
        initializeDatabase();

        const body = await request.json();
        const { email, password } = body;

        // Validar campos requeridos
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Buscar usuario
        const user = getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Verificar contraseña
        const isValidPassword = comparePasswords(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Generar token
        const token = generateToken(user.id, user.email);

        // Create response with token
        const response = NextResponse.json({
            message: 'Inicio de sesión exitoso',
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
            maxAge: 60 * 60 * 24 * 7, // 7 days (matches JWT expiry)
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
