import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer, Header, ShareBar, TableOfContents } from '@/components';
import { BlogIndexRow } from '@/components/public';
import MarkdownRenderer from '@/components/MarkdownRendererDynamic';
import { ensureDbReady } from '@/lib/db/ensure';
import { getAllPublishedPosts, getPostBySlug } from '@/lib/db/blog';
import { getSiteConfig } from '@/lib/db/site';
import { extractToc } from '@/lib/toc';
import { SITE_URL } from '@/lib/site-url';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  ensureDbReady();
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Artículo no encontrado' };
  return {
    title: post.title,
    description: post.description || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description || undefined, type: 'article', url: `${SITE_URL}/blog/${post.slug}`, publishedTime: post.publishedAt || post.createdAt, authors: post.authorName ? [post.authorName] : undefined, tags: post.tags },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description || undefined },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  ensureDbReady();
  const post = getPostBySlug(slug);
  const profile = getSiteConfig();
  if (!post || !post.published) notFound();

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  const readingTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));
  const url = `${SITE_URL}/blog/${post.slug}`;
  const toc = extractToc(post.content);
  const related = getAllPublishedPosts()
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({ post: candidate, shared: candidate.tags.filter((tag) => post.tags.includes(tag)).length }))
    .filter((candidate) => candidate.shared > 0)
    .sort((a, b) => b.shared - a.shared || new Date(b.post.publishedAt || b.post.createdAt).getTime() - new Date(a.post.publishedAt || a.post.createdAt).getTime())
    .slice(0, 3)
    .map((candidate) => candidate.post);

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
    <main className="public-page public-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header github={profile.github} linkedin={profile.linkedin} phone={profile.phone} />
      <div className="public-right-header font-mono">04 / blog · lectura técnica</div>

      <article className="public-article-layout-wrapper">
        <div className="public-article-layout">
          <div className="public-article-main">
            <Link href="/blog" className="public-article-back">↖ Volver al blog</Link>
            {post.tags.length > 0 && <div className="public-article-tags">{post.tags.map((tag) => <span key={tag} className="public-article-tag"># {tag}</span>)}</div>}
            <h1 className="public-article-title">{post.title}</h1>
            {post.description && <p className="public-article-description">{post.description}</p>}

            <div className="public-article-meta font-mono">
              {post.authorName && <div className="public-article-meta-item"><span className="public-article-avatar">{post.authorName.charAt(0).toUpperCase()}</span><span>{post.authorName}</span></div>}
              <div className="public-article-meta-item"><span aria-hidden="true">◷</span><time dateTime={post.publishedAt || post.createdAt}>{formattedDate}</time></div>
              <div className="public-article-meta-item"><span aria-hidden="true">◌</span><span>{readingTime} min de lectura</span></div>
            </div>

            {post.coverImage && <div className="public-article-cover"><img src={post.coverImage} alt={`Portada de ${post.title}`} /></div>}

            <div className="public-article-content">
              <MarkdownRenderer content={post.content} />
            </div>

            {related.length > 0 && (
              <section className="public-article-related">
                <h2>Artículos relacionados</h2>
                <div>{related.map((relatedPost) => <BlogIndexRow key={relatedPost.id} post={relatedPost} />)}</div>
              </section>
            )}

            <div className="public-article-share"><ShareBar url={url} title={post.title} /></div>
            <div className="public-article-back-link"><Link href="/blog" className="public-view-all font-mono">↖ Ver más artículos</Link></div>
          </div>
          <aside className="public-article-aside"><TableOfContents items={toc} /></aside>
        </div>
      </article>

      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
