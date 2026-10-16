'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../admin.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, secretCode }),
      });

      const data = await res.json();

      if (res.ok && (data.resetPath || data.resetUrl)) {
        setRedirecting(true);
        router.push(data.resetPath || data.resetUrl);
      } else {
        setError(data.error || 'Error al procesar la solicitud');
        setLoading(false);
      }
    } catch (_err) {
      setError('No se pudo conectar con el servidor');
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
          <h1 className="auth-title">Recuperar Contraseña</h1>
          <p className="auth-subtitle">Verifica tu identidad con el código secreto del servidor</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {redirecting && (
            <div className="auth-success" role="status">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm3.36 4.65a.5.5 0 0 0-.72-.01L6.8 9.49 5.36 8.05a.5.5 0 1 0-.72.7l1.72 1.73a.5.5 0 0 0 .71 0l4.29-4.3a.5.5 0 0 0 0-.53Z" fill="currentColor" />
              </svg>
              <span>Identidad verificada. Redirigiendo para crear tu nueva contraseña…</span>
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
            <label htmlFor="forgot-email" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Zm1.4.2L8 7.8l4.6-3.6H3.4ZM13 5.1 8.3 8.6a.5.5 0 0 1-.6 0L3 5.1V12h10V5.1Z" fill="currentColor" />
              </svg>
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || redirecting}
              className="auth-input"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="forgot-secret" className="auth-label">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Zm-2 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
              </svg>
              Código de Seguridad del Servidor
              <span className="auth-required">*</span>
            </label>
            <input
              id="forgot-secret"
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              required
              disabled={loading || redirecting}
              className="auth-input"
              placeholder="INVITATION_CODE / ADMIN_RESET_SECRET"
              autoComplete="off"
            />
            <p className="auth-hint">Definido en las variables de entorno del servidor (.env)</p>
          </div>

          <button type="submit" disabled={loading || redirecting} className="auth-submit">
            {loading || redirecting ? (
              <>
                <span className="auth-spinner" aria-hidden="true" />
                {redirecting ? 'Redirigiendo…' : 'Verificando…'}
              </>
            ) : (
              'Continuar para Cambiar Contraseña'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            ¿Recordaste tu contraseña?{' '}
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
