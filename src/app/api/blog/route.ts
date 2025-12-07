import { NextRequest, NextResponse } from 'next/server';
import { getAllPublishedPosts, getAllPosts, createPost } from '@/lib/db/blog';
import { getUserFromRequest } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';

// GET: Obtener todos los posts (publicados para público, todos para admin)
export async function GET(request: NextRequest) {
    try {
        initializeDatabase();

        // Verificar si es admin autenticado
        const user = await getUserFromRequest(request);

        if (user) {
            // Admin autenticado: devuelve todos los posts
            const posts = getAllPosts();
            return NextResponse.json(posts);
        } else {
            // Público: solo posts publicados
            const posts = getAllPublishedPosts();
            return NextResponse.json(posts);
        }
    } catch (error) {
        console.error('Error obteniendo posts:', error);
        return NextResponse.json(
            { error: 'Error al obtener posts' },
            { status: 500 }
        );
    }
}

// POST: Crear nuevo post (requiere autenticación)
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { title, description, content, coverImage, tags, published } = body;

        // Validaciones
        if (!title || !content) {
            return NextResponse.json(
                { error: 'Título y contenido son requeridos' },
                { status: 400 }
            );
        }

        // Crear post con el ID del autor
        const post = createPost({
            title,
            description: description || '',
            content,
            coverImage,
            tags: tags || [],
            published: published || false,
            authorId: user.id,
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creando post:', error);
        return NextResponse.json(
            { error: 'Error al crear post' },
            { status: 500 }
        );
    }
}
