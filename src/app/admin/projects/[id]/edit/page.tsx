'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components';
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
    const [coverImage, setCoverImage] = useState('');
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', { method: 'POST', body: formData });

            if (res.ok) {
                const data = await res.json();
                setCoverImage(data.url);
            } else {
                const data = await res.json();
                setError(data.error || 'Error al subir imagen');
            }
        } catch {
            setError('Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

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
                setCoverImage(data.coverImage || '');
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
            setError('Titulo, descripcion y tecnologias son requeridos');
            return;
        }

        setSaving(true);

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
                    links: links.filter(l => l.label && l.url),
                    coverImage: coverImage || null,
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
            <AdminLayout title="Editar Proyecto" subtitle="Cargando...">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
                            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
                        <p style={{ color: 'var(--gray)' }}>Cargando proyecto...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error && !project) {
        return (
            <AdminLayout title="Editar Proyecto">
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>Proyecto no encontrado</h2>
                    <p className="mb-4" style={{ color: 'var(--gray)' }}>{error}</p>
                    <Link href="/admin/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                        style={{ background: 'var(--accent)', color: '#fff' }}>
                        Volver a proyectos
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Editar Proyecto"
            actions={
                <Link
                    href="/admin/projects"
                    className="flex items-center gap-2 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all"
                    style={{ background: 'var(--light-gray)', border: '1px solid var(--border)', color: 'var(--fg)' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </Link>
            }
        >
            <p className="text-sm mb-6" style={{ color: 'var(--gray)' }}>
                Modifica los detalles de tu proyecto
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="admin-form-constrained space-y-6">
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
                <div className="rounded-xl p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <label className="block text-sm font-medium mb-2">
                        Titulo <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="admin-form-input"
                        placeholder="Nombre del proyecto"
                    />
                </div>

                {/* Description */}
                <div className="rounded-xl p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <label className="block text-sm font-medium mb-2">
                        Descripcion <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="admin-form-input"
                        placeholder="Describe tu proyecto..."
                    />
                </div>

                {/* Cover Image */}
                <div className="rounded-xl p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <label className="block text-sm font-medium mb-2">Imagen de portada</label>
                    <p className="text-xs mb-3" style={{ color: 'var(--gray)' }}>
                        Opcional. Si no subis una, la card muestra un fondo con la inicial del proyecto.
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    {coverImage ? (
                        <div className="space-y-3">
                            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', aspectRatio: '16 / 9' }}>
                                <img src={coverImage} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                    className="text-sm" style={{ color: 'var(--accent)' }}>
                                    {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                                </button>
                                <button type="button" onClick={() => setCoverImage('')}
                                    className="text-sm" style={{ color: '#ef4444' }}>
                                    Quitar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                            className="w-full py-8 rounded-lg transition flex flex-col items-center gap-2 disabled:opacity-50"
                            style={{ background: 'var(--light-gray)', border: '1px dashed var(--border)', color: 'var(--gray)' }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{uploading ? 'Subiendo...' : 'Subir imagen de portada'}</span>
                        </button>
                    )}
                </div>

                {/* Technologies */}
                <div className="rounded-xl p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <label className="block text-sm font-medium mb-2">
                        Tecnologias <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={technologies}
                        onChange={(e) => setTechnologies(e.target.value)}
                        required
                        className="admin-form-input"
                        placeholder="Java, Spring Boot, Next.js, TypeScript"
                    />
                    <p className="text-xs mt-2" style={{ color: 'var(--gray)' }}>Separadas por comas</p>
                    {technologies && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {technologies.split(',').filter(t => t.trim()).map((tech, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-lg"
                                    style={{ background: 'var(--light-gray)', color: 'var(--fg)' }}>{tech.trim()}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Links */}
                <div className="rounded-xl p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
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
                                        className="admin-form-select"
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
                                        className="admin-form-input"
                                    />
                                    <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                                        placeholder="https://..."
                                        className="admin-form-input"
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
                <div className="rounded-xl p-5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={visible}
                            onChange={(e) => setVisible(e.target.checked)}
                            className="w-5 h-5 rounded accent-green-500"
                        />
                        <div>
                            <p className="font-medium" style={{ color: 'var(--fg)' }}>Visible en el portafolio</p>
                            <p className="text-xs" style={{ color: 'var(--gray)' }}>
                                {visible ? 'El proyecto sera visible publicamente' : 'El proyecto estara oculto'}
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
                        style={{ background: 'var(--light-gray)', border: '1px solid var(--border)', color: 'var(--fg)' }}
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
