import Link from 'next/link';
import { Header, Footer } from '@/components';
import { ensureDbReady } from '@/lib/db/ensure';
import { getAllPublishedPosts } from '@/lib/db/blog';
import { getSiteConfig } from '@/lib/db/site';
import { getVisibleProjects } from '@/lib/db/projects';

// Re-render at most once per minute so admin edits surface without a rebuild.
export const revalidate = 60;

export default async function Home() {
  ensureDbReady();

  const profile = getSiteConfig();
  const recentPosts = getAllPublishedPosts().slice(0, 3);
  const featuredProjects = getVisibleProjects().slice(0, 3);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-glow" aria-hidden="true" />

        {profile.location && (
          <span className="hero-eyebrow">
            <span className="hero-dot" aria-hidden="true" />
            {profile.location}
          </span>
        )}

        <h1 className="hero-name">{profile.name}</h1>

        <p className="hero-role">
          <span style={{ color: 'var(--accent)' }}>{profile.title}</span>
          {profile.subtitle && (
            <>
              <span className="hero-role-sep" aria-hidden="true">/</span>
              {profile.subtitle}
            </>
          )}
        </p>

        {/* Primary actions */}
        <div className="hero-actions">
          <Link href="/proyectos" className="cta-btn">
            Ver proyectos
          </Link>
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="btn-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contacto
            </a>
          )}
        </div>

        {/* Social links */}
        <div className="hero-socials">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
          {profile.twitter && (
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="X (Twitter)">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`} className="icon-btn" aria-label="Teléfono">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          )}
        </div>
      </section>

      {/* About teaser */}
      {profile.about && (
        <section className="section container">
          <h2 className="section-title"><span className="section-accent" aria-hidden="true" />Sobre mí</h2>
          <div className="glass-card" style={{ borderLeft: '3px solid var(--accent)', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <p style={{ color: 'var(--gray)', lineHeight: 1.8 }}>
              {profile.about}
            </p>
            <Link href="/sobre-mi" className="link-btn inline-flex items-center gap-2" style={{ marginTop: '1.5rem' }}>
              Conocer más
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="section container">
          <h2 className="section-title"><span className="section-accent" aria-hidden="true" />Proyectos destacados</h2>
          <div className="projects-grid" style={{ marginBottom: '1rem' }}>
            {featuredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-media">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} className="project-media-img" />
                  ) : (
                    <div className="project-media-fallback" aria-hidden="true">
                      <span>{project.title.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="mb-5" style={{ color: 'var(--gray)', lineHeight: 1.7 }}>
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap" style={{ gap: '0.75rem' }}>
                    {project.technologies.slice(0, 5).map(tech => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/proyectos" className="link-btn inline-flex items-center gap-2">
              Ver todos los proyectos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

{/* Recent Blog Posts */}
{recentPosts.length > 0 && (
  <section className="section container">
    <h2 className="section-title"><span className="section-accent" aria-hidden="true" />Últimos Artículos</h2>
    <div className="space-y-6" style={{ marginBottom: '1rem' }}>
      {recentPosts.map(post => (
        <Link key={post.id} href={`/blog/${post.slug}`} className="block project-card transition hover:border-[var(--accent)]">
          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
          <p style={{ color: 'var(--gray)' }} className="text-sm mb-2">{post.description}</p>
          <span style={{ color: 'var(--accent)' }} className="text-sm">
            {new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </Link>
      ))}
    </div>
    <div className="text-center">
      <Link href="/blog" className="link-btn inline-flex items-center gap-2">
        Ver todos los artículos
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  </section>
)}
{/* Contact CTA */}
<section className="section container text-center">
  <div className="cta-card">
    <h2 className="section-title" style={{ textAlign: 'center' }}><span className="section-accent" aria-hidden="true" />Construyamos algo juntos</h2>
    <p style={{ color: 'var(--gray)', maxWidth: '480px', margin: '0 auto', marginBottom: '2rem' }}>
      Siempre estoy interesado en desafíos, colaboración open source
      y construir sistemas que importan y aportan. Escríbeme.
    </p>
    {profile.email && (
<a 
  href={`mailto:${profile.email}`} 
  className="cta-btn"
  style={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    gap: '0.5rem' 
  }}
>
  <svg 
    style={{ width: '20px', height: '20px', flexShrink: 0, display: 'block' }} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
  Ponte en contacto
</a>
    )}
  </div>
</section>

      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
