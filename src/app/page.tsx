'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BlogPost } from '@/types';
import { Header, Footer } from '@/components';

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          setRecentPosts(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Felix Sánchez</h1>
          <p className="text-xl md:text-2xl mb-3" style={{ color: 'var(--gray)' }}>
            Bachelor's degree in information technology | Developer
          </p>
          <p className="text-lg flex items-center justify-center gap-2" style={{ color: 'var(--gray)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Santo Domingo, República Dominicana
          </p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <a
            href="mailto:felixsanchez73@outlook.com"
            className="link-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            felixsanchez73@outlook.com
          </a>
          <a
            href="tel:+18094050876"
            className="link-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +1(809)-405-0876
          </a>
          <a
            href="https://www.linkedin.com/in/felixrsanchez/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/felix73sanchez"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </section>

      {/* About */}
      <section className="section container">
        <h2 className="section-title">Sobre Mí</h2>
        <p style={{ color: 'var(--gray)' }} className="leading-relaxed text-lg">
          Ingeniero de software especializado en desarrollo backend con <strong style={{ color: 'var(--fg)' }}>.NET/C#</strong> y <strong style={{ color: 'var(--fg)' }}>Java/Spring Framework</strong>,
          con sólida experiencia en <strong style={{ color: 'var(--fg)' }}>Oracle Database</strong> (PL/SQL, procedimientos almacenados, optimización de queries).
          Experto en crear soluciones empresariales y robustas, diseñando APIs escalables y sistemas de alta disponibilidad.
          Apasionado por la tecnología, arquitecturas limpias y buenas prácticas de desarrollo.
        </p>
      </section>

      {/* Experience */}
      <section className="section container">
        <h2 className="section-title">Experiencia</h2>

        <div className="experience-item">
          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
            <h3 className="text-xl font-semibold">Ingeniero de Software</h3>
            <span style={{ color: 'var(--accent)' }} className="text-sm font-medium">Oct 2025 – Presente</span>
          </div>
          <p style={{ color: 'var(--gray)' }} className="font-medium mb-3">Asociación La Nacional • Santo Domingo, RD</p>
          <ul style={{ color: 'var(--gray)' }} className="space-y-2 list-disc list-inside">
            <li>Desarrollo de reportes dinámicos solicitados por usuarios internos de la institución</li>
            <li>Mantenimiento y optimización de procedimientos almacenados en Oracle Database</li>
            <li>Mejora continua de procesos de generación de reportes empresariales</li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
            <h3 className="text-xl font-semibold">Desarrollador</h3>
            <span style={{ color: 'var(--accent)' }} className="text-sm font-medium">Oct 2023 – Sep 2025</span>
          </div>
          <p style={{ color: 'var(--gray)' }} className="font-medium mb-3">Banco BDI • Santo Domingo, RD</p>
          <ul style={{ color: 'var(--gray)' }} className="space-y-2 list-disc list-inside">
            <li>Desarrollé e implementé transacciones para el Core Bancario usando PL/SQL y Oracle Forms</li>
            <li>Diseñé y desarrollé sistema de envío masivo de estados de cuenta con NestJS</li>
            <li>Mantuve y desarrollé mejoras del Middleware empresarial con C#/.NET, Java/Spring y Node.js</li>
            <li>Creé reportes para organismos reguladores usando Oracle Reports, SSRS, Crystal Reports y Jasper</li>
            <li>Gestioné repositorios de código fuente mediante Git, GitHub y BitBucket</li>
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="section container">
        <h2 className="section-title">Habilidades Técnicas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skill-category">
            <h4>Lenguajes</h4>
            <div className="flex flex-wrap gap-2">
              {['Java', 'C#', 'JavaScript', 'TypeScript', 'PL-SQL', 'Python'].map(skill => (
                <span key={skill} className="tech-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="skill-category">
            <h4>Frameworks</h4>
            <div className="flex flex-wrap gap-2">
              {['Spring Boot', '.NET', 'NestJS', 'Next.js', 'Angular'].map(skill => (
                <span key={skill} className="tech-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="skill-category">
            <h4>Bases de Datos</h4>
            <div className="flex flex-wrap gap-2">
              {['Oracle', 'MS SQL Server', 'PostgreSQL', 'SQLite', 'Redis'].map(skill => (
                <span key={skill} className="tech-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="skill-category">
            <h4>DevOps & Tools</h4>
            <div className="flex flex-wrap gap-2">
              {['Git', 'Docker', 'CI/CD', 'Azure DevOps', 'Postman'].map(skill => (
                <span key={skill} className="tech-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section container">
        <h2 className="section-title">Proyectos Destacados</h2>

        <div className="space-y-6">
          <div className="project-card">
            <h3 className="project-title">Sistema de Envío Masivo de Estados de Cuenta</h3>
            <p className="project-tech">NestJS • TypeScript • Oracle • Redis</p>
            <p className="project-description">Desarrollé un sistema automatizado para envío masivo de estados de cuenta de ahorros, procesando miles de mensualmente con alta confiabilidad.</p>
          </div>

          <div className="project-card">
            <h3 className="project-title">Middleware de Integración Bancaria</h3>
            <p className="project-tech">C#/.NET • Java/Spring Framework • Node.js • Oracle</p>
            <p className="project-description">Mantuve y desarrollé mejoras para el middleware que conecta diferentes sistemas del banco, garantizando la integridad de las transacciones.</p>
          </div>

          <div className="project-card">
            <h3 className="project-title">Reportes Regulatorios</h3>
            <p className="project-tech">Oracle Reports • SSRS • Crystal Reports • PL/SQL</p>
            <p className="project-description">Creé reportes complejos para entidades reguladoras (SIB, BCRD), asegurando el cumplimiento normativo del banco.</p>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section container">
        <h2 className="section-title">Educación</h2>

        <div className="project-card">
          <h3 className="text-xl font-semibold mb-2">Licenciatura en Tecnologías de la Información</h3>
          <p style={{ color: 'var(--gray)' }} className="font-medium">Universidad del Caribe</p>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="section container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title mb-0">Blog</h2>
          <Link href="/blog" className="hover:opacity-70 transition link-btn">
            Ver todos →
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="project-card cursor-pointer">
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <time style={{ color: 'var(--gray)' }} className="text-sm">{new Date(post.createdAt).toLocaleDateString('es-ES')}</time>
                  </div>
                  <p style={{ color: 'var(--gray)' }} className="text-sm">{post.description}</p>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--gray)' }} className="text-center py-8">
            No hay artículos publicados aún
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container text-center" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
        <h2 className="text-2xl font-bold mb-4">¿Interesado en colaborar?</h2>
        <p style={{ color: 'var(--gray)' }} className="mb-6">Siempre abierto a nuevos desafíos y oportunidades de desarrollo. ¡Hablemos!</p>
        <a href="mailto:felixsanchez73@outlook.com" className="cta-btn">
          Contactar
        </a>
      </section>

      <Footer />
    </main>
  );
}
