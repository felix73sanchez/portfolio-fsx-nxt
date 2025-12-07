'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Project } from '@/types';

export default function ProjectsAdminPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetchProjects(token);
    }, [router]);

    const fetchProjects = async (token: string) => {
        try {
            const res = await fetch('/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        setDeleting(id);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        } finally {
            setDeleting(null);
        }
    };

    const toggleVisibility = async (project: Project) => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
                            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
                        <p style={{ color: 'var(--gray)' }}>Cargando proyectos...</p>
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
                    <Link href="/admin/dashboard" className="link-btn text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Dashboard
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Proyectos</h1>
                        <p style={{ color: 'var(--gray)' }}>Administra tus proyectos del portafolio</p>
                    </div>
                    <Link
                        href="/admin/projects/new"
                        className="cta-btn flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Proyecto
                    </Link>
                </div>

                {/* Projects List */}
                {projects.length === 0 ? (
                    <div className="text-center py-16 project-card">
                        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                            style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            <svg className="w-8 h-8" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No hay proyectos</h3>
                        <p style={{ color: 'var(--gray)' }} className="mb-4">
                            Comienza agregando tu primer proyecto
                        </p>
                        <Link href="/admin/projects/new" className="cta-btn inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Crear Proyecto
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.id} className="project-card">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold truncate">{project.title}</h3>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full"
                                                style={{
                                                    background: project.visible ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: project.visible ? '#22c55e' : '#ef4444'
                                                }}
                                            >
                                                {project.visible ? 'Visible' : 'Oculto'}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--gray)' }}>
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.slice(0, 5).map((tech) => (
                                                <span key={tech} className="tech-badge text-xs">{tech}</span>
                                            ))}
                                            {project.technologies.length > 5 && (
                                                <span className="text-xs px-2 py-1" style={{ color: 'var(--gray)' }}>
                                                    +{project.technologies.length - 5} más
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleVisibility(project)}
                                            className="p-2 rounded-lg transition"
                                            style={{ background: 'var(--light-gray)' }}
                                            title={project.visible ? 'Ocultar' : 'Mostrar'}
                                        >
                                            {project.visible ? (
                                                <svg className="w-5 h-5" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" style={{ color: 'var(--gray)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            )}
                                        </button>
                                        <Link
                                            href={`/admin/projects/${project.id}/edit`}
                                            className="p-2 rounded-lg transition"
                                            style={{ background: 'var(--light-gray)' }}
                                            title="Editar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            disabled={deleting === project.id}
                                            className="p-2 rounded-lg transition"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                                            title="Eliminar"
                                        >
                                            {deleting === project.id ? (
                                                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-5 h-5" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
