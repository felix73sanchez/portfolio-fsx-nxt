'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mostrar mensaje de éxito si vino del registro
  const justRegistered = searchParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('userName', data.user.name);
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Credenciales inválidas');
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
          <h1 className="auth-title">Panel de Administración</h1>
          <p className="auth-subtitle">Acceso restringido a usuarios autorizados</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {justRegistered && (
            <div className="auth-success" role="status">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm3.36 4.65a.5.5 0 0 0-.72-.01L6.8 9.49 5.36 8.05a.5.5 0 1 0-.72.7l1.72 1.73a.5.5 0 0 0 .71 0l4.29-4.3a.5.5 0 0 0 0-.53Z" fill="currentColor" />
              </svg>
              <span>Cuenta creada exitosamente. Iniciá sesión con tus credenciales.</span>
            </div>
          )}

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7.25 5a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" fill="currentColor" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Zm1.4.2L8 7.8l4.6-3.6H3.4ZM13 5.1 8.3 8.6a.5.5 0 0 1-.6 0L3 5.1V12h10V5.1Z" fill="currentColor" />
              </svg>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Zm-2 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
              </svg>
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? (
              <>
                <span className="auth-spinner" aria-hidden="true" />
                Iniciando sesión…
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            ¿No tenés cuenta?{' '}
            <Link href="/admin/register" className="auth-link">
              Registrarse
            </Link>
          </p>
          <p className="mt-2 text-xs">
            <Link href="/admin/forgot-password" className="auth-link opacity-70 hover:opacity-100 transition-opacity">
              ¿Olvidaste tu contraseña?
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
