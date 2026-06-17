'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components';
import { Project } from '@/types';

export default function ProjectsAdminPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeleting(id);
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        } finally {
            setDeleting(null);
            setConfirmDelete(null);
        }
    };

    const toggleVisibility = async (project: Project) => {
        try {
            const res = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visible: !project.visible })
            });
            if (res.ok) {
                const updated = await res.json();
                setProjects(projects.map(p => p.id === project.id ? updated : p));
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Projects">
                <div className="content-loading">
                    <div className="content-spinner" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Projects"
            actions={
                <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                </Link>
            }
        >
            {projects.length === 0 ? (
                <div className="content-empty">
                    <div className="content-empty-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    <p className="content-empty-title">No projects yet</p>
                    <p className="content-empty-text">Start by adding your first project</p>
                    <Link href="/admin/projects/new" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
                        Create Project
                    </Link>
                </div>
            ) : (
                <div className="content-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="content-item">
                            <div className="content-item-header">
                                <div className="content-item-title-group">
                                    <h3 className="content-item-title">{project.title}</h3>
                                    <span className={`content-badge ${project.visible ? 'published' : 'draft'}`}>
                                        {project.visible ? 'Visible' : 'Hidden'}
                                    </span>
                                </div>
                            </div>

                            <div className="content-item-body">
                                <p className="content-item-description">{project.description}</p>
                                {project.technologies.length > 0 && (
                                    <div className="admin-tags-wrap" style={{ marginTop: '0.75rem' }}>
                                        {project.technologies.map((tech) => (
                                            <span key={tech} className="admin-tag">{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="content-item-footer">
                                {confirmDelete === project.id ? (
                                    <div className="content-confirm-delete">
                                        <span className="content-confirm-text">Delete this project?</span>
                                        <div className="content-actions">
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                disabled={deleting === project.id}
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                            >
                                                {deleting === project.id ? 'Deleting...' : 'Confirm'}
                                            </button>
                                            <button onClick={() => setConfirmDelete(null)} className="admin-btn admin-btn-sm">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="content-actions">
                                        <button onClick={() => toggleVisibility(project)} className="admin-btn admin-btn-sm">
                                            {project.visible ? (
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                            {project.visible ? 'Hide' : 'Show'}
                                        </button>
                                        <Link href={`/admin/projects/${project.id}/edit`} className="admin-btn admin-btn-sm">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button onClick={() => setConfirmDelete(project.id)} className="admin-btn admin-btn-sm admin-btn-danger">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
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
