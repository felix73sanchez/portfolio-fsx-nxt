// Script to seed all site content (experiences, education, skills)
import { initializeDatabase } from '../src/lib/db/init';
import { createExperience, createEducation, updateSkillsForCategory } from '../src/lib/db/site';

console.log('Initializing database...');
initializeDatabase();

// ==========================================
// EXPERIENCES
// ==========================================

const experiences = [
    {
        title: 'Software Developer',
        company: 'Banco Múltiple BHD León',
        location: 'Santo Domingo, RD',
        startDate: 'Octubre 2022',
        endDate: null,
        current: true,
        responsibilities: [
            'Desarrollo y mantenimiento de aplicaciones empresariales con .NET/C# y Java/Spring',
            'Diseño e implementación de APIs RESTful escalables',
            'Optimización de consultas y procedimientos almacenados en Oracle Database',
            'Colaboración en equipos ágiles para entrega continua de valor',
            'Implementación de mejoras de rendimiento en sistemas críticos'
        ],
        displayOrder: 1
    },
    {
        title: 'Junior Developer',
        company: 'Freelance',
        location: 'Santo Domingo, RD',
        startDate: 'Enero 2020',
        endDate: 'Septiembre 2022',
        current: false,
        responsibilities: [
            'Desarrollo de aplicaciones web con React y Next.js',
            'Creación de APIs con Node.js y Express',
            'Mantenimiento de bases de datos SQL y NoSQL',
            'Trabajo directo con clientes para definir requerimientos'
        ],
        displayOrder: 2
    }
];

console.log('\nSeeding experiences...');
for (const exp of experiences) {
    try {
        createExperience(exp);
        console.log(`✓ Created experience: ${exp.title} at ${exp.company}`);
    } catch (error) {
        console.log(`⚠ Error creating ${exp.title}:`, error);
    }
}

// ==========================================
// EDUCATION
// ==========================================

const educationItems = [
    {
        degree: 'Bachelor\'s degree in Information Technology',
        institution: 'Universidad Abierta para Adultos (UAPA)',
        location: 'Santiago, República Dominicana',
        startYear: 2018,
        endYear: 2022,
        current: false,
        description: 'Enfoque en desarrollo de software y sistemas de información empresariales',
        displayOrder: 1
    },
    {
        degree: 'Técnico en Desarrollo de Software',
        institution: 'ITLA',
        location: 'Santo Domingo, República Dominicana',
        startYear: 2016,
        endYear: 2018,
        current: false,
        description: 'Formación técnica en programación y bases de datos',
        displayOrder: 2
    }
];

console.log('\nSeeding education...');
for (const edu of educationItems) {
    try {
        createEducation(edu);
        console.log(`✓ Created education: ${edu.degree} at ${edu.institution}`);
    } catch (error) {
        console.log(`⚠ Error creating ${edu.degree}:`, error);
    }
}

// ==========================================
// SKILLS
// ==========================================

const skillsData: Record<string, string[]> = {
    'Backend': ['.NET', 'C#', 'Java', 'Spring Boot', 'Node.js', 'Python', 'API REST'],
    'Frontend': ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    'Base de Datos': ['Oracle Database', 'PL/SQL', 'SQL Server', 'PostgreSQL', 'MySQL', 'SQLite'],
    'DevOps & Tools': ['Git', 'Azure DevOps', 'Docker', 'CI/CD', 'Linux', 'Postman'],
    'Metodologías': ['Scrum', 'Agile', 'Clean Architecture', 'SOLID', 'Design Patterns']
};

console.log('\nSeeding skills...');
for (const [category, skills] of Object.entries(skillsData)) {
    try {
        updateSkillsForCategory(category, skills);
        console.log(`✓ Created category: ${category} with ${skills.length} skills`);
    } catch (error) {
        console.log(`⚠ Error creating ${category}:`, error);
    }
}

console.log('\n✨ All content seeded successfully!');
console.log('\nSummary:');
console.log(`  - ${experiences.length} experiences`);
console.log(`  - ${educationItems.length} education entries`);
console.log(`  - ${Object.keys(skillsData).length} skill categories`);
