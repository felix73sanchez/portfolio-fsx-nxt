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
    { label: 'Total Posts', value: stats.posts, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { label: 'Projects', value: stats.projects, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { label: 'Published', value: stats.published, icon: 'M5 13l4 4L19 7' },
    { label: 'Drafts', value: stats.drafts, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  ];

  const quickActions = [
    { label: 'New Post', desc: 'Write a blog article', href: '/admin/posts/new', icon: 'M12 4v16m8-8H4' },
    { label: 'New Project', desc: 'Add a project', href: '/admin/projects/new', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { label: 'Edit Profile', desc: 'Update your info', href: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="content-loading">
          <div className="content-spinner" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="dashboard-stats">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-card-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
              </svg>
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{stat.value}</span>
              <span className="stat-card-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 className="dashboard-section-title">Quick Actions</h3>
      <div className="dashboard-actions">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="action-card">
            <div className="action-card-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
              </svg>
            </div>
            <div>
              <div className="action-card-text">{action.label}</div>
              <div className="action-card-desc">{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="content-header">
        <h3 className="dashboard-section-title" style={{ marginBottom: 0 }}>Recent Posts</h3>
        <Link href="/admin/posts" className="admin-btn admin-btn-sm">View all →</Link>
      </div>

      {recentPosts.length === 0 ? (
        <div className="content-empty">
          <div className="content-empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="content-empty-title">No posts yet</p>
          <p className="content-empty-text">Write your first blog article</p>
          <Link href="/admin/posts/new" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="admin-card-list">
          {recentPosts.map((post) => (
            <Link key={post.id} href={`/admin/posts/${post.id}/edit`} className="admin-card" style={{ textDecoration: 'none', display: 'block' }}>
              <div className="admin-card-header">
                <div style={{ minWidth: 0 }}>
                  <div className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`content-badge ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    {post.title}
                  </div>
                  {post.description && (
                    <div className="admin-card-subtitle" style={{ marginTop: '0.25rem' }}>{post.description}</div>
                  )}
                </div>
                <div className="admin-card-meta" style={{ whiteSpace: 'nowrap' }}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
