'use client';

import Link from 'next/link';
import { Header, Footer } from '@/components';

interface Proyecto {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links?: {
    label: string;
    url: string;
    icon?: 'github' | 'backend' | 'frontend' | 'demo';
  }[];
}

const proyectos: Proyecto[] = [
  {
    id: '1',
    title: 'Factus',
    description: 'Challenge de integración de facturación electrónica. Sistema completo con backend en Spring Boot y frontend en Next.js/React para la gestión y emisión de facturas electrónicas cumpliendo con los estándares dominicanos.',
    technologies: ['Java', 'Spring Boot', 'Next.js', 'React', 'TypeScript'],
    links: [
      { label: 'Backend', url: 'https://github.com/felixsanchez', icon: 'backend' },
      { label: 'Frontend', url: 'https://github.com/felixsanchez', icon: 'frontend' }
    ]
  },
  {
    id: '2',
    title: 'Decade Shop',
    description: 'Prototipo de e-commerce para tienda de ropa (DECA). Desarrollado con TypeScript y Next.js, incluye carrito de compras, gestión de productos y sistema de checkout.',
    technologies: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
    links: [
      { label: 'GitHub', url: 'https://github.com/felixsanchez', icon: 'github' }
    ]
  },
  {
    id: '3',
    title: 'Sistema de Gestión Bancaria',
    description: 'Plataforma integral de gestión de operaciones bancarias con múltiples módulos de procesamiento de transacciones, reportes y administración de cuentas.',
    technologies: ['C#', '.NET Core', 'SQL Server', 'Azure'],
    links: [
      { label: 'GitHub', url: 'https://github.com/felixsanchez', icon: 'github' }
    ]
  },
  {
    id: '4',
    title: 'Portfolio Personal',
    description: 'Sitio portafolio con sección de blog integrada, autenticación personalizada y panel de administración para gestión de contenido.',
    technologies: ['Next.js', 'TypeScript', 'SQLite', 'Tailwind CSS'],
    links: [
      { label: 'GitHub', url: 'https://github.com/felixsanchez/portfolio-fsx', icon: 'github' }
    ]
  }
];

const getIcon = (icon?: string) => {
  switch (icon) {
    case 'github':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      );
    case 'backend':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      );
    case 'frontend':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
  }
};

export default function ProyectosPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Proyectos</h1>
          <p className="text-lg" style={{ color: 'var(--gray)' }}>
            Algunos de mis trabajos personales y experimentos con tecnologías modernas.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8 mb-16">
          {proyectos.map((proyecto) => (
            <div key={proyecto.id} className="project-card">
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold mb-4">{proyecto.title}</h2>

              {/* Description */}
              <p className="mb-6" style={{ color: 'var(--gray)', lineHeight: 1.7 }}>
                {proyecto.description}
              </p>

              {/* Technologies - Simple clean design without icons */}
              <div style={{ marginBottom: '24px' }}>
                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                  {proyecto.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="tech-badge"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {proyecto.links && proyecto.links.length > 0 && (
                <div
                  className="flex flex-wrap"
                  style={{
                    gap: '12px',
                    paddingTop: '20px',
                    marginTop: '8px',
                    borderTop: '1px solid var(--border)'
                  }}
                >
                  {proyecto.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={link.icon === 'backend' || link.icon === 'frontend' ? 'icon-badge' : 'link-btn'}
                    >
                      {getIcon(link.icon)}
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to home */}
        <div className="text-center pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/" className="link-btn inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
