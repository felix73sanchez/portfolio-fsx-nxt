import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getEducationById, updateEducation, deleteEducation } from '@/lib/db/site';
import { requireOwnerFromCookies } from '@/lib/auth';

// GET - Get education by ID
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const eduId = Number(id);
        if (!Number.isInteger(eduId) || eduId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const education = getEducationById(eduId);

        if (!education) {
            return NextResponse.json({ error: 'Educación no encontrada' }, { status: 404 });
        }

        return NextResponse.json(education);
    } catch {
        return NextResponse.json({ error: 'Error fetching education' }, { status: 500 });
    }
}

// PUT - Update education (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireOwnerFromCookies();
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        const eduId = Number(id);
        if (!Number.isInteger(eduId) || eduId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const body = await request.json();

        const education = updateEducation(eduId, body);

        if (!education) {
            return NextResponse.json({ error: 'Educación no encontrada' }, { status: 404 });
        }

        revalidatePath('/');
        revalidatePath('/sobre-mi');

        return NextResponse.json(education);
    } catch {
        return NextResponse.json({ error: 'Error updating education' }, { status: 500 });
    }
}

// DELETE - Delete education (admin only)
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireOwnerFromCookies();
        if (auth instanceof NextResponse) return auth;

        const { id } = await params;
        const eduId = Number(id);
        if (!Number.isInteger(eduId) || eduId <= 0) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const deleted = deleteEducation(eduId);

        if (!deleted) {
            return NextResponse.json({ error: 'Educación no encontrada' }, { status: 404 });
        }

        revalidatePath('/');
        revalidatePath('/sobre-mi');

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error deleting education' }, { status: 500 });
    }
}
