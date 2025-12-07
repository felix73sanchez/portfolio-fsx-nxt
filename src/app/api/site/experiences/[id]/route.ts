import { NextResponse } from 'next/server';
import { getExperienceById, updateExperience, deleteExperience } from '@/lib/db/site';
import { verifyToken } from '@/lib/auth';

// GET - Get experience by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const experience = getExperienceById(parseInt(id));

        if (!experience) {
            return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
        }

        return NextResponse.json(experience);
    } catch {
        return NextResponse.json({ error: 'Error fetching experience' }, { status: 500 });
    }
}

// PUT - Update experience (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const experience = updateExperience(parseInt(id), body);

        if (!experience) {
            return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
        }

        return NextResponse.json(experience);
    } catch {
        return NextResponse.json({ error: 'Error updating experience' }, { status: 500 });
    }
}

// DELETE - Delete experience (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const deleted = deleteExperience(parseInt(id));

        if (!deleted) {
            return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error deleting experience' }, { status: 500 });
    }
}
