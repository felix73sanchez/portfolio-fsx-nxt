'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components';
import { BlogPost } from '@/types';
import '../admin.css';

export default function PostsAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
    const [togglingPublish, setTogglingPublish] = useState<number | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

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

    const handleDelete = async (id: number) => {
        setDeleting(id);

        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setDeleting(null);
            setConfirmingDelete(null);
        }
    };

    const togglePublish = async (post: BlogPost) => {
        setTogglingPublish(post.id);

        try {
            const res = await fetch(`/api/blog/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !post.published })
            });

            if (res.ok) {
                const updated = await res.json();
                setPosts(posts.map(p => p.id === post.id ? updated : p));
            }
        } catch (error) {
            console.error('Error toggling publish:', error);
        } finally {
            setTogglingPublish(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Posts" subtitle="Loading...">
                <div className="content-loading">
                    <div className="content-spinner" />
                    <p className="content-loading-text">Loading posts...</p>
                </div>
            </AdminLayout>
        );
    }

    const publishedCount = posts.filter(p => p.published).length;
    const draftCount = posts.filter(p => !p.published).length;

    return (
        <AdminLayout
            title="Posts"
            actions={
                <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </Link>
            }
        >
            {/* Stats bar */}
            <div className="content-header">
                <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
                <span className="content-header-separator">·</span>
                <span>{publishedCount} published</span>
                <span className="content-header-separator">·</span>
                <span>{draftCount} {draftCount === 1 ? 'draft' : 'drafts'}</span>
            </div>

            {posts.length === 0 ? (
                <div className="content-empty">
                    <div className="content-empty-icon">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h3 className="content-empty-title">No posts yet</h3>
                    <p className="content-empty-text">Start writing your first post</p>
                    <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Post
                    </Link>
                </div>
            ) : (
                <div className="content-grid">
                    {posts.map((post) => (
                        <div key={post.id} className="content-item">
                            <div className="content-item-header">
                                <div className="content-item-title-group">
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="content-item-title"
                                    >
                                        {post.title}
                                    </Link>
                                    <span className={`content-badge ${post.published ? 'published' : 'draft'}`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <div className="content-item-body">
                                {post.description && (
                                    <p className="content-item-description">{post.description}</p>
                                )}
                                <p className="content-item-date">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="content-item-footer">
                                {confirmingDelete === post.id ? (
                                    <div className="content-confirm-delete">
                                        <span className="content-confirm-text">Are you sure?</span>
                                        <button
                                            className="admin-btn admin-btn-danger admin-btn-sm"
                                            onClick={() => handleDelete(post.id)}
                                            disabled={deleting === post.id}
                                        >
                                            {deleting === post.id ? 'Deleting...' : 'Yes, delete'}
                                        </button>
                                        <button
                                            className="admin-btn admin-btn-sm"
                                            onClick={() => setConfirmingDelete(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="content-actions">
                                        <button
                                            className="admin-btn admin-btn-sm"
                                            onClick={() => togglePublish(post)}
                                            disabled={togglingPublish === post.id}
                                            title={post.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {togglingPublish === post.id ? (
                                                <span className="content-spinner-sm" />
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {post.published ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    ) : (
                                                        <>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </>
                                                    )}
                                                </svg>
                                            )}
                                            {post.published ? 'Unpublish' : 'Publish'}
                                        </button>
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="admin-btn admin-btn-sm"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button
                                            className="admin-btn admin-btn-danger admin-btn-sm"
                                            onClick={() => setConfirmingDelete(post.id)}
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
