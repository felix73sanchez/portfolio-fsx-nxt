'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components';

interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    responsibilities: string[];
}

interface Education {
    id: number;
    degree: string;
    institution: string;
    location: string;
    startYear: number;
    endYear: number | null;
    current: boolean;
    description: string | null;
}

type Tab = 'experiences' | 'education' | 'skills';

export default function ContentAdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('experiences');
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [skills, setSkills] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);

    // Forms
    const [showExpForm, setShowExpForm] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [expForm, setExpForm] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' });

    const [showEduForm, setShowEduForm] = useState(false);
    const [editingEdu, setEditingEdu] = useState<Education | null>(null);
    const [eduForm, setEduForm] = useState({ degree: '', institution: '', location: '', startYear: '', endYear: '', current: false, description: '' });

    const [skillCategory, setSkillCategory] = useState('');
    const [skillsList, setSkillsList] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/admin/login'); return; }
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const [expRes, eduRes, skillsRes] = await Promise.all([
                fetch('/api/site/experiences'),
                fetch('/api/site/education'),
                fetch('/api/site/skills')
            ]);
            if (expRes.ok) setExperiences(await expRes.json());
            if (eduRes.ok) setEducation(await eduRes.json());
            if (skillsRes.ok) setSkills(await skillsRes.json());
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Experience handlers
    const handleExpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = { ...expForm, responsibilities: expForm.responsibilities.split('\n').filter(r => r.trim()), displayOrder: 0 };

        const res = await fetch(editingExp ? `/api/site/experiences/${editingExp.id}` : '/api/site/experiences', {
            method: editingExp ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            fetchData();
            setShowExpForm(false);
            setEditingExp(null);
            setExpForm({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' });
        }
    };

    const editExp = (exp: Experience) => {
        setEditingExp(exp);
        setExpForm({ title: exp.title, company: exp.company, location: exp.location, startDate: exp.startDate, endDate: exp.endDate || '', current: exp.current, responsibilities: exp.responsibilities.join('\n') });
        setShowExpForm(true);
    };

    const deleteExp = async (id: number) => {
        if (!confirm('¿Eliminar esta experiencia?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/site/experiences/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) fetchData();
    };

    // Education handlers
    const handleEduSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = { ...eduForm, startYear: parseInt(eduForm.startYear), endYear: eduForm.endYear ? parseInt(eduForm.endYear) : null, displayOrder: 0 };

        const res = await fetch(editingEdu ? `/api/site/education/${editingEdu.id}` : '/api/site/education', {
            method: editingEdu ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            fetchData();
            setShowEduForm(false);
            setEditingEdu(null);
            setEduForm({ degree: '', institution: '', location: '', startYear: '', endYear: '', current: false, description: '' });
        }
    };

    const editEdu = (edu: Education) => {
        setEditingEdu(edu);
        setEduForm({ degree: edu.degree, institution: edu.institution, location: edu.location, startYear: edu.startYear.toString(), endYear: edu.endYear?.toString() || '', current: edu.current, description: edu.description || '' });
        setShowEduForm(true);
    };

    const deleteEdu = async (id: number) => {
        if (!confirm('¿Eliminar esta educación?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/site/education/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) fetchData();
    };

    // Skills handlers
    const handleSkillsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const category = editingCategory || skillCategory;
        const skillsArray = skillsList.split(',').map(s => s.trim()).filter(s => s);

        const res = await fetch('/api/site/skills', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ category, skills: skillsArray })
        });

        if (res.ok) { fetchData(); setSkillCategory(''); setSkillsList(''); setEditingCategory(null); }
    };

    const editSkillCategory = (category: string, skillsArr: string[]) => {
        setEditingCategory(category);
        setSkillCategory(category);
        setSkillsList(skillsArr.join(', '));
    };

    const deleteSkillCategory = async (category: string) => {
        if (!confirm(`¿Eliminar "${category}"?`)) return;
        const token = localStorage.getItem('token');
        await fetch('/api/site/skills', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ category, skills: [] })
        });
        fetchData();
    };

    if (loading) {
        return (
            <AdminLayout title="Contenido" subtitle="Cargando...">
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}></div>
                </div>
            </AdminLayout>
        );
    }

    const tabs = [
        { id: 'experiences' as Tab, label: 'Experiencia', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#3b82f6' },
        { id: 'education' as Tab, label: 'Educación', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', color: '#10b981' },
        { id: 'skills' as Tab, label: 'Habilidades', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: '#f59e0b' }
    ];

    const inputStyle = { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' };

    return (
        <AdminLayout title="Contenido del Sitio" subtitle="Gestiona experiencias, educación y habilidades">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap"
                        style={{
                            background: activeTab === tab.id ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)` : 'var(--light-gray)',
                            color: activeTab === tab.id ? '#fff' : 'var(--gray)',
                            border: activeTab === tab.id ? 'none' : '1px solid var(--border)',
                            boxShadow: activeTab === tab.id ? `0 4px 15px ${tab.color}40` : 'none'
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                        </svg>
                        {tab.label}
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--border)' }}>
                            {tab.id === 'experiences' ? experiences.length : tab.id === 'education' ? education.length : Object.keys(skills).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Experiences Tab */}
            {activeTab === 'experiences' && (
                <div className="space-y-6">
                    <button onClick={() => { setShowExpForm(true); setEditingExp(null); setExpForm({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' }); }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Experiencia
                    </button>

                    {showExpForm && (
                        <div className="rounded-2xl p-6 animate-fade-in" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                                    <svg className="w-4 h-4" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                {editingExp ? 'Editar Experiencia' : 'Nueva Experiencia'}
                            </h3>
                            <form onSubmit={handleExpSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Título del puesto" value={expForm.title} onChange={e => setExpForm(f => ({ ...f, title: e.target.value }))}
                                        className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" style={inputStyle} required />
                                    <input type="text" placeholder="Empresa" value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))}
                                        className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" style={inputStyle} required />
                                    <input type="text" placeholder="Ubicación" value={expForm.location} onChange={e => setExpForm(f => ({ ...f, location: e.target.value }))}
                                        className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" style={inputStyle} />
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Fecha inicio" value={expForm.startDate} onChange={e => setExpForm(f => ({ ...f, startDate: e.target.value }))}
                                            className="flex-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" style={inputStyle} required />
                                        <input type="text" placeholder="Fecha fin" value={expForm.endDate} onChange={e => setExpForm(f => ({ ...f, endDate: e.target.value }))}
                                            disabled={expForm.current} className="flex-1 px-4 py-3 rounded-xl outline-none disabled:opacity-50" style={inputStyle} />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${expForm.current ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>
                                        {expForm.current && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <input type="checkbox" checked={expForm.current} onChange={e => setExpForm(f => ({ ...f, current: e.target.checked, endDate: '' }))} className="sr-only" />
                                    <span style={{ color: 'var(--gray)' }}>Trabajo actual</span>
                                </label>
                                <textarea placeholder="Responsabilidades (una por línea)" value={expForm.responsibilities} onChange={e => setExpForm(f => ({ ...f, responsibilities: e.target.value }))}
                                    rows={4} className="w-full px-4 py-3 rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-500/50" style={inputStyle} />
                                <div className="flex gap-3">
                                    <button type="submit" className="px-6 py-3 rounded-xl font-medium transition hover:shadow-lg" style={{ background: 'var(--accent)', color: '#fff' }}>{editingExp ? 'Actualizar' : 'Crear'}</button>
                                    <button type="button" onClick={() => setShowExpForm(false)} className="px-6 py-3 rounded-xl transition hover:bg-white/5" style={{ background: 'var(--border)' }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {experiences.length === 0 ? (
                        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                <svg className="w-8 h-8" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="font-medium mb-2" style={{ color: 'var(--fg)' }}>No hay experiencias</p>
                            <p className="text-sm" style={{ color: 'var(--gray)' }}>Agrega tu experiencia laboral</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {experiences.map(exp => (
                                <div key={exp.id} className="rounded-2xl p-5 transition-all duration-300 hover:shadow-lg group" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f620 0%, #3b82f610 100%)' }}>
                                                <svg className="w-6 h-6" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg" style={{ color: 'var(--fg)' }}>{exp.title}</h3>
                                                <p className="font-medium" style={{ color: '#3b82f6' }}>{exp.company}</p>
                                                <p className="text-sm flex items-center gap-2 mt-1" style={{ color: 'var(--gray)' }}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {exp.location}
                                                    <span className="mx-2">•</span>
                                                    {exp.startDate} – {exp.current ? <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Presente</span> : exp.endDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => editExp(exp)} className="p-2.5 rounded-xl transition hover:bg-white/10" style={{ color: 'var(--gray)' }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => deleteExp(exp.id)} className="p-2.5 rounded-xl transition hover:bg-red-500/20" style={{ color: '#ef4444' }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    {exp.responsibilities.length > 0 && (
                                        <ul className="mt-4 space-y-2 pl-16">
                                            {exp.responsibilities.map((r, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--gray)' }}>
                                                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#3b82f6' }}></span>
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
                <div className="space-y-6">
                    <button onClick={() => { setShowEduForm(true); setEditingEdu(null); setEduForm({ degree: '', institution: '', location: '', startYear: '', endYear: '', current: false, description: '' }); }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Educación
                    </button>

                    {showEduForm && (
                        <div className="rounded-2xl p-6 animate-fade-in" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                                    <svg className="w-4 h-4" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    </svg>
                                </div>
                                {editingEdu ? 'Editar Educación' : 'Nueva Educación'}
                            </h3>
                            <form onSubmit={handleEduSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Título/Grado" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))}
                                        className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50" style={inputStyle} required />
                                    <input type="text" placeholder="Institución" value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))}
                                        className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50" style={inputStyle} required />
                                    <input type="text" placeholder="Ubicación" value={eduForm.location} onChange={e => setEduForm(f => ({ ...f, location: e.target.value }))}
                                        className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50" style={inputStyle} />
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Año inicio" value={eduForm.startYear} onChange={e => setEduForm(f => ({ ...f, startYear: e.target.value }))}
                                            className="flex-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50" style={inputStyle} required />
                                        <input type="number" placeholder="Año fin" value={eduForm.endYear} onChange={e => setEduForm(f => ({ ...f, endYear: e.target.value }))}
                                            disabled={eduForm.current} className="flex-1 px-4 py-3 rounded-xl outline-none disabled:opacity-50" style={inputStyle} />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${eduForm.current ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                                        {eduForm.current && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <input type="checkbox" checked={eduForm.current} onChange={e => setEduForm(f => ({ ...f, current: e.target.checked, endYear: '' }))} className="sr-only" />
                                    <span style={{ color: 'var(--gray)' }}>Actualmente estudiando</span>
                                </label>
                                <textarea placeholder="Descripción (opcional)" value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3} className="w-full px-4 py-3 rounded-xl outline-none resize-none focus:ring-2 focus:ring-green-500/50" style={inputStyle} />
                                <div className="flex gap-3">
                                    <button type="submit" className="px-6 py-3 rounded-xl font-medium transition hover:shadow-lg" style={{ background: '#10b981', color: '#fff' }}>{editingEdu ? 'Actualizar' : 'Crear'}</button>
                                    <button type="button" onClick={() => setShowEduForm(false)} className="px-6 py-3 rounded-xl transition hover:bg-white/5" style={{ background: 'var(--border)' }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {education.length === 0 ? (
                        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                <svg className="w-8 h-8" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                </svg>
                            </div>
                            <p className="font-medium mb-2" style={{ color: 'var(--fg)' }}>No hay educación</p>
                            <p className="text-sm" style={{ color: 'var(--gray)' }}>Agrega tu formación académica</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div key={edu.id} className="rounded-2xl p-5 transition-all duration-300 hover:shadow-lg group" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10b98120 0%, #10b98110 100%)' }}>
                                                <svg className="w-6 h-6" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg" style={{ color: 'var(--fg)' }}>{edu.degree}</h3>
                                                <p className="font-medium" style={{ color: '#10b981' }}>{edu.institution}</p>
                                                <p className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
                                                    {edu.location} • {edu.startYear} – {edu.current ? <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Presente</span> : edu.endYear}
                                                </p>
                                                {edu.description && <p className="text-sm mt-2" style={{ color: 'var(--gray)' }}>{edu.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => editEdu(edu)} className="p-2.5 rounded-xl transition hover:bg-white/10" style={{ color: 'var(--gray)' }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => deleteEdu(edu.id)} className="p-2.5 rounded-xl transition hover:bg-red-500/20" style={{ color: '#ef4444' }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div className="space-y-6">
                    <div className="rounded-2xl p-6" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                                <svg className="w-4 h-4" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h3>
                        <form onSubmit={handleSkillsSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Categoría (ej: Backend, Frontend)" value={skillCategory} onChange={e => setSkillCategory(e.target.value)}
                                    disabled={!!editingCategory} className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/50 disabled:opacity-50" style={inputStyle} required />
                                <input type="text" placeholder="Habilidades (separadas por coma)" value={skillsList} onChange={e => setSkillsList(e.target.value)}
                                    className="px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/50" style={inputStyle} required />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="px-6 py-3 rounded-xl font-medium transition hover:shadow-lg" style={{ background: '#f59e0b', color: '#fff' }}>
                                    {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                                </button>
                                {editingCategory && (
                                    <button type="button" onClick={() => { setEditingCategory(null); setSkillCategory(''); setSkillsList(''); }}
                                        className="px-6 py-3 rounded-xl transition hover:bg-white/5" style={{ background: 'var(--border)' }}>Cancelar</button>
                                )}
                            </div>
                        </form>
                    </div>

                    {Object.keys(skills).length === 0 ? (
                        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                                <svg className="w-8 h-8" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <p className="font-medium mb-2" style={{ color: 'var(--fg)' }}>No hay habilidades</p>
                            <p className="text-sm" style={{ color: 'var(--gray)' }}>Agrega tus habilidades técnicas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(skills).map(([category, skillsArr]) => (
                                <div key={category} className="rounded-2xl p-5 transition-all duration-300 hover:shadow-lg group" style={{ background: 'var(--light-gray)', border: '1px solid var(--border)' }}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                                                <svg className="w-5 h-5" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold" style={{ color: 'var(--fg)' }}>{category}</h3>
                                                <p className="text-xs" style={{ color: 'var(--gray)' }}>{skillsArr.length} habilidades</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => editSkillCategory(category, skillsArr)} className="p-2 rounded-lg transition hover:bg-white/10" style={{ color: 'var(--gray)' }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => deleteSkillCategory(category)} className="p-2 rounded-lg transition hover:bg-red-500/20" style={{ color: '#ef4444' }}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsArr.map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-transform hover:scale-105"
                                                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
