'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Header, Footer } from '@/components';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg" style={{ color: 'var(--gray)' }}>
            Artículos sobre desarrollo backend, arquitectura de software y mejores prácticas.
          </p>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
            <p className="mt-4" style={{ color: 'var(--gray)' }}>Cargando artículos...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            {/* Empty State Illustration */}
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto" style={{ color: 'var(--border)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No hay artículos aún</h3>
            <p style={{ color: 'var(--gray)' }} className="mb-6">
              Próximamente compartiré artículos sobre desarrollo backend y arquitectura.
            </p>
            <Link href="/" className="cta-btn">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article
                  className="project-card cursor-pointer group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeIn 0.5s ease forwards'
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Content */}
                    <div className="flex-1">
                      {/* Meta */}
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--gray)' }}>
                        <time className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(post.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="tech-badge text-xs"
                                  style={{ padding: '0.2rem 0.5rem' }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition">
                        {post.title}
                      </h2>

                      {/* Description */}
                      <p style={{ color: 'var(--gray)' }} className="line-clamp-2 mb-4">
                        {post.description}
                      </p>

                      {/* Read More */}
                      <span className="inline-flex items-center gap-2 text-sm font-medium transition group-hover:gap-3"
                        style={{ color: 'var(--accent)' }}>
                        Leer artículo
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>

                    {/* Cover Image */}
                    {post.coverImage && (
                      <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ border: '1px solid var(--border)' }}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        {posts.length > 0 && (
          <div className="project-card text-center mt-12" style={{ background: 'var(--light-gray)' }}>
            <h3 className="text-xl font-bold mb-2">¿Te interesa el contenido?</h3>
            <p style={{ color: 'var(--gray)' }} className="mb-4">
              Sígueme en mis redes para más artículos y tips de desarrollo.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/felix73sanchez"
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/felixrsanchez/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
