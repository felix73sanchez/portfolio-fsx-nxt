'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components';
import { BlogPost } from '@/types';
import { MarkdownRenderer } from '@/components';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
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
          setError('Articulo no encontrado');
        }
      } catch (_err) {
        console.error('Error fetching post:', _err);
        setError('Error al cargar el articulo');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al subir imagen');
      }
    } catch {
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const insertMarkdown = (syntax: string, wrap = false) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    let newText = '';
    if (wrap && selected) {
      newText = content.substring(0, start) + syntax.replace('$1', selected) + content.substring(end);
    } else {
      newText = content.substring(0, start) + syntax + content.substring(end);
    }

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newPos = wrap ? start + syntax.indexOf('$1') + selected.length : start + syntax.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Titulo y contenido son requeridos');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
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
        router.push('/admin/posts');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al actualizar articulo');
      }
    } catch (_err) {
      setError('Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Editar artículo" subtitle="Cargando…">
        <div className="content-loading">
          <div className="content-spinner" />
          <p className="content-loading-text">Cargando artículo…</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !post) {
    return (
      <AdminLayout title="Editar artículo">
        <div className="content-empty">
          <h2 className="content-empty-title">Artículo no encontrado</h2>
          <p className="content-empty-text">{error}</p>
          <Link href="/admin/posts" className="admin-btn admin-btn-primary">
            Volver a artículos
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Editar artículo"
      subtitle="Modifica el contenido y metadatos de tu publicación"
      actions={
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="content-badge draft">
              Sin guardar
            </span>
          )}
          <Link href="/admin/posts" className="admin-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="admin-editor-grid">
          {/* Main Content */}
          <div className="admin-layout-stack">
            {error && post && (
              <div className="admin-message error" role="alert">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <section className="admin-form-section">
              <div className="admin-card-list">
                <div className="admin-form-field">
                  <label className="admin-form-label">
                    Título <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="admin-form-input"
                    placeholder="Un título atractivo para tu artículo"
                  />
                </div>

                <div className="admin-form-field">
                  <label className="admin-form-label">Descripción breve</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="admin-form-textarea"
                    placeholder="Resumen corto que aparecerá en el listado del blog"
                  />
                </div>
              </div>
            </section>

            {/* Content */}
            <section className="admin-form-section">
              <div className="flex items-center justify-between mb-3">
                <label className="admin-form-label">
                  Contenido (Markdown) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="admin-btn admin-btn-sm"
                >
                  {preview ? (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Vista previa
                    </>
                  )}
                </button>
              </div>

              {!preview && (
                <div className="admin-md-toolbar">
                  <button type="button" onClick={() => insertMarkdown('**$1**', true)} className="admin-md-btn" title="Negrita">B</button>
                  <button type="button" onClick={() => insertMarkdown('*$1*', true)} className="admin-md-btn" title="Cursiva"><em>I</em></button>
                  <div className="admin-md-divider" />
                  <button type="button" onClick={() => insertMarkdown('\n## ')} className="admin-md-btn" title="Título H2">H2</button>
                  <button type="button" onClick={() => insertMarkdown('\n### ')} className="admin-md-btn" title="Título H3">H3</button>
                  <div className="admin-md-divider" />
                  <button type="button" onClick={() => insertMarkdown('\n- ')} className="admin-md-btn" title="Lista">• Lista</button>
                  <button type="button" onClick={() => insertMarkdown('`$1`', true)} className="admin-md-btn" title="Código inline">`code`</button>
                  <button type="button" onClick={() => insertMarkdown('\n```\n$1\n```\n', true)} className="admin-md-btn" title="Bloque de código">{'{ }'}</button>
                  <button type="button" onClick={() => insertMarkdown('[texto](url)')} className="admin-md-btn" title="Enlace">Link</button>
                  <button type="button" onClick={() => insertMarkdown('\n> ')} className="admin-md-btn" title="Cita">❝</button>
                </div>
              )}

              {preview ? (
                <div
                  className="w-full px-6 py-5 min-h-[380px]"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p style={{ color: 'var(--gray)' }}>El contenido aparecerá aquí…</p>
                  )}
                </div>
              ) : (
                <textarea
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={18}
                  className="admin-form-textarea font-mono text-sm"
                  placeholder="Escribe el contenido de tu artículo aquí…"
                />
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="admin-layout-stack">
            {/* Publish Card */}
            <section className="admin-form-section">
              <h3 className="admin-form-section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Publicación
              </h3>

              <label
                className="flex items-center gap-3 p-3 cursor-pointer transition"
                style={{
                  background: published ? 'rgba(52, 211, 153, 0.08)' : 'var(--bg)',
                  border: `1px solid ${published ? 'rgba(52, 211, 153, 0.3)' : 'var(--border)'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
                <div>
                  <p className="font-medium text-sm">Publicado</p>
                  <p className="text-xs" style={{ color: 'var(--gray)' }}>
                    {published ? 'Visible públicamente' : 'Guardado como borrador'}
                  </p>
                </div>
              </label>

              <div className="mt-4 pt-4 admin-card-list" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="admin-btn admin-btn-primary"
                  style={{ width: '100%' }}
                >
                  {saving ? (
                    <>
                      <span className="auth-spinner" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar cambios
                    </>
                  )}
                </button>

                <Link
                  href={`/blog/${post?.slug}`}
                  target="_blank"
                  className="admin-btn"
                  style={{ width: '100%' }}
                >
                  Ver artículo ↗
                </Link>
              </div>
            </section>

            {/* Tags */}
            <section className="admin-form-section">
              <h3 className="admin-form-section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Etiquetas
              </h3>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="admin-form-input"
                placeholder="backend, java, arquitectura"
              />
              {tags && (
                <div className="admin-tags-wrap" style={{ marginTop: '0.75rem' }}>
                  {tags.split(',').filter(t => t.trim()).map((tag, i) => (
                    <span key={i} className="admin-tag">#{tag.trim()}</span>
                  ))}
                </div>
              )}
            </section>

            {/* Cover Image */}
            <section className="admin-form-section">
              <h3 className="admin-form-section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imagen de portada
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />

              {!coverImage ? (
                <>
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className="cursor-pointer transition-all duration-200 text-center"
                    style={{
                      background: 'var(--bg)',
                      border: '1px dashed var(--border-strong)',
                      padding: '1.75rem 1rem',
                    }}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="content-spinner" />
                        <p className="text-sm">Subiendo imagen…</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-medium text-sm">Seleccionar imagen de portada</p>
                        <p className="auth-hint">JPG · PNG · WebP · GIF (máx. 5MB)</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    <span className="auth-hint">o URL externa</span>
                    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  </div>

                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="admin-form-input"
                    placeholder="https://..."
                  />
                </>
              ) : (
                <div style={{ border: '1px solid var(--border)' }}>
                  <img
                    src={coverImage}
                    alt="Imagen de portada"
                    className="w-full object-cover"
                    style={{ height: '180px' }}
                  />
                  <div className="flex items-center justify-end gap-2 p-2.5" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="admin-btn admin-btn-sm">
                      Cambiar
                    </button>
                    <button type="button" onClick={() => setCoverImage('')} className="admin-btn admin-btn-sm admin-btn-danger">
                      Quitar
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Meta Info */}
            {post && (
              <section className="admin-form-section">
                <div className="admin-card-meta" style={{ marginTop: 0 }}>
                  Creado: {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="admin-card-meta">
                  Actualizado: {new Date(post.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </section>
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
