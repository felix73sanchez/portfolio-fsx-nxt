'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components';
import { ProjectLink } from '@/types';

const LINK_ICONS = [
    { value: 'github', label: 'GitHub' },
    { value: 'backend', label: 'Backend' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'demo', label: 'Demo' },
    { value: 'website', label: 'Website' }
];

export default function NewProjectPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [links, setLinks] = useState<ProjectLink[]>([]);
    const [coverImage, setCoverImage] = useState('');
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        setLoading(true);

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
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
                setError(data.error || 'Error al crear proyecto');
            }
        } catch {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout
            title="Nuevo proyecto"
            subtitle="Agrega un proyecto al portafolio"
            actions={
                <Link href="/admin/projects" className="admin-btn">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </Link>
            }
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="admin-message error" role="alert">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="admin-editor-grid">
                    {/* Main Content Column */}
                    <div className="admin-layout-stack">
                        {/* Title & Description */}
                        <section className="admin-form-section">
                            <h2 className="admin-form-section-title">Información general</h2>
                            <div className="admin-layout-stack">
                                <div className="admin-form-field">
                                    <label className="admin-form-label">
                                        Título <span style={{ color: '#ef4444' }}>*</span>
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

                                <div className="admin-form-field">
                                    <label className="admin-form-label">
                                        Descripción <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={4}
                                        className="admin-form-textarea"
                                        placeholder="Describe el problema, la arquitectura y el resultado técnico del proyecto…"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Technologies */}
                        <section className="admin-form-section">
                            <h2 className="admin-form-section-title">Stack tecnológico</h2>
                            <div className="admin-form-field">
                                <label className="admin-form-label">
                                    Tecnologías <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={technologies}
                                    onChange={(e) => setTechnologies(e.target.value)}
                                    required
                                    className="admin-form-input"
                                    placeholder="Java, Spring Boot, Next.js, TypeScript"
                                />
                                <p className="text-xs mt-1.5" style={{ color: 'var(--gray)' }}>
                                    Separadas por comas
                                </p>
                                {technologies && (
                                    <div className="admin-tags-wrap" style={{ marginTop: '0.75rem' }}>
                                        {technologies.split(',').filter(t => t.trim()).map((tech, i) => (
                                            <span key={i} className="admin-tag">{tech.trim()}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Links */}
                        <section className="admin-form-section">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '1px solid var(--border)' }}>
                                <h2 className="admin-form-section-title" style={{ margin: 0, padding: 0, border: 0 }}>Enlaces del proyecto</h2>
                                <button
                                    type="button"
                                    onClick={addLink}
                                    className="admin-btn admin-btn-sm"
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Agregar enlace
                                </button>
                            </div>

                            {links.length === 0 ? (
                                <p className="text-xs" style={{ color: 'var(--gray)' }}>
                                    No hay enlaces configurados. Agrega repositorios de GitHub, demos o documentación.
                                </p>
                            ) : (
                                <div className="admin-card-list">
                                    {links.map((link, index) => (
                                        <div key={index} className="admin-link-row">
                                            <select
                                                value={link.icon}
                                                onChange={(e) => updateLink(index, 'icon', e.target.value)}
                                                className="admin-form-select"
                                                aria-label="Tipo de enlace"
                                            >
                                                {LINK_ICONS.map(icon => (
                                                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => updateLink(index, 'label', e.target.value)}
                                                placeholder="Etiqueta (ej. Repo)"
                                                className="admin-form-input"
                                            />
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                                placeholder="https://github.com/..."
                                                className="admin-form-input"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeLink(index)}
                                                className="admin-btn admin-btn-danger admin-btn-icon"
                                                title="Eliminar enlace"
                                            >
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <div className="admin-layout-stack">
                        {/* Visibility & Save */}
                        <section className="admin-form-section">
                            <h2 className="admin-form-section-title">Visibilidad</h2>
                            <label className="flex items-center gap-3 cursor-pointer mb-5">
                                <input
                                    type="checkbox"
                                    checked={visible}
                                    onChange={(e) => setVisible(e.target.checked)}
                                    className="w-4 h-4 rounded"
                                    style={{ accentColor: 'var(--accent)' }}
                                />
                                <div>
                                    <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>Visible en el portafolio</p>
                                    <p className="text-xs" style={{ color: 'var(--gray)' }}>
                                        {visible ? 'Se mostrará públicamente' : 'Oculto del sitio público'}
                                    </p>
                                </div>
                            </label>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-btn admin-btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    {loading ? 'Guardando…' : 'Crear proyecto'}
                                </button>
                                <Link
                                    href="/admin/projects"
                                    className="admin-btn"
                                    style={{ width: '100%' }}
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </section>

                        {/* Cover Image */}
                        <section className="admin-form-section">
                            <h2 className="admin-form-section-title">Imagen de portada</h2>
                            <p className="text-xs mb-3" style={{ color: 'var(--gray)' }}>
                                Opcional. Si no subes una, el sitio generará una ficha técnica automática.
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
                                    <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)', aspectRatio: '16 / 9' }}>
                                        <img src={coverImage} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="admin-btn admin-btn-sm"
                                            style={{ flex: 1 }}
                                        >
                                            {uploading ? 'Subiendo…' : 'Cambiar'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCoverImage('')}
                                            className="admin-btn admin-btn-danger admin-btn-sm"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full py-6 rounded transition flex flex-col items-center gap-2 disabled:opacity-50"
                                    style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border)', color: 'var(--gray)' }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-medium">{uploading ? 'Subiendo…' : 'Subir imagen'}</span>
                                </button>
                            )}
                        </section>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
