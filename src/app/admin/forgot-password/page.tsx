'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../admin.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetUrl('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
        } else {
          setError('Si el email existe, recibirás instrucciones para restablecer tu contraseña.');
        }
      } else {
        setError(data.error || 'Error al procesar la solicitud');
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
          <h1 className="auth-title">Recuperar Contraseña</h1>
          <p className="auth-subtitle">Ingresá tu email para restablecer tu contraseña</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {resetUrl && (
            <div className="auth-success" role="status">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm3.36 4.65a.5.5 0 0 0-.72-.01L6.8 9.49 5.36 8.05a.5.5 0 1 0-.72.7l1.72 1.73a.5.5 0 0 0 .71 0l4.29-4.3a.5.5 0 0 0 0-.53Z" fill="currentColor" />
              </svg>
              <div>
                <p className="mb-1 font-medium">Link de recuperación generado:</p>
                <a
                  href={resetUrl}
                  className="text-[13px] underline underline-offset-2 break-all hover:opacity-80"
                  style={{ color: 'inherit' }}
                >
                  {resetUrl}
                </a>
                <p className="text-[12px] mt-1 opacity-75">Este link expira en 1 hora.</p>
              </div>
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

          {!resetUrl && (
            <>
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
                  className="auth-input"
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>

              <button type="submit" disabled={loading} className="auth-submit">
                {loading ? (
                  <>
                    <span className="auth-spinner" aria-hidden="true" />
                    Enviando…
                  </>
                ) : (
                  'Enviar Link de Recuperación'
                )}
              </button>
            </>
          )}
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
