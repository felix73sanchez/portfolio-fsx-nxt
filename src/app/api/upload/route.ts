import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getUserFromRequest } from '@/lib/auth';
import { createRateLimiter } from '@/lib/rate-limit';

// Rate limiter: max 10 uploads per hour per user
const uploadRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
    keyPrefix: 'upload',
    message: 'Demasiadas subidas. Intenta en 1 hora.',
});

// Magic bytes para validación real de tipo de archivo
const MAGIC_BYTES: Record<string, { bytes: number[]; offset: number }> = {
    'image/jpeg': { bytes: [0xFF, 0xD8, 0xFF], offset: 0 },
    'image/png': { bytes: [0x89, 0x50, 0x4E, 0x47], offset: 0 },
    'image/gif': { bytes: [0x47, 0x49, 0x46], offset: 0 },
    'image/webp': { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF header
};

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

// Map de extensión a MIME type esperado
const EXT_TO_MIME: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
};

function detectMimeFromBytes(buffer: Buffer): string | null {
    for (const [mime, sig] of Object.entries(MAGIC_BYTES)) {
        let match = true;
        for (let i = 0; i < sig.bytes.length; i++) {
            if (buffer[sig.offset + i] !== sig.bytes[i]) {
                match = false;
                break;
            }
        }
        if (match) return mime;
    }
    return null;
}

export async function POST(request: NextRequest) {
    // Rate limiting
    const rateLimitResponse = await uploadRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        // Verificar autenticación
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó ningún archivo' },
                { status: 400 }
            );
        }

        // 1. Validar extensión del archivo
        const ext = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext)) {
            return NextResponse.json(
                { error: 'Extensión no permitida. Solo: .jpg, .jpeg, .png, .gif, .webp' },
                { status: 400 }
            );
        }

        // 2. Validar tamaño (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'El archivo es demasiado grande. Máximo 5MB' },
                { status: 400 }
            );
        }

        // 3. Leer bytes para validación real de MIME
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const detectedMime = detectMimeFromBytes(buffer);
        const expectedMime = EXT_TO_MIME[ext];

        if (!detectedMime || !expectedMime) {
            return NextResponse.json(
                { error: 'No se pudo verificar el tipo del archivo' },
                { status: 400 }
            );
        }

        // 4. Validar que el MIME detectado coincida con la extensión
        if (detectedMime !== expectedMime) {
            return NextResponse.json(
                { error: 'El tipo real del archivo no coincide con su extensión' },
                { status: 400 }
            );
        }

        // 5. Validar MIME contra Content-Type declarado (defense in depth)
        const declaredMime = file.type.toLowerCase();
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (declaredMime && !allowedTypes.includes(declaredMime)) {
            return NextResponse.json(
                { error: 'Tipo MIME declarado no permitido' },
                { status: 400 }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).slice(2, 8);
        const sanitizedName = file.name
            .replace(/\.[^/.]+$/, '') // Remove extension
            .replace(/[^a-zA-Z0-9_-]/g, '-') // Replace special chars
            .replace(/\.\./g, '') // Remove path traversal
            .replace(/^[.-]+/, '') // Don't start with dot or dash
            .toLowerCase()
            .slice(0, 50); // Limit length

        const filename = `${timestamp}-${randomSuffix}-${sanitizedName}${ext}`;
        const filepath = path.join(uploadsDir, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({
            message: 'Imagen subida exitosamente',
            url,
            filename,
        });
    } catch (error) {
        console.error('Error subiendo imagen:', error);
        return NextResponse.json(
            { error: 'Error al subir la imagen' },
            { status: 500 }
        );
    }
}
