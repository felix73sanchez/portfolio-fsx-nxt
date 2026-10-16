import Link from 'next/link';
import { Footer, Header } from '@/components';
import { BlogIndexRow, ProjectIndexRow, PublicSectionLabel } from '@/components/public';
import { ensureDbReady } from '@/lib/db/ensure';
import { getAllPublishedPosts } from '@/lib/db/blog';
import { getSiteConfig } from '@/lib/db/site';
import { getRecentProjects } from '@/lib/db/projects';

export const revalidate = 60;

export default async function Home() {
  ensureDbReady();
  const profile = getSiteConfig();
  const recentPosts = getAllPublishedPosts().slice(0, 3);
  const featuredProjects = getRecentProjects(3);
  const aboutParagraphs = profile.about.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="public-page">
      <Header github={profile.github} linkedin={profile.linkedin} phone={profile.phone} />
      <div className="public-right-header font-mono">01 / portfolio técnico · lectura continua</div>

      <div className="public-content">
        <section className="public-section-grid public-hero" id="home">
          <PublicSectionLabel index="01 /">Inicio</PublicSectionLabel>
          <div className="public-hero-content">
            <h1>{profile.name}</h1>
            <div className="public-hero-lockup">
              <p className="public-role font-mono">{profile.title}</p>
              {profile.subtitle && <p className="public-mission">{profile.subtitle}</p>}
            </div>
            <div className="public-actions">
              <Link href="/proyectos" className="public-primary-action">
                Ver proyectos <span className="public-action-arrow" aria-hidden="true">↘</span>
              </Link>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="public-secondary-action">
                  Contacto <span className="public-action-arrow" aria-hidden="true">↗</span>
                </a>
              )}
            </div>
            <div className="public-hero-socials font-mono" aria-label="Redes sociales">
              {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>}
              {profile.phone && <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>Teléfono <span aria-hidden="true">↗</span></a>}
            </div>
          </div>
        </section>

        {profile.about && (
          <section className="public-section-grid public-about" id="about">
            <PublicSectionLabel index="02 /">Sobre mí</PublicSectionLabel>
            <div className="public-about-content">
              <div>
                <p className="public-about-lead">{aboutParagraphs[0]}</p>
                {aboutParagraphs.slice(1).map((paragraph, index) => <p key={index} className="public-about-secondary">{paragraph}</p>)}
                <Link href="/sobre-mi" className="public-about-link font-mono">Conocer más <span aria-hidden="true">↗</span></Link>
              </div>
              <aside className="public-about-aside font-mono">
                <strong>Perfil</strong>
                <br /><br />
                {profile.title}
                <br />{profile.location}
                {profile.email && <><br /><br />{profile.email}</>}
              </aside>
            </div>
          </section>
        )}

        {featuredProjects.length > 0 && (
          <section className="public-section-grid public-projects" id="projects">
            <PublicSectionLabel index="03 /">Proyectos</PublicSectionLabel>
            <div className="public-section-main">
              <div className="public-heading-row">
                <h2>Proyectos destacados</h2>
                <span className="font-mono">{String(featuredProjects.length).padStart(2, '0')} resultados</span>
              </div>
              <div className="public-project-list">
                {featuredProjects.map((project, index) => <ProjectIndexRow key={project.id} project={project} index={index + 1} />)}
              </div>
              <div className="public-view-all-wrap"><Link href="/proyectos" className="public-view-all font-mono">Ver todos los proyectos ↗</Link></div>
            </div>
          </section>
        )}

        {recentPosts.length > 0 && (
          <section className="public-section-grid public-articles" id="articles">
            <PublicSectionLabel index="04 /">Blog</PublicSectionLabel>
            <div className="public-section-main">
              <div className="public-heading-row">
                <h2>Últimos artículos</h2>
                <span className="font-mono">{String(recentPosts.length).padStart(2, '0')} recientes</span>
              </div>
              {recentPosts.map((post) => <BlogIndexRow key={post.id} post={post} />)}
              <div className="public-view-all-wrap"><Link href="/blog" className="public-view-all font-mono">Ver todos los artículos ↗</Link></div>
            </div>
          </section>
        )}

        <section className="public-section-grid public-contact">
          <PublicSectionLabel index="05 /">Contacto</PublicSectionLabel>
          <div className="public-contact-content">
            <h2>Construyamos algo juntos</h2>
            {profile.email && <a href={`mailto:${profile.email}`} className="public-primary-action">Ponte en contacto <span className="public-action-arrow" aria-hidden="true">↗</span></a>}
          </div>
        </section>
      </div>

      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
