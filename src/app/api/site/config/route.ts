import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { getSiteConfig, updateSiteConfigBatch, SiteConfig } from '@/lib/db/site';
import { verifyToken } from '@/lib/auth';

// Initialize database
initializeDatabase();

// GET - Get site config (public)
export async function GET() {
    try {
        const config = getSiteConfig();
        return NextResponse.json(config);
    } catch {
        return NextResponse.json({ error: 'Error fetching site config' }, { status: 500 });
    }
}

// PUT - Update site config (admin only)
export async function PUT(request: Request) {
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

        const body: Partial<SiteConfig> = await request.json();

        updateSiteConfigBatch(body);

        const updatedConfig = getSiteConfig();
        return NextResponse.json(updatedConfig);
    } catch {
        return NextResponse.json({ error: 'Error updating site config' }, { status: 500 });
    }
}
