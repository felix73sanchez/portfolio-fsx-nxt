'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components';
import { BlogPost } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => {
        // Sort by date desc
        const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
        setPosts(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const stats = [
    {
      label: 'Artículos Totales',
      value: posts.length,
      desc: 'En tu biografía',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
      ),
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'Publicados',
      value: posts.filter(p => p.published).length,
      desc: 'Visibles al público',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Borradores',
      value: posts.filter(p => !p.published).length,
      desc: 'En progreso',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      ),
      gradient: 'from-amber-500 to-orange-600'
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Bienvenido al panel de control de tu portafolio."
      actions={
        <Link href="/admin/posts/new" className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105 transition-all text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo Post
        </Link>
      }
    >
      {/* Stats Cards - Bento Grid Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group">
            {/* Background Gradient Blob */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity`} />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  {stat.icon}
                </div>
                {i === 1 && <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">Activo</span>}
              </div>

              <div>
                <h3 className="text-4xl font-bold text-[var(--fg)] mb-1 tracking-tight">{stat.value}</h3>
                <p className="font-semibold text-[var(--gray)]">{stat.label}</p>
                <p className="text-xs text-[var(--gray)] opacity-60 mt-1">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-[var(--accent)]" />
              Actividad Reciente
            </h2>
            <Link href="/admin/posts/new" className="text-sm font-medium text-[var(--accent)] hover:text-blue-400 transition-colors">Ver todo</Link>
          </div>

          <div className="bg-[var(--card-bg)]/50 backdrop-blur-md border border-[var(--border)] rounded-3xl p-2">
            {posts.length === 0 ? (
              <div className="p-12 text-center text-[var(--gray)] flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--light-gray)] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p>No hay actividad reciente.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {posts.slice(0, 5).map((post, i) => (
                  <div key={post.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--light-gray)]/50 transition-all cursor-pointer border border-transparent hover:border-[var(--border)]">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-[var(--light-gray)]/50 flex items-center justify-center text-lg font-bold text-[var(--gray)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors shadow-sm">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--fg)] truncate">{post.title}</h3>
                        {post.published ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--gray)] truncate">{post.description || 'Sin descripción'}</p>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      <Link href={`/admin/posts/${post.id}/edit`} className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Side */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-purple-500" />
            Accesos Rápidos
          </h2>
          <div className="grid gap-4">
            <Link href="/admin/profile" className="group relative overflow-hidden p-6 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" /></svg>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-1">Editar Perfil</h3>
                <p className="text-sm text-[var(--gray)]">Actualiza tu información personal y redes.</p>
              </div>
            </Link>

            <Link href="/admin/content" className="group relative overflow-hidden p-6 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" /></svg>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-1">Contenido</h3>
                <p className="text-sm text-[var(--gray)]">Gestiona experiencia y educación.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
