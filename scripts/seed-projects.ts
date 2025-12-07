// Script to seed the database with the original projects
import { getDb, initializeDatabase } from '../src/lib/db/init';

const projects = [
    {
        title: 'Factus',
        description: 'Challenge de integración de facturación electrónica. Sistema completo con backend en Spring Boot y frontend en Next.js/React para la gestión y emisión de facturas electrónicas cumpliendo con los estándares dominicanos.',
        technologies: JSON.stringify(['Java', 'Spring Boot', 'Next.js', 'React', 'TypeScript']),
        links: JSON.stringify([
            { label: 'Backend', url: 'https://github.com/felixsanchez', icon: 'backend' },
            { label: 'Frontend', url: 'https://github.com/felixsanchez', icon: 'frontend' }
        ]),
        displayOrder: 1,
        visible: 1
    },
    {
        title: 'Decade Shop',
        description: 'Prototipo de e-commerce para tienda de ropa (DECA). Desarrollado con TypeScript y Next.js, incluye carrito de compras, gestión de productos y sistema de checkout.',
        technologies: JSON.stringify(['TypeScript', 'Next.js', 'React', 'Tailwind CSS']),
        links: JSON.stringify([
            { label: 'GitHub', url: 'https://github.com/felixsanchez', icon: 'github' }
        ]),
        displayOrder: 2,
        visible: 1
    },
    {
        title: 'Sistema de Gestión Bancaria',
        description: 'Plataforma integral de gestión de operaciones bancarias con múltiples módulos de procesamiento de transacciones, reportes y administración de cuentas.',
        technologies: JSON.stringify(['C#', '.NET Core', 'SQL Server', 'Azure']),
        links: JSON.stringify([
            { label: 'GitHub', url: 'https://github.com/felixsanchez', icon: 'github' }
        ]),
        displayOrder: 3,
        visible: 1
    },
    {
        title: 'Portfolio Personal',
        description: 'Sitio portafolio con sección de blog integrada, autenticación personalizada y panel de administración para gestión de contenido.',
        technologies: JSON.stringify(['Next.js', 'TypeScript', 'SQLite', 'Tailwind CSS']),
        links: JSON.stringify([
            { label: 'GitHub', url: 'https://github.com/felixsanchez/portfolio-fsx', icon: 'github' }
        ]),
        displayOrder: 4,
        visible: 1
    }
];

async function seedProjects() {
    console.log('Initializing database...');
    initializeDatabase();

    const db = getDb();
    const now = new Date().toISOString();

    console.log('Seeding projects...');

    const stmt = db.prepare(`
    INSERT INTO projects (title, description, technologies, links, displayOrder, visible, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

    for (const project of projects) {
        try {
            stmt.run(
                project.title,
                project.description,
                project.technologies,
                project.links,
                project.displayOrder,
                project.visible,
                now,
                now
            );
            console.log(`✓ Created: ${project.title}`);
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
                console.log(`⚠ Already exists: ${project.title}`);
            } else {
                console.error(`✗ Error creating ${project.title}:`, error);
            }
        }
    }

    console.log('\nDone! Projects seeded successfully.');
}

seedProjects();
