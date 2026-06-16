'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../admin.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Token de recuperación no encontrado. Solicitá uno nuevo.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => router.push('/admin/login'), 2000);
      } else {
        setError(data.error || 'Error al restablecer la contraseña');
      }
    } catch (_err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Sin token — mostrar error
  if (!token) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <Link href="/" className="auth-brand-logo">
              <span className="auth-brand-accent">&lt;</span>
              <span>FSX</span>
              <span className="auth-brand-accent">/&gt;</span>
            </Link>
            <h1 className="auth-title">Link Inválido</h1>
            <p className="auth-subtitle">El link de recuperación no es válido o falta el token.</p>
          </div>
          <div className="auth-form">
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7.25 5a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" fill="currentColor" />
              </svg>
              <span>No se encontró el token de recuperación en el enlace.</span>
            </div>
            <div className="auth-footer">
              <p>
                <Link href="/admin/forgot-password" className="auth-link">
                  Solicitar nuevo link
                </Link>
              </p>
            </div>
          </div>
          <div className="auth-back">
            <Link href="/" className="auth-link">← Volver al sitio</Link>
          </div>
        </div>
      </main>
    );
  }

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
          <h1 className="auth-title">Nueva Contraseña</h1>
          <p className="auth-subtitle">Ingresá tu nueva contraseña</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {success && (
            <div className="auth-success" role="status">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm3.36 4.65a.5.5 0 0 0-.72-.01L6.8 9.49 5.36 8.05a.5.5 0 1 0-.72.7l1.72 1.73a.5.5 0 0 0 .71 0l4.29-4.3a.5.5 0 0 0 0-.53Z" fill="currentColor" />
              </svg>
              <div>
                <p>{success}</p>
                <p className="text-[12px] mt-1 opacity-75">Redirigiendo al inicio de sesión...</p>
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

          {!success && (
            <>
              <div className="auth-field">
                <label htmlFor="reset-password" className="auth-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Zm-2 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
                  </svg>
                  Nueva Contraseña
                </label>
                <input
                  id="reset-password"
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

              <div className="auth-field">
                <label htmlFor="reset-confirm-password" className="auth-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Zm-2 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="currentColor" />
                  </svg>
                  Confirmar Contraseña
                </label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" disabled={loading} className="auth-submit">
                {loading ? (
                  <>
                    <span className="auth-spinner" aria-hidden="true" />
                    Restableciendo…
                  </>
                ) : (
                  'Restablecer Contraseña'
                )}
              </button>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            <Link href="/admin/login" className="auth-link">
              ← Volver al inicio de sesión
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-brand-logo">
              <span className="auth-brand-accent">&lt;</span>
              <span>FSX</span>
              <span className="auth-brand-accent">/&gt;</span>
            </span>
            <p className="text-sm text-white/40 text-center mt-4">Cargando...</p>
          </div>
        </div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
