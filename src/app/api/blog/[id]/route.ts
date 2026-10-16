import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostById, updatePost, deletePost } from '@/lib/db/blog';
import { getUserFromRequest } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db/init';
import {
    validateOptionalString,
    validateOptionalBoolean,
    validateOptionalStringArray,
} from '@/lib/validate';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: Obtener un post por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        initializeDatabase();
        const { id } = await params;
        const postId = Number(id);
        if (!Number.isInteger(postId) || postId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const post = getPostById(postId);

        if (!post) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }

        // Público: solo posts publicados
        if (post.published) {
            return NextResponse.json(post);
        }

        // No publicado: requiere autenticación
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }

        // Editor solo ve sus propios posts
        if (user.role !== 'owner' && post.authorId !== user.id) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
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
        const postId = Number(id);
        if (!Number.isInteger(postId) || postId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        // Editor solo puede editar sus propios posts
        const existing = getPostById(postId);
        if (!existing) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }
        if (user.role !== 'owner' && existing.authorId !== user.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        const body: Record<string, unknown> = await request.json();

        // Validar tipos de campos opcionales si están presentes
        const tagsErr = validateOptionalStringArray(body, 'tags');
        if (tagsErr) return NextResponse.json({ error: tagsErr.message }, { status: 400 });

        const publishedErr = validateOptionalBoolean(body, 'published');
        if (publishedErr) return NextResponse.json({ error: publishedErr.message }, { status: 400 });

        const descErr = validateOptionalString(body, 'description');
        if (descErr) return NextResponse.json({ error: descErr.message }, { status: 400 });

        const contentErr = validateOptionalString(body, 'content');
        if (contentErr) return NextResponse.json({ error: contentErr.message }, { status: 400 });

        const coverErr = validateOptionalString(body, 'coverImage');
        if (coverErr) return NextResponse.json({ error: coverErr.message }, { status: 400 });

        const titleRequired = validateOptionalString(body, 'title');
        if (titleRequired) return NextResponse.json({ error: titleRequired.message }, { status: 400 });

        const { title, description, content, coverImage, tags, published } = body;

        const post = updatePost(postId, {
            title: title as string | undefined,
            description: description as string | undefined,
            content: content as string | undefined,
            coverImage: coverImage as string | undefined,
            tags: tags as string[] | undefined,
            published: published as boolean | undefined,
        });

        revalidatePath('/');
        revalidatePath('/blog');
        revalidatePath(`/blog/${existing.slug}`);
        revalidatePath(`/blog/${post.slug}`);

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
        const postId = Number(id);
        if (!Number.isInteger(postId) || postId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        // Editor solo puede eliminar sus propios posts
        const existing = getPostById(postId);
        if (!existing) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }
        if (user.role !== 'owner' && existing.authorId !== user.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        const deleted = deletePost(postId);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Post no encontrado' },
                { status: 404 }
            );
        }

        revalidatePath('/');
        revalidatePath('/blog');
        revalidatePath(`/blog/${existing.slug}`);

        return NextResponse.json({ message: 'Post eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando post:', error);
        return NextResponse.json(
            { error: 'Error al eliminar post' },
            { status: 500 }
        );
    }
}
