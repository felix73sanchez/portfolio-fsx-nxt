'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        body: JSON.stringify({ email, password, name, invitationCode })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al registrar');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--accent)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'var(--accent)' }}></div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-3xl font-bold hover:opacity-80 transition">
            <span style={{ color: 'var(--accent)' }}>&lt;</span>
            <span className="mx-1">FSX</span>
            <span style={{ color: 'var(--accent)' }}>/&gt;</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6">Crear Cuenta</h1>
          <p className="mt-2" style={{ color: 'var(--gray)' }}>Panel de administración del blog</p>
        </div>

        {/* Form Card */}
        <div className="project-card" style={{ background: 'var(--card-bg)' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 rounded-lg flex items-center gap-3 text-sm"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg transition outline-none"
                style={{
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)'
                }}
                placeholder="Tu nombre"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg transition outline-none"
                style={{
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)'
                }}
                placeholder="tu@email.com"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg transition outline-none"
                style={{
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)'
                }}
                placeholder="••••••••"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--gray)' }}>Mínimo 6 caracteres</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg transition outline-none"
                style={{
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)'
                }}
                placeholder="••••••••"
              />
            </div>

            {/* Invitation Code Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Código de Invitación
                <span className="ml-1" style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg transition outline-none"
                style={{
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)'
                }}
                placeholder="Ingresa el código de acceso"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--gray)' }}>
                Solicita el código al administrador
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creando cuenta...
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p style={{ color: 'var(--gray)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/admin/login" style={{ color: 'var(--accent)' }} className="hover:opacity-80 transition font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-70 transition" style={{ color: 'var(--gray)' }}>
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </main>
  );
}
