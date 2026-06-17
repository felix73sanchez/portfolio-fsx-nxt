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
        email: '', phone: '', linkedin: '', github: '', twitter: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch('/api/site/config').then(r => r.json()).then(setConfig).catch(console.error);
    }, []);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/site/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to save' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Connection error' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangingPassword(true);
        setPasswordMessage(null);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();

            if (res.ok) {
                setPasswordMessage({ type: 'success', text: data.message });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordMessage({ type: 'error', text: data.error });
            }
        } catch {
            setPasswordMessage({ type: 'error', text: 'Connection error' });
        } finally {
            setChangingPassword(false);
        }
    };

    const MessageBanner = ({ msg }: { msg: { type: 'success' | 'error', text: string } }) => (
        <div className={`admin-message ${msg.type}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={msg.type === 'success' ? 'M5 13l4 4L19 7' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
            </svg>
            {msg.text}
        </div>
    );

    return (
        <AdminLayout
            title="Profile"
            actions={
                <button onClick={() => handleSubmit()} disabled={saving} className="admin-btn admin-btn-primary">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            }
        >
            {message && <MessageBanner msg={message} />}

            <div className="admin-layout-grid">
                {/* Main Column */}
                <div className="admin-layout-stack">
                    {/* Personal Info */}
                    <section className="admin-form-section">
                        <h3 className="admin-form-section-title">Personal Information</h3>
                        <div className="admin-form-grid">
                            <div className="admin-form-field">
                                <label className="admin-form-label">Name</label>
                                <input type="text" value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })} className="admin-form-input" />
                            </div>
                            <div className="admin-form-field">
                                <label className="admin-form-label">Location</label>
                                <input type="text" value={config.location} onChange={e => setConfig({ ...config, location: e.target.value })} className="admin-form-input" />
                            </div>
                            <div className="admin-form-field full-width">
                                <label className="admin-form-label">Professional Title</label>
                                <input type="text" value={config.title} onChange={e => setConfig({ ...config, title: e.target.value })} className="admin-form-input" />
                            </div>
                            <div className="admin-form-field full-width">
                                <label className="admin-form-label">Subtitle</label>
                                <input type="text" value={config.subtitle} onChange={e => setConfig({ ...config, subtitle: e.target.value })} className="admin-form-input" />
                            </div>
                        </div>
                    </section>

                    {/* About */}
                    <section className="admin-form-section">
                        <h3 className="admin-form-section-title">About</h3>
                        <div className="admin-form-field">
                            <textarea
                                value={config.about}
                                onChange={e => setConfig({ ...config, about: e.target.value })}
                                rows={5}
                                className="admin-form-textarea"
                                placeholder="Write something about yourself..."
                            />
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="admin-layout-stack">
                    {/* Contact */}
                    <section className="admin-form-section">
                        <h3 className="admin-form-section-title">Contact</h3>
                        <div className="admin-card-list">
                            <div className="admin-form-field">
                                <label className="admin-form-label">Email</label>
                                <input type="email" value={config.email} onChange={e => setConfig({ ...config, email: e.target.value })} className="admin-form-input" />
                            </div>
                            <div className="admin-form-field">
                                <label className="admin-form-label">Phone</label>
                                <input type="tel" value={config.phone} onChange={e => setConfig({ ...config, phone: e.target.value })} className="admin-form-input" />
                            </div>
                            <div className="admin-form-field">
                                <label className="admin-form-label">LinkedIn</label>
                                <input type="url" value={config.linkedin} onChange={e => setConfig({ ...config, linkedin: e.target.value })} className="admin-form-input" placeholder="https://..." />
                            </div>
                            <div className="admin-form-field">
                                <label className="admin-form-label">GitHub</label>
                                <input type="url" value={config.github} onChange={e => setConfig({ ...config, github: e.target.value })} className="admin-form-input" placeholder="https://..." />
                            </div>
                            <div className="admin-form-field">
                                <label className="admin-form-label">X (Twitter)</label>
                                <input type="url" value={config.twitter} onChange={e => setConfig({ ...config, twitter: e.target.value })} className="admin-form-input" placeholder="https://x.com/..." />
                            </div>
                        </div>
                    </section>

                    {/* Password */}
                    <section className="admin-form-section">
                        <h3 className="admin-form-section-title">Change Password</h3>

                        {passwordMessage && <MessageBanner msg={passwordMessage} />}

                        <form onSubmit={handlePasswordChange}>
                            <div className="admin-card-list">
                                <div className="admin-form-field">
                                    <label className="admin-form-label">Current Password</label>
                                    <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="admin-form-input" required />
                                </div>
                                <div className="admin-form-field">
                                    <label className="admin-form-label">New Password</label>
                                    <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="admin-form-input" minLength={6} required />
                                </div>
                                <div className="admin-form-field">
                                    <label className="admin-form-label">Confirm Password</label>
                                    <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="admin-form-input" required />
                                </div>
                                <button type="submit" disabled={changingPassword} className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
                                    {changingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
