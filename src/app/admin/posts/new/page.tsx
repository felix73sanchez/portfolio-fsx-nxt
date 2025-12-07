'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MarkdownRenderer } from '@/components';

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al subir imagen');
      }
    } catch (err) {
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

    // Restore focus after state update
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
      setError('Título y contenido son requeridos');
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
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
        setError(data.error || 'Error al crear artículo');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

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
          </div>
          <Link href="/admin/dashboard" className="link-btn text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crear nuevo artículo</h1>
          <p style={{ color: 'var(--gray)' }}>
            Escribe en <strong>Markdown</strong> - Los headers, listas, código y más se formatearán automáticamente
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
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
                    Contenido (Markdown) <span style={{ color: '#ef4444' }}>*</span>
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

                {/* Markdown Toolbar */}
                {!preview && (
                  <div className="flex flex-wrap gap-1 mb-2 p-2 rounded-t-lg" style={{ background: 'var(--light-gray)', borderBottom: '1px solid var(--border)' }}>
                    <button type="button" onClick={() => insertMarkdown('**$1**', true)} className="p-2 rounded hover:bg-[var(--border)] transition" title="Negrita">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" /></svg>
                    </button>
                    <button type="button" onClick={() => insertMarkdown('*$1*', true)} className="p-2 rounded hover:bg-[var(--border)] transition" title="Cursiva">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" /></svg>
                    </button>
                    <div className="w-px mx-1" style={{ background: 'var(--border)' }}></div>
                    <button type="button" onClick={() => insertMarkdown('\n## ')} className="p-2 rounded hover:bg-[var(--border)] transition text-sm font-bold" title="Título H2">H2</button>
                    <button type="button" onClick={() => insertMarkdown('\n### ')} className="p-2 rounded hover:bg-[var(--border)] transition text-sm font-bold" title="Título H3">H3</button>
                    <div className="w-px mx-1" style={{ background: 'var(--border)' }}></div>
                    <button type="button" onClick={() => insertMarkdown('\n- ')} className="p-2 rounded hover:bg-[var(--border)] transition" title="Lista">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" /></svg>
                    </button>
                    <button type="button" onClick={() => insertMarkdown('`$1`', true)} className="p-2 rounded hover:bg-[var(--border)] transition" title="Código inline">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
                    </button>
                    <button type="button" onClick={() => insertMarkdown('\n```\n$1\n```\n', true)} className="p-2 rounded hover:bg-[var(--border)] transition text-xs font-mono" title="Bloque de código">{'{ }'}</button>
                    <button type="button" onClick={() => insertMarkdown('[texto](url)')} className="p-2 rounded hover:bg-[var(--border)] transition" title="Enlace">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" /></svg>
                    </button>
                    <button type="button" onClick={() => insertMarkdown('\n> ')} className="p-2 rounded hover:bg-[var(--border)] transition" title="Cita">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
                    </button>
                  </div>
                )}

                {preview ? (
                  <div
                    className="w-full px-6 py-4 rounded-lg min-h-[400px]"
                    style={{
                      background: 'var(--light-gray)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p style={{ color: 'var(--gray)' }}>El contenido aparecerá aquí...</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={20}
                    className="w-full px-4 py-3 rounded-b-lg transition outline-none resize-none font-mono text-sm"
                    style={{
                      background: 'var(--light-gray)',
                      border: '1px solid var(--border)',
                      borderTop: 'none',
                      color: 'var(--fg)'
                    }}
                    placeholder={`Escribe tu artículo en Markdown...

## Ejemplo de título

Un párrafo normal con **texto en negrita** y *cursiva*.

- Lista de elementos
- Otro elemento

\`\`\`java
// Bloque de código
public class Main {
    public static void main(String[] args) {
        System.out.println("Hola mundo");
    }
}
\`\`\`

> Una cita destacada`}
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
                    <p className="font-medium">Publicar ahora</p>
                    <p className="text-xs" style={{ color: 'var(--gray)' }}>
                      {published ? 'Será visible públicamente' : 'Se guardará como borrador'}
                    </p>
                  </div>
                </label>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {published ? 'Publicar artículo' : 'Guardar borrador'}
                      </>
                    )}
                  </button>
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
                <p className="text-xs mt-2" style={{ color: 'var(--gray)' }}>
                  Separadas por comas
                </p>
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

                {/* Upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-3 rounded-lg transition flex items-center justify-center gap-2 mb-3"
                  style={{
                    background: 'var(--light-gray)',
                    border: '1px dashed var(--border)',
                    color: 'var(--gray)'
                  }}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Subir imagen
                    </>
                  )}
                </button>

                <div className="relative">
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
                    placeholder="O pega una URL de imagen"
                  />
                </div>

                {coverImage && (
                  <div className="mt-3 relative group">
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      style={{ background: 'rgba(0,0,0,0.7)' }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Markdown Help */}
              <div className="project-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Guía Markdown
                </h3>
                <div className="text-xs space-y-2" style={{ color: 'var(--gray)' }}>
                  <p><code className="px-1 rounded" style={{ background: 'var(--light-gray)' }}>## Título</code> - Encabezado</p>
                  <p><code className="px-1 rounded" style={{ background: 'var(--light-gray)' }}>**texto**</code> - Negrita</p>
                  <p><code className="px-1 rounded" style={{ background: 'var(--light-gray)' }}>*texto*</code> - Cursiva</p>
                  <p><code className="px-1 rounded" style={{ background: 'var(--light-gray)' }}>`código`</code> - Código inline</p>
                  <p><code className="px-1 rounded" style={{ background: 'var(--light-gray)' }}>- item</code> - Lista</p>
                  <p><code className="px-1 rounded" style={{ background: 'var(--light-gray)' }}>[texto](url)</code> - Enlace</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
