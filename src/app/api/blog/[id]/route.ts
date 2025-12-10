import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/db/blog';
import { getUserFromRequest } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: Obtener un post por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        initializeDatabase();
        const { id } = await params;
        const post = getPostById(parseInt(id));

        if (!post) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }

        // Si no está publicado, verificar autenticación
        if (!post.published) {
            const user = await getUserFromRequest(request);
            if (!user) {
                return NextResponse.json(
                    { error: 'Post no encontrado' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error obteniendo post:', error);
        return NextResponse.json(
            { error: 'Error al obtener post' },
            { status: 500 }
        );
    }
}

// PUT: Actualizar post (requiere autenticación)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        initializeDatabase();

        // Verificar autenticación
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { title, description, content, coverImage, tags, published } = body;

        const post = updatePost(parseInt(id), {
            title,
            description,
            content,
            coverImage,
            tags,
            published,
        });

        return NextResponse.json(post);
    } catch (error: unknown) {
        console.error('Error actualizando post:', error);

        if (error instanceof Error && error.message === 'Post not found') {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Error al actualizar post' },
            { status: 500 }
        );
    }
}

// DELETE: Eliminar post (requiere autenticación)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        initializeDatabase();

        // Verificar autenticación
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const deleted = deletePost(parseInt(id));

        if (!deleted) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Post eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando post:', error);
        return NextResponse.json(
            { error: 'Error al eliminar post' },
            { status: 500 }
        );
    }
}
