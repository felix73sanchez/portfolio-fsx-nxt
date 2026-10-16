import Link from 'next/link';
import type { BlogPost } from '@/types';

interface BlogIndexRowProps {
  post: BlogPost;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace('.', '').toUpperCase();
}

export default function BlogIndexRow({ post }: BlogIndexRowProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="public-article-row group">
      <time className="public-row-date font-mono" dateTime={post.createdAt}>
        {formatDate(post.createdAt)}
        {post.authorName && <span>{post.authorName}</span>}
      </time>
      <div className="public-row-main">
        <div className="public-row-heading">
          <h3>{post.title}</h3>
          <span className="public-row-arrow" aria-hidden="true">↗</span>
        </div>
        {post.description && <p className="public-row-description">{post.description}</p>}
      </div>
      <div className="public-row-meta font-mono">
        {post.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
        <span className="public-row-read">Leer artículo ↗</span>
      </div>
    </Link>
  );
}
