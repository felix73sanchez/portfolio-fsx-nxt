// Script to seed the database with the current profile data
import { initializeDatabase } from '../src/lib/db/init';
import { updateSiteConfigBatch } from '../src/lib/db/site';

const profileData = {
    name: 'Felix Sánchez',
    title: "Bachelor's degree in information technology",
    subtitle: 'Developer',
    location: 'Santo Domingo, República Dominicana',
    about: 'Ingeniero de software especializado en desarrollo backend con .NET/C# y Java/Spring Framework, con sólida experiencia en Oracle Database (PL/SQL, procedimientos almacenados, optimización de queries). Experto en crear soluciones empresariales y robustas, diseñando APIs escalables y sistemas de alta disponibilidad. Apasionado por la tecnología, arquitecturas limpias y buenas prácticas de desarrollo.',
    email: 'felixsanchez73@outlook.com',
    phone: '+1(809)-405-0876',
    linkedin: 'https://www.linkedin.com/in/felixrsanchez/',
    github: 'https://github.com/felix73sanchez'
};

console.log('Initializing database...');
initializeDatabase();

console.log('Seeding profile data...');
updateSiteConfigBatch(profileData);

console.log('✓ Profile data seeded successfully!');
console.log('');
console.log('Profile configured:');
console.log(`  Name: ${profileData.name}`);
console.log(`  Title: ${profileData.title}`);
console.log(`  Location: ${profileData.location}`);
console.log(`  Email: ${profileData.email}`);
