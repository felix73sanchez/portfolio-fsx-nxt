'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BlogPost } from '@/types';
import { Header, Footer } from '@/components';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <Header />
        <div className="container text-center" style={{ paddingTop: '5rem' }}>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
          <p className="mt-4" style={{ color: 'var(--gray)' }}>Cargando...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <Header />
        <div className="container text-center" style={{ paddingTop: '5rem' }}>
          <p style={{ color: 'var(--gray)' }} className="mb-4">Artículo no encontrado.</p>
          <Link href="/blog" className="link-btn inline-flex">
            ← Volver al blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      <article className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: 'var(--gray)' }}>
            <time>{new Date(post.createdAt).toLocaleDateString('es-ES')}</time>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} style={{ color: 'var(--accent)' }}>#{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl" style={{ color: 'var(--gray)' }}>{post.description}</p>
        </div>

        {post.coverImage && (
          <div className="mb-12 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="mb-12">
          <div
            className="leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none"
            style={{ color: 'var(--gray)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Back to blog */}
        <div className="pt-12" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/blog" className="link-btn inline-flex">
            ← Volver al blog
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
