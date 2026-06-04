import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects';
import { getAuthFromCookies } from '@/lib/auth';
import { UpdateProjectInput } from '@/types';

// GET - Get single project
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = getProjectById(parseInt(id));

        if (!project) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch {
        return NextResponse.json({ error: 'Error fetching project' }, { status: 500 });
    }
}

// PUT - Update project (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await getAuthFromCookies())) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const body: UpdateProjectInput = await request.json();

        const project = updateProject(parseInt(id), body);

        if (!project) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

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
        if (!(await getAuthFromCookies())) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const deleted = deleteProject(parseInt(id));

        if (!deleted) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
    }
}
