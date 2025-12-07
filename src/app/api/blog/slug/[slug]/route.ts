import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/db/blog';
import { getUserFromRequest } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// GET: Obtener un post por slug
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        initializeDatabase();
        const { slug } = await params;
        const post = getPostBySlug(slug);

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
