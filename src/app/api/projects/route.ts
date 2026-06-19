import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { initializeDatabase } from '@/lib/db/init';
import { getVisibleProjects, getAllProjects, createProject } from '@/lib/db/projects';
import { getAuthFromCookies, requireOwnerFromCookies } from '@/lib/auth';
import { CreateProjectInput } from '@/types';

// Initialize database
initializeDatabase();

// GET - List projects (public: visible only, admin: all)
export async function GET() {
    try {
        const user = await getAuthFromCookies();

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
        const auth = await requireOwnerFromCookies();
        if (auth instanceof NextResponse) return auth;

        const body: CreateProjectInput = await request.json();

        if (!body.title || !body.description || !body.technologies?.length) {
            return NextResponse.json(
                { error: 'Título, descripción y tecnologías son requeridos' },
                { status: 400 }
            );
        }

        const project = createProject(body);

        revalidatePath('/');
        revalidatePath('/proyectos');

        return NextResponse.json(project, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
    }
}
