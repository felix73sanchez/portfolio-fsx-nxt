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
    fetch('/api/blog').then(r => r.json()).then(setPosts).catch(console.error).finally(() => setLoading(false));
  }, [router]);

  const stats = [
    { label: 'Total Posts', value: posts.length.toString(), change: 'All time' },
    { label: 'Published', value: posts.filter(p => p.published).length.toString(), change: 'Live now' },
    { label: 'Drafts', value: posts.filter(p => !p.published).length.toString(), change: 'In progress' },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of your portfolio activity"
      actions={
        <Link href="/admin/posts/new" className="px-4 py-2 rounded-lg bg-[var(--fg)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity">
          Create Post
        </Link>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--gray)] transition-colors">
            <p className="text-sm font-medium text-[var(--gray)] mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold tracking-tight text-[var(--fg)]">{stat.value}</span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--light-gray)] text-[var(--gray)]">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Recent Activity / Posts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Posts</h2>
            <Link href="/admin/posts/new" className="text-sm text-[var(--accent)] hover:underline">View All</Link>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
            {posts.length === 0 ? (
              <div className="p-12 text-center text-[var(--gray)]">No posts yet.</div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {posts.slice(0, 5).map(post => (
                  <div key={post.id} className="p-4 flex items-center justify-between group hover:bg-[var(--light-gray)]/50 transition-colors">
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate text-[var(--fg)]">{post.title}</h3>
                        <span className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      </div>
                      <p className="text-sm text-[var(--gray)] truncate">{post.description}</p>
                    </div>
                    <Link href={`/admin/posts/${post.id}/edit`} className="opacity-0 group-hover:opacity-100 p-2 text-[var(--gray)] hover:text-[var(--fg)] transition-all">
                      Edit →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/admin/profile" className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--gray)] transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <div className="font-medium">Update Profile</div>
                <div className="text-xs text-[var(--gray)]">Edit personal details</div>
              </div>
            </Link>
            <Link href="/admin/content" className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--gray)] transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                <div className="font-medium">Manage Content</div>
                <div className="text-xs text-[var(--gray)]">Experience & Skills</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
