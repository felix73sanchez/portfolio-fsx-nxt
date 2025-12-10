'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BlogPost } from '@/types';
import { Header, Footer, MarkdownRenderer } from '@/components';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          setError(true);
        }
      } catch (_err) {
        console.error('Error fetching post:', _err);
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
        <div className="container text-center" style={{ paddingTop: '8rem' }}>
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
          <p className="mt-4" style={{ color: 'var(--gray)' }}>Cargando artículo...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <Header />
        <div className="container text-center" style={{ paddingTop: '8rem' }}>
          <h2 className="text-2xl font-bold mb-4">Artículo no encontrado</h2>
          <p style={{ color: 'var(--gray)' }} className="mb-6">El artículo no existe.</p>
          <Link href="/blog" className="cta-btn">Ver artículos</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(post.title);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      <article className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontSize: '0.875rem', color: 'var(--accent)' }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ← Volver al blog
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
          <p style={{ fontSize: '1.125rem', color: 'var(--gray)', lineHeight: 1.6, marginBottom: '32px' }}>
            {post.description}
          </p>

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
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time>{formattedDate}</time>
            </div>
            <span style={{ color: 'var(--border)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Share Section */}
          <div style={{ padding: '40px 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>¿Te gustó este artículo?</p>
            <p style={{ marginBottom: '32px', color: 'var(--gray)' }}>Compártelo con tu comunidad</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }} title="X">
                <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }} title="LinkedIn">
                <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }} title="Facebook">
                <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert('¡Enlace copiado!'); }} style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)', border: 'none', cursor: 'pointer', color: 'inherit' }} title="Copiar">
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </button>
            </div>
          </div>

          {/* Back to Blog */}
          <div style={{ textAlign: 'center', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <Link href="/blog" className="link-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ver más artículos
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
