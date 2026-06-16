'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../admin.css';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!invitationCode.trim()) {
      setError('El código de invitación es requerido');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, invitationCode }),
      });

      if (res.ok) {
        // Redirect to login with success flag
        router.push('/admin/login?registered=true');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al registrarse');
      }
    } catch (_err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <Link href="/" className="auth-brand-logo">
            <span className="auth-brand-accent">&lt;</span>
            <span>FSX</span>
            <span className="auth-brand-accent">/&gt;</span>
          </Link>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Panel de administración del blog</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7.25 5a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" fill="currentColor" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div className="auth-field">
            <label htmlFor="register-name" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6.5 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM3 13c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm4-2.5a2.5 2.5 0 0 0-2.5 2.5h7a2.5 2.5 0 0 0-2.5-2.5H7Z" fill="currentColor" />
              </svg>
              Nombre
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
              placeholder="Tu nombre"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="register-email" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Zm1.4.2L8 7.8l4.6-3.6H3.4ZM13 5.1 8.3 8.6a.5.5 0 0 1-.6 0L3 5.1V12h10V5.1Z" fill="currentColor" />
              </svg>
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="register-password" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Zm-2 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
              </svg>
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="auth-hint">Mínimo 6 caracteres</p>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="register-confirm-password" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Zm-2 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
              </svg>
              Confirmar Contraseña
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {/* Invitation Code */}
          <div className="auth-field">
            <label htmlFor="register-invite" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5a1.5 1.5 0 0 0-1.29.74l-.5.87H4.5A1.5 1.5 0 0 0 3 4.61v8.39A1.5 1.5 0 0 0 4.5 14.5h7a1.5 1.5 0 0 0 1.5-1.5V4.61a1.5 1.5 0 0 0-1.5-1.5H9.79l-.5-.87A1.5 1.5 0 0 0 8 1.5ZM7 5h2a.5.5 0 0 1 0 1H7a.5.5 0 0 1 0-1Zm-1 3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Zm.5 2.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1Z" fill="currentColor" />
              </svg>
              Código de Invitación
              <span className="auth-required">*</span>
            </label>
            <input
              id="register-invite"
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              required
              className="auth-input"
              placeholder="Ingresa el código"
              autoComplete="off"
            />
            <p className="auth-hint">Solicita el código al administrador</p>
          </div>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? (
              <>
                <span className="auth-spinner" aria-hidden="true" />
                Creando cuenta…
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            ¿Ya tenés cuenta?{' '}
            <Link href="/admin/login" className="auth-link">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Back to site */}
      <div className="auth-back">
        <Link href="/" className="auth-link">
          ← Volver al sitio
        </Link>
      </div>
    </main>
  );
}
