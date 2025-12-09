'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components';
import { BlogPost } from '@/types';

interface Stats {
  posts: number;
  projects: number;
  published: number;
  drafts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ posts: 0, projects: 0, published: 0, drafts: 0 });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, projectsRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/projects')
        ]);
        const posts = await postsRes.json();
        const projects = await projectsRes.json();

        setStats({
          posts: posts.length,
          projects: projects.length,
          published: posts.filter((p: BlogPost) => p.published).length,
          drafts: posts.filter((p: BlogPost) => !p.published).length
        });
        setRecentPosts(posts.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Posts', value: stats.posts, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { label: 'Proyectos', value: stats.projects, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Publicados', value: stats.published, icon: 'M5 13l4 4L19 7', color: 'text-emerald-400' },
    { label: 'Borradores', value: stats.drafts, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'text-amber-400' },
  ];

  const quickActions = [
    { label: 'Nuevo Post', href: '/admin/posts/new', icon: 'M12 4v16m8-8H4' },
    { label: 'Nuevo Proyecto', href: '/admin/projects', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { label: 'Editar Perfil', href: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-white/[0.05] ${stat.color || 'text-white/60'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{loading ? '—' : stat.value}</p>
                  <p className="text-[11px] text-white/40 uppercase tracking-wide">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-[13px] font-medium text-white/40 uppercase tracking-wide mb-3">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/[0.05] border border-white/[0.08] text-[13px] font-medium hover:bg-white/10 hover:border-white/[0.15] transition-all"
              >
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                </svg>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-medium text-white/40 uppercase tracking-wide">Posts Recientes</h2>
            <Link href="/admin/posts/new" className="text-[12px] text-white/40 hover:text-white transition-colors">
              Ver todos →
            </Link>
          </div>

          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-white/30 text-sm">Cargando...</div>
            ) : recentPosts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-white/30 text-sm mb-3">No hay posts todavía</p>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black text-[13px] font-medium hover:bg-white/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear primer post
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/posts/${post.id}/edit`}
                    className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${post.published ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium truncate group-hover:text-white/90">{post.title}</p>
                        <p className="text-[12px] text-white/30 truncate">{post.description}</p>
                      </div>
                    </div>
                    <div className="text-[11px] text-white/30 shrink-0 ml-4">
                      {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
