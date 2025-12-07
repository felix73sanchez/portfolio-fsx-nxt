import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects';
import { verifyToken } from '@/lib/auth';
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
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const user = verifyToken(token);
        if (!user) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
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
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const user = verifyToken(token);
        if (!user) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
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
