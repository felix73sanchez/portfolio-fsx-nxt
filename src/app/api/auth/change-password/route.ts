import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, comparePasswords, hashPassword } from '@/lib/auth';
import { getDb } from '@/lib/db/init';

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { currentPassword, newPassword, confirmPassword } = body;

        // Validar campos requeridos
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Validar que las contraseñas nuevas coincidan
        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Las contraseñas nuevas no coinciden' },
                { status: 400 }
            );
        }

        // Validar longitud de contraseña nueva
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Obtener usuario con contraseña actual de la BD
        const db = getDb();
        const dbUser = db
            .prepare('SELECT password FROM users WHERE id = ?')
            .get(user.id) as { password: string } | undefined;

        if (!dbUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Verificar contraseña actual
        const isValidPassword = comparePasswords(currentPassword, dbUser.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'La contraseña actual es incorrecta' },
                { status: 403 }
            );
        }

        // Actualizar contraseña
        const hashedNewPassword = hashPassword(newPassword);
        db.prepare('UPDATE users SET password = ? WHERE id = ?')
            .run(hashedNewPassword, user.id);

        return NextResponse.json({
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
