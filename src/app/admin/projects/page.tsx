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

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
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
      if (res.ok) setProjects(projects.filter((project) => project.id !== id));
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
        body: JSON.stringify({ visible: !project.visible }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(projects.map((item) => item.id === project.id ? updated : item));
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Proyectos">
        <div className="content-loading" aria-label="Cargando proyectos">
          <div className="content-spinner" />
          <p className="content-loading-text">Cargando proyectos…</p>
        </div>
      </AdminLayout>
    );
  }

  const visibleCount = projects.filter((p) => p.visible).length;
  const hiddenCount = projects.filter((p) => !p.visible).length;

  return (
    <AdminLayout
      title="Proyectos"
      subtitle="Gestiona los proyectos destacados de tu portafolio"
      actions={
        <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo proyecto
        </Link>
      }
    >
      <div className="content-header">
        <div className="content-header-stats">
          <span>{projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}</span>
          <span className="content-header-separator">·</span>
          <span>{visibleCount} visibles</span>
          <span className="content-header-separator">·</span>
          <span>{hiddenCount} ocultos</span>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="content-empty">
          <div className="content-empty-icon" aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="content-empty-title">No hay proyectos todavía</h2>
          <p className="content-empty-text">Comienza agregando tu primer proyecto</p>
          <Link href="/admin/projects/new" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
            Crear proyecto
          </Link>
        </div>
      ) : (
        <div className="content-grid">
          {projects.map((project) => (
            <article key={project.id} className="content-item">
              <div className="content-item-header">
                <div className="content-item-title-group">
                  <Link href={`/admin/projects/${project.id}/edit`} className="content-item-title">
                    {project.title}
                  </Link>
                  <span className={`content-badge ${project.visible ? 'published' : 'draft'}`}>
                    {project.visible ? 'Visible' : 'Oculto'}
                  </span>
                </div>
              </div>

              <div className="content-item-body">
                <p className="content-item-description">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="admin-tags-wrap" style={{ marginTop: '0.75rem' }}>
                    {project.technologies.map((technology) => <span key={technology} className="admin-tag">{technology}</span>)}
                  </div>
                )}
              </div>

              <div className="content-item-footer">
                {confirmDelete === project.id ? (
                  <div className="content-confirm-delete">
                    <span className="content-confirm-text">¿Confirmas la eliminación?</span>
                    <div className="content-actions">
                      <button onClick={() => handleDelete(project.id)} disabled={deleting === project.id} className="admin-btn admin-btn-sm admin-btn-danger">
                        {deleting === project.id ? 'Eliminando…' : 'Confirmar'}
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="admin-btn admin-btn-sm">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="content-actions">
                    <button onClick={() => toggleVisibility(project)} className="admin-btn admin-btn-sm">
                      {project.visible ? 'Ocultar' : 'Mostrar'}
                    </button>
                    <Link href={`/admin/projects/${project.id}/edit`} className="admin-btn admin-btn-sm">
                      Editar
                    </Link>
                    <button onClick={() => setConfirmDelete(project.id)} className="admin-btn admin-btn-sm admin-btn-danger">
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
