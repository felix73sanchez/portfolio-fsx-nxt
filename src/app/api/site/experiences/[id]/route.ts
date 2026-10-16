import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getExperienceById, updateExperience, deleteExperience } from '@/lib/db/site';
import { requireOwnerFromCookies } from '@/lib/auth';

// GET - Get experience by ID
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const expId = Number(id);
        if (!Number.isInteger(expId) || expId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const experience = getExperienceById(expId);

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
        const auth = await requireOwnerFromCookies();
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        const expId = Number(id);
        if (!Number.isInteger(expId) || expId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const body = await request.json();

        const experience = updateExperience(expId, body);

        if (!experience) {
            return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
        }

        revalidatePath('/');
        revalidatePath('/sobre-mi');

        return NextResponse.json(experience);
    } catch {
        return NextResponse.json({ error: 'Error updating experience' }, { status: 500 });
    }
}

// DELETE - Delete experience (admin only)
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireOwnerFromCookies();
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        const expId = Number(id);
        if (!Number.isInteger(expId) || expId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const deleted = deleteExperience(expId);

        if (!deleted) {
            return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
        }

        revalidatePath('/');
        revalidatePath('/sobre-mi');

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error deleting experience' }, { status: 500 });
    }
}
