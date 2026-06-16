// Script para poblar datos reales del perfil de Felix
import { initializeDatabase } from '../src/lib/db/init';
import { updateSiteConfigBatch, createExperience, createEducation, updateSkillsForCategory } from '../src/lib/db/site';
import { getDb } from '../src/lib/db/init';

console.log('Inicializando base de datos...');
initializeDatabase();

// Limpiar datos existentes
console.log('\nLimpiando datos anteriores...');
const db = getDb();
db.exec('DELETE FROM experiences');
db.exec('DELETE FROM education');
db.exec('DELETE FROM skills');
db.exec('DELETE FROM site_config');
db.exec('DELETE FROM projects');

// ==========================================
// PERFIL PROFESIONAL
// ==========================================

console.log('\nConfigurando perfil...');
updateSiteConfigBatch({
    name: 'Felix Sánchez',
    title: 'Backend Software Engineer',
    subtitle: 'Construyendo sistemas confiables a escala',
    location: 'Santo Domingo, República Dominicana',
    about: 'Ingeniero de backend con más de 3 años diseñando APIs, optimizando bases de datos Oracle y construyendo middleware que conecta plataformas bancarias de punta a punta — con .NET, Java/Spring y Node.js en producción todos los días. Me apasiona la arquitectura limpia, el código que otros ingenieros pueden mantener, y resolver problemas que realmente impactan cómo operan los negocios.\n\nFuera del trabajo mantengo un homelab con servicios self-hosted, contribuyo a proyectos open-source (GPL-3.0 y orgulloso), y soy entusiasta de GNU/Linux — porque creo que la mejor tecnología es la que puedes inspeccionar, modificar y controlar. Siempre buscando el próximo sistema que desarmar y entender.',
    email: 'felixsanchez73@outlook.com',
    phone: '+1(809)-405-0876',
    linkedin: 'https://www.linkedin.com/in/felixrsanchez/',
    github: 'https://github.com/felix73sanchez',
    twitter: ''
});
console.log('✓ Perfil configurado');

// ==========================================
// EXPERIENCIA LABORAL
// ==========================================

console.log('\nAgregando experiencia laboral...');

createExperience({
    title: 'Software Engineer',
    company: 'Asociación La Nacional',
    location: 'Santo Domingo, RD',
    startDate: 'Oct 2025',
    endDate: null,
    current: true,
    responsibilities: [
        'Diseñar y entregar reportes dinámicos que sirven a más de 200 usuarios internos en múltiples unidades de negocio',
        'Optimizar procedimientos almacenados Oracle PL/SQL, reduciendo el tiempo promedio de generación de reportes en un 40%',
        'Arquitecturar pipelines automatizados para flujos de reportes empresariales, reemplazando procesos manuales heredados'
    ],
    displayOrder: 1
});
console.log('✓ Asociación La Nacional');

createExperience({
    title: 'Software Developer',
    company: 'Banco BDI',
    location: 'Santo Domingo, RD',
    startDate: 'Oct 2023',
    endDate: 'Sep 2025',
    current: false,
    responsibilities: [
        'Construir y desplegar transacciones bancarias core usando PL/SQL y Oracle Forms, procesando miles de operaciones diarias',
        'Diseñar y desarrollar un sistema de entrega masiva de estados de cuenta con NestJS, automatizando la distribución a más de 10,000 clientes',
        'Mantener y extender middleware empresarial en tres stacks: C#/.NET, Java/Spring y Node.js',
        'Crear reportes de cumplimiento regulatorio con Oracle Reports, SSRS, Crystal Reports y JasperReports',
        'Gestionar flujos de control de versiones y pipelines CI con Git, GitHub y Bitbucket'
    ],
    displayOrder: 2
});
console.log('✓ Banco BDI');

// ==========================================
// EDUCACIÓN
// ==========================================

console.log('\nAgregando educación...');

createEducation({
    degree: 'Ingeniería en Tecnologías de la Información',
    institution: 'Universidad del Caribe',
    location: 'Santo Domingo, República Dominicana',
    startYear: 2019,
    endYear: 2023,
    current: false,
    description: 'Formación en ingeniería de software con énfasis en bases de datos, algoritmos y diseño de sistemas.',
    displayOrder: 1
});
console.log('✓ Universidad del Caribe');

// ==========================================
// HABILIDADES TÉCNICAS
// ==========================================

console.log('\nAgregando habilidades...');

updateSkillsForCategory('Lenguajes', ['Java', 'C#', 'TypeScript', 'JavaScript', 'PL/SQL', 'Python', 'Shell']);
console.log('✓ Lenguajes');

updateSkillsForCategory('Frameworks Backend', ['Spring Boot', '.NET Core', 'NestJS', 'Next.js']);
console.log('✓ Frameworks Backend');

updateSkillsForCategory('Bases de Datos', ['Oracle DB', 'SQL Server', 'PostgreSQL', 'SQLite', 'Redis']);
console.log('✓ Bases de Datos');

updateSkillsForCategory('DevOps e Infraestructura', ['Docker', 'Git', 'CI/CD', 'Azure DevOps', 'Linux', 'Nginx']);
console.log('✓ DevOps e Infraestructura');

updateSkillsForCategory('Arquitectura y Prácticas', ['REST APIs', 'Microservicios', 'Arquitectura Limpia', 'TDD']);
console.log('✓ Arquitectura y Prácticas');

