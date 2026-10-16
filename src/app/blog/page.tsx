import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer, Header } from '@/components';
import { BlogIndexRow, PublicSectionLabel } from '@/components/public';
import { ensureDbReady } from '@/lib/db/ensure';
import { getAllPublishedPosts } from '@/lib/db/blog';
import { getSiteConfig } from '@/lib/db/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Este espacio es sobre mi vida y lo que voy descubriendo en el camino, la tecnología incluida.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  ensureDbReady();
  const posts = getAllPublishedPosts();
  const profile = getSiteConfig();

  return (
    <main className="public-page">
      <Header github={profile.github} linkedin={profile.linkedin} phone={profile.phone} />
      <div className="public-right-header font-mono">04 / blog · archivo editorial</div>
      <div className="public-content">
        <section className="public-section-grid public-articles">
          <PublicSectionLabel index="04 /">Blog</PublicSectionLabel>
          <div className="public-section-main">
            <header className="public-page-intro">
              <p className="public-kicker font-mono">Notas y aprendizajes</p>
              <h1>Blog</h1>
              <p>Este espacio es sobre mi vida y lo que voy descubriendo en el camino, la tecnología incluida.</p>
            </header>

            {posts.length === 0 ? (
              <div className="public-empty-state">
                <h2>No hay artículos todavía</h2>
                <p>Recuerda, nunca es tarde para empezar.</p>
                <Link href="/" className="public-view-all font-mono">Volver al inicio ↗</Link>
              </div>
            ) : (
              <>
                <div className="public-index-heading font-mono"><span>Fecha / Autor</span><span>Artículo / Etiquetas</span></div>
                <div className="public-article-list">{posts.map((post) => <BlogIndexRow key={post.id} post={post} />)}</div>
                <div className="public-return-link"><Link href="/blog" className="public-view-all font-mono">Ver todos los artículos ↗</Link></div>
              </>
            )}

            {posts.length > 0 && (
              <div className="public-follow-band">
                <div>
                  <p className="public-kicker font-mono">Más contenido</p>
                  <h2>¿Te interesa el contenido?</h2>
                  <p>Sígueme en mis redes; si te interesa, puedes preguntarme lo que desees saber.</p>
                </div>
                <div className="public-follow-links">
                  <a href="https://github.com/felix73sanchez" target="_blank" rel="noopener noreferrer" className="public-view-all font-mono">GitHub ↗</a>
                  <a href="https://www.linkedin.com/in/felixrsanchez/" target="_blank" rel="noopener noreferrer" className="public-view-all font-mono">LinkedIn ↗</a>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
