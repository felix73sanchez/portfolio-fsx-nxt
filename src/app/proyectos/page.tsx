import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer, Header } from '@/components';
import { ProjectIndexRow, PublicSectionLabel } from '@/components/public';
import { ensureDbReady } from '@/lib/db/ensure';
import { getVisibleProjects } from '@/lib/db/projects';
import { getSiteConfig } from '@/lib/db/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Algunos de mis trabajos personales y experimentos con tecnologías modernas.',
  alternates: { canonical: '/proyectos' },
};

export default function ProyectosPage() {
  ensureDbReady();
  const projects = getVisibleProjects();
  const profile = getSiteConfig();

  return (
    <main className="public-page">
      <Header github={profile.github} linkedin={profile.linkedin} phone={profile.phone} />
      <div className="public-right-header font-mono">03 / proyectos · índice técnico</div>
      <div className="public-content">
        <section className="public-section-grid public-projects">
          <PublicSectionLabel index="03 /">Proyectos</PublicSectionLabel>
          <div className="public-section-main">
            <header className="public-page-intro">
              <p className="public-kicker font-mono">Trabajo seleccionado</p>
              <h1>Proyectos</h1>
              <p>Algunos de mis trabajos personales y experimentos con tecnologías modernas.</p>
            </header>

            {projects.length === 0 ? (
              <div className="public-empty-state">
                <h2>Próximamente</h2>
                <p>Los proyectos se están preparando...</p>
              </div>
            ) : (
              <>
                <div className="public-index-heading font-mono"><span>Índice / Proyecto</span><span>Tecnologías / Enlaces</span></div>
                <div className="public-project-list public-project-list-single">
                  {projects.map((project, index) => <ProjectIndexRow key={project.id} project={project} index={index + 1} />)}
                </div>
              </>
            )}

            <div className="public-return-link"><Link href="/" className="public-view-all font-mono">↖ Volver al inicio</Link></div>
          </div>
        </section>
      </div>
      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
