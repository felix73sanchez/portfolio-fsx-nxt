// Script to seed all of Felix's real personal data
import { initializeDatabase } from '../src/lib/db/init';
import { updateSiteConfigBatch, createExperience, createEducation, updateSkillsForCategory } from '../src/lib/db/site';
import { getDb } from '../src/lib/db/init';

console.log('Initializing database...');
initializeDatabase();

// Clear existing data
console.log('\nClearing existing data...');
const db = getDb();
db.exec('DELETE FROM experiences');
db.exec('DELETE FROM education');
db.exec('DELETE FROM skills');
db.exec('DELETE FROM site_config');

// ==========================================
// PROFILE DATA
// ==========================================

console.log('\nSeeding profile...');
updateSiteConfigBatch({
    name: 'Felix Sánchez',
    title: "Bachelor's degree in information technology",
    subtitle: 'Developer',
    location: 'Santo Domingo, República Dominicana',
    about: 'Ingeniero de software especializado en desarrollo backend con .NET/C# y Java/Spring Framework, con sólida experiencia en Oracle Database (PL/SQL, procedimientos almacenados, optimización de queries). Experto en crear soluciones empresariales y robustas, diseñando APIs escalables y sistemas de alta disponibilidad. Apasionado por la tecnología, arquitecturas limpias y buenas prácticas de desarrollo.',
    email: 'felixsanchez73@outlook.com',
    phone: '+1(809)-405-0876',
    linkedin: 'https://www.linkedin.com/in/felixrsanchez/',
    github: 'https://github.com/felix73sanchez'
});
console.log('✓ Profile configured');

// ==========================================
// EXPERIENCES - Felix's real work history
// ==========================================

console.log('\nSeeding experiences...');

createExperience({
    title: 'Ingeniero de Software',
    company: 'Asociación La Nacional',
    location: 'Santo Domingo, RD',
    startDate: 'Oct 2025',
    endDate: null,
    current: true,
    responsibilities: [
        'Desarrollo de reportes dinámicos solicitados por usuarios internos de la institución',
        'Mantenimiento y optimización de procedimientos almacenados en Oracle Database',
        'Mejora continua de procesos de generación de reportes empresariales'
    ],
    displayOrder: 1
});
console.log('✓ Asociación La Nacional');

createExperience({
    title: 'Desarrollador',
    company: 'Banco BDI',
    location: 'Santo Domingo, RD',
    startDate: 'Oct 2023',
    endDate: 'Sep 2025',
    current: false,
    responsibilities: [
        'Desarrollé e implementé transacciones para el Core Bancario usando PL/SQL y Oracle Forms',
        'Diseñé y desarrollé sistema de envío masivo de estados de cuenta con NestJS',
        'Mantuve y desarrollé mejoras del Middleware empresarial con C#/.NET, Java/Spring y Node.js',
        'Creé reportes para organismos reguladores usando Oracle Reports, SSRS, Crystal Reports y Jasper',
        'Gestioné repositorios de código fuente mediante Git, GitHub y BitBucket'
    ],
    displayOrder: 2
});
console.log('✓ Banco BDI');

// ==========================================
// EDUCATION - Felix's real education
// ==========================================

console.log('\nSeeding education...');

createEducation({
    degree: 'Licenciatura en Tecnologías de la Información',
    institution: 'Universidad del Caribe',
    location: 'Santo Domingo, República Dominicana',
    startYear: 2019,
    endYear: 2023,
    current: false,
    description: null,
    displayOrder: 1
});
console.log('✓ Universidad del Caribe');

// ==========================================
// SKILLS - Felix's real skills from page.tsx
// ==========================================

console.log('\nSeeding skills...');

updateSkillsForCategory('Lenguajes', ['Java', 'C#', 'JavaScript', 'TypeScript', 'PL-SQL', 'Python']);
console.log('✓ Lenguajes');

updateSkillsForCategory('Frameworks', ['Spring Boot', '.NET', 'NestJS', 'Next.js', 'Angular']);
console.log('✓ Frameworks');

updateSkillsForCategory('Bases de Datos', ['Oracle', 'MS SQL Server', 'PostgreSQL', 'SQLite', 'Redis']);
console.log('✓ Bases de Datos');

updateSkillsForCategory('DevOps & Tools', ['Git', 'Docker', 'CI/CD', 'Azure DevOps', 'Postman']);
console.log('✓ DevOps & Tools');

console.log('\n✨ All personal data seeded successfully!');
console.log('\nYour portfolio is now configured with your real information.');
console.log('You can edit everything from the admin panel at /admin');
