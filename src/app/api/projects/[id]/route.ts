import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects';
import { getAuthFromCookies, requireOwnerFromCookies } from '@/lib/auth';
import { UpdateProjectInput } from '@/types';

// GET - Get single project
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const projectId = Number(id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const project = getProjectById(projectId);

        if (!project) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        if (!project.visible) {
            const auth = await getAuthFromCookies();
            if (!auth || auth.role !== 'owner') {
                return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
            }
        }

        return NextResponse.json(project);
    } catch {
        return NextResponse.json({ error: 'Error al obtener el proyecto' }, { status: 500 });
    }
}

// PUT - Update project (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireOwnerFromCookies();
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        const projectId = Number(id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const body: UpdateProjectInput = await request.json();

        const project = updateProject(projectId, body);

        if (!project) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        revalidatePath('/');
        revalidatePath('/proyectos');

        return NextResponse.json(project);
    } catch {
        return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
    }
}

// DELETE - Delete project (admin only)
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireOwnerFromCookies();
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        const projectId = Number(id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const deleted = deleteProject(projectId);

        if (!deleted) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        revalidatePath('/');
        revalidatePath('/proyectos');

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
    }
}
