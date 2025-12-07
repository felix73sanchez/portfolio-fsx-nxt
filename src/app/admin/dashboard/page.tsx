'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchData = async () => {
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

    fetchData();
    setUser({ id: '1', email: 'admin@example.com', name: 'Felix Sánchez' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.')) return;

    setDeleteLoading(postId);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setPosts(posts.filter(p => String(p.id) !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
            <p style={{ color: 'var(--gray)' }}>Cargando dashboard...</p>
          </div>
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
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2" style={{ color: 'var(--gray)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: 'var(--accent)', color: '#fff' }}>
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="link-btn text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p style={{ color: 'var(--gray)' }}>Gestiona los artículos de tu blog</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="project-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--gray)' }}>Total artículos</p>
                <p className="text-3xl font-bold">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="project-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--gray)' }}>Publicados</p>
                <p className="text-3xl font-bold">{posts.filter(p => p.published).length}</p>
              </div>
            </div>
          </div>

          <div className="project-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: '#eab308' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-sm" style={{ color: 'var(--gray)' }}>Borradores</p>
                <p className="text-3xl font-bold">{posts.filter(p => !p.published).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link href="/admin/posts/new" className="cta-btn inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear nuevo artículo
          </Link>
          <Link href="/admin/projects" className="link-btn inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Administrar Proyectos
          </Link>
        </div>

        {/* Posts Table */}
        <div className="project-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--light-gray)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Artículo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}
                    className="transition hover:bg-[var(--light-gray)]"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium mb-1">{post.title}</p>
                        <p className="text-sm line-clamp-1" style={{ color: 'var(--gray)' }}>
                          {post.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${post.published
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--gray)' }}>
                      {new Date(post.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg transition hover:bg-[var(--light-gray)]"
                          style={{ color: 'var(--gray)' }}
                          title="Ver"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-2 rounded-lg transition hover:bg-[var(--accent)]/10"
                          style={{ color: 'var(--accent)' }}
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(String(post.id))}
                          disabled={deleteLoading === String(post.id)}
                          className="p-2 rounded-lg transition hover:bg-red-500/10 disabled:opacity-50"
                          style={{ color: '#ef4444' }}
                          title="Eliminar"
                        >
                          {deleteLoading === String(post.id) ? (
                            <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'var(--light-gray)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--gray)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay artículos</h3>
              <p className="mb-4" style={{ color: 'var(--gray)' }}>
                Comienza creando tu primer artículo
              </p>
              <Link href="/admin/posts/new" className="cta-btn inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear artículo
              </Link>
            </div>
          )}
        </div>

        {/* Back to Site */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-70 transition" style={{ color: 'var(--gray)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al sitio
          </Link>
        </div>
      </div>
    </main>
  );
}
