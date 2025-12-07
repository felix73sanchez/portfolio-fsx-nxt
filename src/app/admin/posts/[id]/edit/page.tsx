'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          setTitle(data.title);
          setDescription(data.description);
          setContent(data.content);
          setTags(data.tags ? data.tags.join(', ') : '');
          setCoverImage(data.coverImage || '');
          setPublished(data.published);
        } else {
          setError('Artículo no encontrado');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Error al cargar el artículo');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  // Track changes
  useEffect(() => {
    if (post) {
      const changed =
        title !== post.title ||
        description !== post.description ||
        content !== post.content ||
        tags !== (post.tags?.join(', ') || '') ||
        coverImage !== (post.coverImage || '') ||
        published !== post.published;
      setHasChanges(changed);
    }
  }, [title, description, content, tags, coverImage, published, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Título y contenido son requeridos');
      return;
    }

    setSaving(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: description || title.substring(0, 100),
          content,
          tags: tags ? tags.split(',').map(t => t.trim()) : [],
          coverImage: coverImage || null,
          published
        })
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar artículo');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
            <p style={{ color: 'var(--gray)' }}>Cargando artículo...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !post) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <header className="header">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="logo">
              <span className="logo-bracket">&lt;</span>
              <span className="logo-text">FSX</span>
              <span className="logo-bracket">/&gt;</span>
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Artículo no encontrado</h2>
          <p className="mb-4" style={{ color: 'var(--gray)' }}>{error}</p>
          <Link href="/admin/dashboard" className="cta-btn">
            Volver al dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <header className="header">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="logo">
              <span className="logo-bracket">&lt;</span>
              <span className="logo-text">FSX</span>
              <span className="logo-bracket">/&gt;</span>
            </Link>
            <span className="text-xs px-2 py-1 rounded font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}>ADMIN</span>
            {hasChanges && (
              <span className="text-xs px-2 py-1 rounded font-medium"
                style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }}>
                Sin guardar
              </span>
            )}
          </div>
          <Link href="/admin/dashboard" className="link-btn text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Editar artículo</h1>
          <p style={{ color: 'var(--gray)' }}>Modifica el contenido de tu artículo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {error && post && (
                <div className="p-4 rounded-lg flex items-center gap-3"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg transition outline-none text-lg font-medium"
                  style={{
                    background: 'var(--light-gray)',
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                  placeholder="Un título atractivo para tu artículo"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Descripción breve</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg transition outline-none resize-none"
                  style={{
                    background: 'var(--light-gray)',
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                  placeholder="Resumen corto que aparecerá en el listado del blog"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    Contenido <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className="text-sm flex items-center gap-1 transition"
                    style={{ color: 'var(--accent)' }}
                  >
                    {preview ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Vista previa
                      </>
                    )}
                  </button>
                </div>

                {preview ? (
                  <div
                    className="w-full px-4 py-3 rounded-lg min-h-[300px] prose prose-invert max-w-none"
                    style={{
                      background: 'var(--light-gray)',
                      border: '1px solid var(--border)'
                    }}
                    dangerouslySetInnerHTML={{ __html: content || '<p style="color: var(--gray)">El contenido aparecerá aquí...</p>' }}
                  />
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={15}
                    className="w-full px-4 py-3 rounded-lg transition outline-none resize-none font-mono text-sm"
                    style={{
                      background: 'var(--light-gray)',
                      border: '1px solid var(--border)',
                      color: 'var(--fg)'
                    }}
                    placeholder="Escribe el contenido de tu artículo aquí..."
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Card */}
              <div className="project-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Publicación
                </h3>

                <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition"
                  style={{ background: published ? 'rgba(34, 197, 94, 0.1)' : 'var(--light-gray)' }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 rounded accent-green-500"
                  />
                  <div>
                    <p className="font-medium">Publicado</p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>
                      {published ? 'Visible públicamente' : 'Guardado como borrador'}
                    </p>
                  </div>
                </label>

                <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    type="submit"
                    disabled={saving || !hasChanges}
                    className="w-full py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar cambios
                      </>
                    )}
                  </button>

                  <Link
                    href={`/blog/${post?.slug}`}
                    target="_blank"
                    className="w-full py-3 font-medium rounded-lg transition flex items-center justify-center gap-2"
                    style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ver artículo
                  </Link>
                </div>
              </div>

              {/* Tags */}
              <div className="project-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Etiquetas
                </h3>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition outline-none text-sm"
                  style={{
                    background: 'var(--light-gray)',
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                  placeholder="backend, java, arquitectura"
                />
                {tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                      <span key={i} className="tech-badge text-xs">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div className="project-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Imagen de portada
                </h3>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition outline-none text-sm"
                  style={{
                    background: 'var(--light-gray)',
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {coverImage && (
                  <div className="mt-3 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <img src={coverImage} alt="Preview" className="w-full h-32 object-cover"
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                  </div>
                )}
              </div>

              {/* Meta Info */}
              {post && (
                <div className="project-card text-sm" style={{ color: 'var(--gray)' }}>
                  <p className="mb-2">
                    <strong>Creado:</strong>{' '}
                    {new Date(post.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                  <p>
                    <strong>Actualizado:</strong>{' '}
                    {new Date(post.updatedAt).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
