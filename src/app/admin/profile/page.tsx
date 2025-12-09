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
    twitter: string;
}

export default function ProfileAdminPage() {
    const router = useRouter();
    const [config, setConfig] = useState<SiteConfig>({
        name: '', title: '', subtitle: '', location: '', about: '',
        email: '', phone: '', linkedin: '', github: '', twitter: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password state
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch('/api/site/config').then(r => r.json()).then(setConfig).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/site/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Error al guardar' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
            setPasswordMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setChangingPassword(false);
        }
    };

    const inputClass = "w-full px-3 py-2 rounded-md bg-white/[0.03] border border-white/[0.08] text-[14px] placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05] outline-none transition-all";
    const labelClass = "block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wide";

    const MessageBanner = ({ msg }: { msg: { type: 'success' | 'error', text: string } }) => (
        <div className={`p-3 rounded-md text-[13px] font-medium flex items-center gap-2 mb-4 ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={msg.type === 'success' ? 'M5 13l4 4L19 7' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
            </svg>
            {msg.text}
        </div>
    );

    return (
        <AdminLayout
            title="Perfil"
            actions={
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-md bg-white text-black text-[13px] font-medium hover:bg-white/90 disabled:opacity-50 transition-all"
                >
                    {saving ? 'Guardando...' : 'Guardar'}
                </button>
            }
        >
            {message && <MessageBanner msg={message} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Info */}
                    <section className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <h3 className="text-[14px] font-semibold mb-4">Información Personal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nombre</label>
                                <input type="text" value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Ubicación</label>
                                <input type="text" value={config.location} onChange={e => setConfig({ ...config, location: e.target.value })} className={inputClass} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Título Profesional</label>
                                <input type="text" value={config.title} onChange={e => setConfig({ ...config, title: e.target.value })} className={inputClass} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Subtítulo</label>
                                <input type="text" value={config.subtitle} onChange={e => setConfig({ ...config, subtitle: e.target.value })} className={inputClass} />
                            </div>
                        </div>
                    </section>

                    {/* About */}
                    <section className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <h3 className="text-[14px] font-semibold mb-4">Sobre Mí</h3>
                        <textarea
                            value={config.about}
                            onChange={e => setConfig({ ...config, about: e.target.value })}
                            rows={5}
                            className={`${inputClass} resize-none`}
                            placeholder="Escribe algo sobre ti..."
                        />
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact */}
                    <section className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <h3 className="text-[14px] font-semibold mb-4">Contacto</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Email</label>
                                <input type="email" value={config.email} onChange={e => setConfig({ ...config, email: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Teléfono</label>
                                <input type="tel" value={config.phone} onChange={e => setConfig({ ...config, phone: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>LinkedIn</label>
                                <input type="url" value={config.linkedin} onChange={e => setConfig({ ...config, linkedin: e.target.value })} className={inputClass} placeholder="https://..." />
                            </div>
                            <div>
                                <label className={labelClass}>GitHub</label>
                                <input type="url" value={config.github} onChange={e => setConfig({ ...config, github: e.target.value })} className={inputClass} placeholder="https://..." />
                            </div>
                            <div>
                                <label className={labelClass}>X (Twitter)</label>
                                <input type="url" value={config.twitter} onChange={e => setConfig({ ...config, twitter: e.target.value })} className={inputClass} placeholder="https://x.com/..." />
                            </div>
                        </div>
                    </section>

                    {/* Password */}
                    <section className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <h3 className="text-[14px] font-semibold mb-4">Cambiar Contraseña</h3>

                        {passwordMessage && <MessageBanner msg={passwordMessage} />}

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className={labelClass}>Actual</label>
                                <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Nueva</label>
                                <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} className={inputClass} minLength={6} required />
                            </div>
                            <div>
                                <label className={labelClass}>Confirmar</label>
                                <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className={inputClass} required />
                            </div>
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="w-full py-2 rounded-md bg-white/[0.05] border border-white/[0.1] text-[13px] font-medium hover:bg-white/10 disabled:opacity-50 transition-all"
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
