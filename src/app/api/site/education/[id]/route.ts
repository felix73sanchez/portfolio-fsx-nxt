import { NextResponse } from 'next/server';
import { getEducationById, updateEducation, deleteEducation } from '@/lib/db/site';
import { requireOwnerFromCookies } from '@/lib/auth';

// GET - Get education by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const education = getEducationById(parseInt(id));

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
        const body = await request.json();

        const education = updateEducation(parseInt(id), body);

        if (!education) {
            return NextResponse.json({ error: 'Educación no encontrada' }, { status: 404 });
        }

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
        const deleted = deleteEducation(parseInt(id));

        if (!deleted) {
            return NextResponse.json({ error: 'Educación no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error deleting education' }, { status: 500 });
    }
}