// ==========================================
// PROYECTOS — Open Source y Backend
// ==========================================

console.log('\nAgregando proyectos...');

const now = new Date().toISOString();

// Factus — Sistema de facturación electrónica
db.prepare(`
  INSERT INTO projects (title, description, technologies, links, coverImage, displayOrder, visible, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    'Factus',
    'Sistema integral de facturación electrónica construido como desafío de integración. La API en Spring Boot maneja generación, validación y envío de facturas siguiendo estándares de facturación electrónica colombianos. El frontend en Next.js proporciona un dashboard limpio para gestionar facturas, clientes y productos.',
    JSON.stringify(['Java', 'Spring Boot', 'Next.js', 'React', 'TypeScript']),
    JSON.stringify([
        { label: 'Backend (API)', url: 'https://github.com/felix73sanchez/apifactus-spring', icon: 'backend' },
        { label: 'Frontend', url: 'https://github.com/felix73sanchez/front-factus', icon: 'frontend' },
        { label: 'Demo en vivo', url: 'https://factus-fsx.vercel.app', icon: 'demo' }
    ]),
    null,
    1,
    1,
    now,
    now
);
console.log('✓ Factus');

// Microservices Architecture — Backend puro
db.prepare(`
  INSERT INTO projects (title, description, technologies, links, coverImage, displayOrder, visible, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    'Microservices Architecture',
    'Implementación de referencia de una arquitectura de microservicios con Spring Boot. Explora descomposición de servicios, comunicación entre servicios y patrones de despliegue escalable — construido como ejercicio de aprendizaje y template reutilizable para sistemas en producción.',
    JSON.stringify(['Java', 'Spring Boot', 'Microservicios', 'REST API']),
    JSON.stringify([
        { label: 'Código fuente', url: 'https://github.com/felix73sanchez/microservices-architecture', icon: 'github' }
    ]),
    null,
    2,
    1,
    now,
    now
);
console.log('✓ Microservices Architecture');

// KontaVision — GNU/Linux + Open Source
db.prepare(`
  INSERT INTO projects (title, description, technologies, links, coverImage, displayOrder, visible, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    'KontaVision',
    'Herramienta de monitoreo y gestión de infraestructura open-source. Licenciada bajo GPL-3.0 porque creo firmemente que las mejores herramientas deben estar disponibles para todos. Construida con Shell scripting para mínimo overhead y máxima portabilidad en cualquier distribución GNU/Linux.',
    JSON.stringify(['Shell', 'Linux', 'Infraestructura', 'Open Source']),
    JSON.stringify([
        { label: 'Código fuente', url: 'https://github.com/felix73sanchez/KontaVision', icon: 'github' }
    ]),
    null,
    3,
    1,
    now,
    now
);
console.log('✓ KontaVision');

// FSX Homelab — Infraestructura como código
db.prepare(`
  INSERT INTO projects (title, description, technologies, links, coverImage, displayOrder, visible, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    'FSX Homelab',
    'Mi setup de infraestructura como código. Servicios self-hosted, despliegues automatizados y monitoreo — porque la mejor forma de entender DevOps es administrar tu propio entorno de producción en casa. Todo corriendo sobre GNU/Linux, orquestado con Docker y shell scripts.',
    JSON.stringify(['Docker', 'Shell', 'Linux', 'Nginx', 'Self-hosted']),
    JSON.stringify([
        { label: 'Código fuente', url: 'https://github.com/felix73sanchez/fsx-infrastructure-homelab', icon: 'github' }
    ]),
    null,
    4,
    1,
    now,
    now
);
console.log('✓ FSX Homelab');

// Oriontek Clients — API REST back-end
db.prepare(`
  INSERT INTO projects (title, description, technologies, links, coverImage, displayOrder, visible, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    'Oriontek Clients',
    'API REST de gestión de clientes construida como reto técnico. Arquitectura limpia, validación robusta y manejo de errores sólido — enfocada en hacer bien los fundamentos en lugar de sobrediseñar.',
    JSON.stringify(['Java', 'REST API', 'Arquitectura Limpia']),
    JSON.stringify([
        { label: 'Código fuente', url: 'https://github.com/felix73sanchez/oriontek-clients', icon: 'github' }
    ]),
    null,
    5,
    1,
    now,
    now
);
console.log('✓ Oriontek Clients');

// Portfolio
db.prepare(`
  INSERT INTO projects (title, description, technologies, links, coverImage, displayOrder, visible, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
    'Este Portfolio',
    'El sitio que estás viendo ahora. Construido con Next.js y SQLite, con panel de administración personalizado, motor de blog y paleta de comandos. Completamente self-hosted con Docker en un VPS con GNU/Linux, y abierto para que cualquiera pueda usarlo (licencia MIT).',
    JSON.stringify(['Next.js', 'TypeScript', 'SQLite', 'Docker']),
    JSON.stringify([
        { label: 'Código fuente', url: 'https://github.com/felix73sanchez/portfolio-fsx-nxt', icon: 'github' },
        { label: 'Sitio en vivo', url: 'https://portfolio.fsxsys.org', icon: 'website' }
    ]),
    null,
    6,
    1,
    now,
    now
);
console.log('✓ Portfolio');

console.log('\n✨ Todos los datos personales fueron cargados exitosamente.');
console.log('\nTu portafolio está configurado con contenido profesional.');
console.log('Puedes editar todo desde el panel de administración en /admin');
