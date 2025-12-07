import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { getSkillsByCategory, updateSkillsForCategory } from '@/lib/db/site';
import { verifyToken } from '@/lib/auth';

initializeDatabase();

// GET - Get all skills grouped by category (public)
export async function GET() {
    try {
        const skills = getSkillsByCategory();
        return NextResponse.json(skills);
    } catch {
        return NextResponse.json({ error: 'Error fetching skills' }, { status: 500 });
    }
}

// PUT - Update skills for a category (admin only)
export async function PUT(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body: { category: string; skills: string[] } = await request.json();

        if (!body.category || !Array.isArray(body.skills)) {
            return NextResponse.json({ error: 'Categoría y habilidades son requeridas' }, { status: 400 });
        }

        updateSkillsForCategory(body.category, body.skills);

        const updatedSkills = getSkillsByCategory();
        return NextResponse.json(updatedSkills);
    } catch {
        return NextResponse.json({ error: 'Error updating skills' }, { status: 500 });
    }
}
