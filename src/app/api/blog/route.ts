import { NextRequest, NextResponse } from 'next/server';
import { getAllPublishedPosts, getAllPosts, getUserPosts, createPost } from '@/lib/db/blog';
import { getUserFromRequest } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';
import {
    validateRequiredString,
    validateOptionalString,
    validateOptionalBoolean,
    validateOptionalStringArray,
} from '@/lib/validate';

// GET: Obtener todos los posts (publicados para público, todos para admin)
export async function GET(request: NextRequest) {
    try {
        initializeDatabase();

        // Verificar si es admin autenticado
        const user = await getUserFromRequest(request);

        if (user) {
            // Owner: devuelve todos los posts. Editor: solo sus posts.
            const posts = user.role === 'owner' ? getAllPosts() : getUserPosts(user.id);
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

        const body: Record<string, unknown> = await request.json();
        const { title, description, content, coverImage, tags, published } = body;

        // Validaciones de tipos
        const titleErr = validateRequiredString(body, 'title');
        if (titleErr) return NextResponse.json({ error: titleErr.message }, { status: 400 });

        const contentErr = validateRequiredString(body, 'content');
        if (contentErr) return NextResponse.json({ error: contentErr.message }, { status: 400 });

        const tagsErr = validateOptionalStringArray(body, 'tags');
        if (tagsErr) return NextResponse.json({ error: tagsErr.message }, { status: 400 });

        const publishedErr = validateOptionalBoolean(body, 'published');
        if (publishedErr) return NextResponse.json({ error: publishedErr.message }, { status: 400 });

        const descErr = validateOptionalString(body, 'description');
        if (descErr) return NextResponse.json({ error: descErr.message }, { status: 400 });

        const coverErr = validateOptionalString(body, 'coverImage');
        if (coverErr) return NextResponse.json({ error: coverErr.message }, { status: 400 });

        // Validación pasó — narrowed types
        const postInput = {
            title: title as string,
            description: (description as string | undefined) ?? '',
            content: content as string,
            coverImage: coverImage as string | undefined,
            tags: (tags as string[] | undefined) ?? [],
            published: (published as boolean | undefined) ?? false,
            authorId: user.id,
        };

        // Crear post con el ID del autor
        const post = createPost(postInput);

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creando post:', error);
        return NextResponse.json(
            { error: 'Error al crear post' },
            { status: 500 }
        );
    }
}
