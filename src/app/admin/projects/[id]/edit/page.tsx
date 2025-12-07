'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Project, ProjectLink } from '@/types';

const LINK_ICONS = [
    { value: 'github', label: 'GitHub' },
    { value: 'backend', label: 'Backend' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'demo', label: 'Demo' },
    { value: 'website', label: 'Website' }
];

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [links, setLinks] = useState<ProjectLink[]>([]);
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetchProject();
    }, [projectId, router]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            if (res.ok) {
                const data = await res.json();
                setProject(data);
                setTitle(data.title);
                setDescription(data.description);
                setTechnologies(data.technologies.join(', '));
                setLinks(data.links || []);
                setVisible(data.visible);
            } else {
                setError('Proyecto no encontrado');
            }
        } catch {
            setError('Error al cargar el proyecto');
        } finally {
            setLoading(false);
        }
    };

    const addLink = () => {
        setLinks([...links, { label: '', url: '', icon: 'github' }]);
    };

    const updateLink = (index: number, field: keyof ProjectLink, value: string) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setLinks(newLinks);
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !description.trim() || !technologies.trim()) {
            setError('Título, descripción y tecnologías son requeridos');
            return;
        }

        setSaving(true);

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
                    links: links.filter(l => l.label && l.url),
                    visible
                })
            });

            if (res.ok) {
                router.push('/admin/projects');
            } else {
                const data = await res.json();
                setError(data.error || 'Error al actualizar proyecto');
            }
        } catch {
            setError('Error al conectar con el servidor');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
                            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
                        <p style={{ color: 'var(--gray)' }}>Cargando proyecto...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error && !project) {
        return (
            <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
                <header className="header">
                    <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                        <Link href="/" className="logo">
                            <span className="logo-bracket">&lt;</span>
                            <span className="logo-text">FSX</span>
                            <span className="logo-bracket">/&gt;</span>
                        </Link>
                    </div>
                </header>
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Proyecto no encontrado</h2>
                    <p className="mb-4" style={{ color: 'var(--gray)' }}>{error}</p>
                    <Link href="/admin/projects" className="cta-btn">
                        Volver a proyectos
                    </Link>
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
                    <Link href="/admin/projects" className="link-btn text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a proyectos
                    </Link>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Editar Proyecto</h1>
                    <p style={{ color: 'var(--gray)' }}>Modifica los detalles de tu proyecto</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && project && (
                        <div className="p-4 rounded-lg flex items-center gap-3"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div className="project-card">
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
                            placeholder="Nombre del proyecto"
                        />
                    </div>

                    {/* Description */}
                    <div className="project-card">
                        <label className="block text-sm font-medium mb-2">
                            Descripción <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg transition outline-none resize-none"
                            style={{
                                background: 'var(--light-gray)',
                                border: '1px solid var(--border)',
                                color: 'var(--fg)'
                            }}
                            placeholder="Describe tu proyecto..."
                        />
                    </div>

                    {/* Technologies */}
                    <div className="project-card">
                        <label className="block text-sm font-medium mb-2">
                            Tecnologías <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={technologies}
                            onChange={(e) => setTechnologies(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg transition outline-none"
                            style={{
                                background: 'var(--light-gray)',
                                border: '1px solid var(--border)',
                                color: 'var(--fg)'
                            }}
                            placeholder="Java, Spring Boot, Next.js, TypeScript"
                        />
                        <p className="text-xs mt-2" style={{ color: 'var(--gray)' }}>Separadas por comas</p>
                        {technologies && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {technologies.split(',').filter(t => t.trim()).map((tech, i) => (
                                    <span key={i} className="tech-badge text-xs">{tech.trim()}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Links */}
                    <div className="project-card">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-medium">Enlaces</label>
                            <button
                                type="button"
                                onClick={addLink}
                                className="text-sm flex items-center gap-1 transition"
                                style={{ color: 'var(--accent)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar enlace
                            </button>
                        </div>

                        {links.length === 0 ? (
                            <p className="text-sm" style={{ color: 'var(--gray)' }}>
                                No hay enlaces. Agrega links a GitHub, demos, etc.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {links.map((link, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <select
                                            value={link.icon}
                                            onChange={(e) => updateLink(index, 'icon', e.target.value)}
                                            className="px-3 py-2 rounded-lg"
                                            style={{
                                                background: 'var(--light-gray)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--fg)'
                                            }}
                                        >
                                            {LINK_ICONS.map(icon => (
                                                <option key={icon.value} value={icon.value}>{icon.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={link.label}
                                            onChange={(e) => updateLink(index, 'label', e.target.value)}
                                            placeholder="Etiqueta"
                                            className="flex-1 px-3 py-2 rounded-lg"
                                            style={{
                                                background: 'var(--light-gray)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--fg)'
                                            }}
                                        />
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 px-3 py-2 rounded-lg"
                                            style={{
                                                background: 'var(--light-gray)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--fg)'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className="p-2 rounded-lg transition"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                                        >
                                            <svg className="w-5 h-5" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visibility */}
                    <div className="project-card">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={visible}
                                onChange={(e) => setVisible(e.target.checked)}
                                className="w-5 h-5 rounded accent-green-500"
                            />
                            <div>
                                <p className="font-medium">Visible en el portafolio</p>
                                <p className="text-xs" style={{ color: 'var(--gray)' }}>
                                    {visible ? 'El proyecto será visible públicamente' : 'El proyecto estará oculto'}
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{ background: 'var(--accent)', color: '#fff' }}
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/projects"
                            className="px-6 py-3 font-medium rounded-lg transition flex items-center justify-center"
                            style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
