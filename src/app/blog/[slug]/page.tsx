import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer, ShareBar, TableOfContents } from '@/components';
import MarkdownRenderer from '@/components/MarkdownRendererDynamic';
import { ensureDbReady } from '@/lib/db/ensure';
import { getAllPublishedPosts, getPostBySlug } from '@/lib/db/blog';
import { getSiteConfig } from '@/lib/db/site';
import { extractToc } from '@/lib/toc';
import { SITE_URL } from '@/lib/site-url';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  ensureDbReady();
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Artículo no encontrado' };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const publishedTime = post.publishedAt || post.createdAt;

  return {
    title: post.title,
    description: post.description || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      type: 'article',
      url,
      publishedTime,
      authors: post.authorName ? [post.authorName] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  ensureDbReady();
  const post = getPostBySlug(slug);
  const profile = getSiteConfig();

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const url = `${SITE_URL}/blog/${post.slug}`;
  const toc = extractToc(post.content);

  // Related posts: published posts ranked by number of shared tags.
  const related = getAllPublishedPosts()
    .filter((p) => p.id !== post.id)
    .map((p) => ({ post: p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .filter((x) => x.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        new Date(b.post.publishedAt || b.post.createdAt).getTime() -
          new Date(a.post.publishedAt || a.post.createdAt).getTime()
    )
    .slice(0, 3)
    .map((x) => x.post);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
    keywords: post.tags?.join(', ') || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <article style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div className="blog-layout">
          <div className="blog-main">

          {/* Back link */}
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontSize: '0.875rem', color: 'var(--accent)' }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al blog
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{ fontSize: '0.75rem', fontWeight: 500, padding: '6px 16px', borderRadius: '9999px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '24px', lineHeight: 1.1 }}>
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p style={{ fontSize: '1.125rem', color: 'var(--gray)', lineHeight: 1.6, marginBottom: '32px' }}>
              {post.description}
            </p>
          )}

          {/* Author & Meta - Horizontal */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginBottom: '48px', fontSize: '0.875rem', color: 'var(--gray)' }}>
            {post.authorName && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, background: 'var(--accent)', color: '#fff' }}>
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{post.authorName}</span>
                </div>
                <span style={{ color: 'var(--border)' }}>|</span>
              </>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.publishedAt || post.createdAt}>{formattedDate}</time>
            </div>
            <span style={{ color: 'var(--border)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min de lectura</span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div style={{ marginBottom: '48px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: 'auto' }} />
            </div>
          )}

          {/* Content */}
          <div style={{ marginBottom: '64px' }}>
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
                Artículos relacionados
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="project-card"
                    style={{ display: 'block' }}
                  >
                    {rel.tags.length > 0 && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {rel.tags[0]}
                      </span>
                    )}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '6px 0 4px' }}>
                      {rel.title}
                    </h3>
                    {rel.description && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray)' }} className="line-clamp-2">
                        {rel.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Share Section */}
          <ShareBar url={url} title={post.title} />

          {/* Back to Blog */}
          <div style={{ textAlign: 'center', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <Link href="/blog" className="link-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ver más artículos
            </Link>
          </div>
          </div>

          <aside className="blog-aside">
            <TableOfContents items={toc} />
          </aside>
        </div>
      </article>

      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
