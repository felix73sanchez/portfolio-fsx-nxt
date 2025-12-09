'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
}

export default function ProfileAdminPage() {
    const router = useRouter();
    const [config, setConfig] = useState<SiteConfig>({
        name: '', title: '', subtitle: '', location: '', about: '',
        email: '', phone: '', linkedin: '', github: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/admin/login'); return; }
        fetch('/api/site/config').then(r => r.json()).then(setConfig).catch(console.error).finally(() => setLoading(false));
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/site/config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error saving config:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangingPassword(true);
        setPasswordMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwordData)
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordMessage({ type: 'success', text: data.message });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'Error al conectar con el servidor' });
        } finally {
            setChangingPassword(false);
        }
    };

    const inputClass = "w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:ring-1 focus:ring-[var(--fg)] focus:border-[var(--fg)] outline-none transition-all placeholder:text-[var(--gray)]/50";
    const labelClass = "block text-xs font-medium text-[var(--gray)] mb-1.5 uppercase tracking-wide";

    return (
        <AdminLayout
            title="Profile Settings"
            subtitle="Manage your public profile information"
            actions={
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[var(--fg)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            }
        >
            {saveSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium flex items-center gap-2 animate-fade-in-up">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Profile updated successfully
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <div className="pb-2 border-b border-[var(--border)]">
                            <h3 className="text-lg font-medium">Personal Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input type="text" value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input type="text" value={config.location} onChange={e => setConfig({ ...config, location: e.target.value })} className={inputClass} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Professional Title</label>
                                <input type="text" value={config.title} onChange={e => setConfig({ ...config, title: e.target.value })} className={inputClass} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Subtitle / Tagline</label>
                                <input type="text" value={config.subtitle} onChange={e => setConfig({ ...config, subtitle: e.target.value })} className={inputClass} />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="pb-2 border-b border-[var(--border)]">
                            <h3 className="text-lg font-medium">About Me</h3>
                        </div>
                        <textarea
                            value={config.about}
                            onChange={e => setConfig({ ...config, about: e.target.value })}
                            rows={6}
                            className={inputClass}
                            style={{ resize: 'vertical', lineHeight: '1.6' }}
                        />
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <section className="space-y-4">
                        <div className="pb-2 border-b border-[var(--border)]">
                            <h3 className="text-lg font-medium">Contact & Social</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input type="email" value={config.email} onChange={e => setConfig({ ...config, email: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Phone Number</label>
                                <input type="tel" value={config.phone} onChange={e => setConfig({ ...config, phone: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>LinkedIn URL</label>
                                <input type="url" value={config.linkedin} onChange={e => setConfig({ ...config, linkedin: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>GitHub URL</label>
                                <input type="url" value={config.github} onChange={e => setConfig({ ...config, github: e.target.value })} className={inputClass} />
                            </div>
                        </div>
                    </section>

                    {/* Password Change Section */}
                    <section className="space-y-4">
                        <div className="pb-2 border-b border-[var(--border)]">
                            <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
                        </div>

                        {passwordMessage && (
                            <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${passwordMessage.type === 'success'
                                    ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                }`}>
                                {passwordMessage.type === 'success' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                )}
                                {passwordMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className={labelClass}>Contraseña Actual</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className={inputClass}
                                    minLength={6}
                                    required
                                />
                                <p className="text-xs text-[var(--gray)] mt-1">Mínimo 6 caracteres</p>
                            </div>
                            <div>
                                <label className={labelClass}>Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
