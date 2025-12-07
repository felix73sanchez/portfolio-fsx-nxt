import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { getAllExperiences, createExperience, Experience } from '@/lib/db/site';
import { verifyToken } from '@/lib/auth';

initializeDatabase();

// GET - Get all experiences (public)
export async function GET() {
    try {
        const experiences = getAllExperiences();
        return NextResponse.json(experiences);
    } catch {
        return NextResponse.json({ error: 'Error fetching experiences' }, { status: 500 });
    }
}

// POST - Create experience (admin only)
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'> = await request.json();

        if (!body.title || !body.company) {
            return NextResponse.json({ error: 'Título y empresa son requeridos' }, { status: 400 });
        }

        const experience = createExperience(body);
        return NextResponse.json(experience, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error creating experience' }, { status: 500 });
    }
}
