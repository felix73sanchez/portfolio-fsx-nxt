'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components';

interface SiteConfig {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  about: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  twitter: string;
}

export default function ProfileAdminPage() {
  const [config, setConfig] = useState<SiteConfig>({
    name: '', title: '', subtitle: '', location: '', about: '',
    email: '', phone: '', linkedin: '', github: '', twitter: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/site/config').then((response) => response.json()).then(setConfig).catch(console.error);
  }, []);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/site/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setMessage(response.ok
        ? { type: 'success', text: 'Perfil actualizado correctamente' }
        : { type: 'error', text: 'No se pudo guardar' });
      if (response.ok) setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'No se pudo conectar con el servidor' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setChangingPassword(true);
    setPasswordMessage(null);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordMessage({ type: 'success', text: data.message });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.error });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'No se pudo conectar con el servidor' });
    } finally {
      setChangingPassword(false);
    }
  };

  const MessageBanner = ({ msg }: { msg: { type: 'success' | 'error'; text: string } }) => (
    <div className={`admin-message ${msg.type}`} role="status">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={msg.type === 'success' ? 'M5 13l4 4L19 7' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
      </svg>
      {msg.text}
    </div>
  );

  return (
    <AdminLayout
      title="Perfil"
      subtitle="Configuración de identidad, contacto y seguridad"
      actions={
        <button onClick={() => handleSubmit()} disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      }
    >
      {message && <MessageBanner msg={message} />}

      <div className="admin-layout-grid">
        <div className="admin-layout-stack">
          <section className="admin-form-section">
            <h2 className="admin-form-section-title">Información personal</h2>
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label className="admin-form-label">Nombre</label>
                <input type="text" value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} className="admin-form-input" />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label">Ubicación</label>
                <input type="text" value={config.location} onChange={(e) => setConfig({ ...config, location: e.target.value })} className="admin-form-input" />
              </div>
              <div className="admin-form-field full-width">
                <label className="admin-form-label">Título profesional</label>
                <input type="text" value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })} className="admin-form-input" />
              </div>
              <div className="admin-form-field full-width">
                <label className="admin-form-label">Subtítulo</label>
                <input type="text" value={config.subtitle} onChange={(e) => setConfig({ ...config, subtitle: e.target.value })} className="admin-form-input" />
              </div>
            </div>
          </section>

          <section className="admin-form-section">
            <h2 className="admin-form-section-title">Sobre mí</h2>
            <div className="admin-form-field">
              <textarea value={config.about} onChange={(e) => setConfig({ ...config, about: e.target.value })} rows={5} className="admin-form-textarea" placeholder="Escribe algo sobre ti…" />
            </div>
          </section>
        </div>

        <div className="admin-layout-stack">
          <section className="admin-form-section">
            <h2 className="admin-form-section-title">Contacto</h2>
            <div className="admin-card-list">
              <div className="admin-form-field">
                <label className="admin-form-label">Email</label>
                <input type="email" value={config.email} onChange={(e) => setConfig({ ...config, email: e.target.value })} className="admin-form-input" />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label">Teléfono</label>
                <input type="tel" value={config.phone} onChange={(e) => setConfig({ ...config, phone: e.target.value })} className="admin-form-input" />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label">LinkedIn</label>
                <input type="url" value={config.linkedin} onChange={(e) => setConfig({ ...config, linkedin: e.target.value })} className="admin-form-input" placeholder="https://…" />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label">GitHub</label>
                <input type="url" value={config.github} onChange={(e) => setConfig({ ...config, github: e.target.value })} className="admin-form-input" placeholder="https://…" />
              </div>
              <div className="admin-form-field">
                <label className="admin-form-label">X (Twitter)</label>
                <input type="url" value={config.twitter} onChange={(e) => setConfig({ ...config, twitter: e.target.value })} className="admin-form-input" placeholder="https://x.com/…" />
              </div>
            </div>
          </section>

          <section className="admin-form-section">
            <h2 className="admin-form-section-title">Cambiar contraseña</h2>
            {passwordMessage && <MessageBanner msg={passwordMessage} />}
            <form onSubmit={handlePasswordChange}>
              <div className="admin-card-list">
                <div className="admin-form-field">
                  <label className="admin-form-label">Contraseña actual</label>
                  <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="admin-form-input" required />
                </div>
                <div className="admin-form-field">
                  <label className="admin-form-label">Nueva contraseña</label>
                  <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="admin-form-input" minLength={6} required />
                </div>
                <div className="admin-form-field">
                  <label className="admin-form-label">Confirmar contraseña</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="admin-form-input" required />
                </div>
                <button type="submit" disabled={changingPassword} className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
                  {changingPassword ? 'Cambiando…' : 'Cambiar contraseña'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
