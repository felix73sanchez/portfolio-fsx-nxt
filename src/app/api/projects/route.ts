import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { getVisibleProjects, getAllProjects, createProject } from '@/lib/db/projects';
import { verifyToken } from '@/lib/auth';
import { CreateProjectInput } from '@/types';

// Initialize database
initializeDatabase();

// GET - List projects (public: visible only, admin: all)
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        const user = token ? verifyToken(token) : null;

        // If authenticated admin, return all projects
        if (user) {
            const projects = getAllProjects();
            return NextResponse.json(projects);
        }

        // Public: only visible projects
        const projects = getVisibleProjects();
        return NextResponse.json(projects);
    } catch {
        return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
    }
}

// POST - Create project (admin only)
export async function POST(request: Request) {
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

        const body: CreateProjectInput = await request.json();

        if (!body.title || !body.description || !body.technologies?.length) {
            return NextResponse.json(
                { error: 'Título, descripción y tecnologías son requeridos' },
                { status: 400 }
            );
        }

        const project = createProject(body);
        return NextResponse.json(project, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
    }
}
