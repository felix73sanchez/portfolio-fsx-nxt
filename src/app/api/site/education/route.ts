import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { getAllEducation, createEducation, Education } from '@/lib/db/site';
import { verifyToken } from '@/lib/auth';

initializeDatabase();

// GET - Get all education (public)
export async function GET() {
    try {
        const education = getAllEducation();
        return NextResponse.json(education);
    } catch {
        return NextResponse.json({ error: 'Error fetching education' }, { status: 500 });
    }
}

// POST - Create education (admin only)
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body: Omit<Education, 'id' | 'createdAt' | 'updatedAt'> = await request.json();

        if (!body.degree || !body.institution) {
            return NextResponse.json({ error: 'Título y institución son requeridos' }, { status: 400 });
        }

        const education = createEducation(body);
        return NextResponse.json(education, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error creating education' }, { status: 500 });
    }
}
