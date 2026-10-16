import Link from 'next/link';
import type { BlogPost } from '@/types';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card group">
      <article className="grid gap-6 md:grid-cols-[minmax(0,1fr)_13rem] md:items-start">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            {post.authorName && <span>· {post.authorName}</span>}
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tech-badge text-xs">#{tag}</span>
            ))}
          </div>
          <h2 className="mb-3 text-xl font-bold md:text-2xl transition-colors group-hover:text-[var(--accent)]">
            {post.title}
          </h2>
          {post.description && (
            <p className="mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {post.description}
            </p>
          )}
          <span className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Leer artículo
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>

        {post.coverImage && (
          <div className="aspect-video overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] md:aspect-[4/3]">
            <img
              src={post.coverImage}
              alt={`Portada de ${post.title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </article>
    </Link>
  );
}
