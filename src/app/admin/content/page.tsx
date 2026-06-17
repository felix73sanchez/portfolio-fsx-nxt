'use client';

import { useState, useEffect } from 'react';
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
    const [activeTab, setActiveTab] = useState<Tab>('experiences');
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [skills, setSkills] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);

    const [showExpForm, setShowExpForm] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [expForm, setExpForm] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' });

    const [showEduForm, setShowEduForm] = useState(false);
    const [editingEdu, setEditingEdu] = useState<Education | null>(null);
    const [eduForm, setEduForm] = useState({ degree: '', institution: '', location: '', startYear: '', endYear: '', current: false, description: '' });

    const [skillCategory, setSkillCategory] = useState('');
    const [skillsList, setSkillsList] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);

    useEffect(() => { fetchData(); }, []);

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
        const data = { ...expForm, responsibilities: expForm.responsibilities.split('\n').filter(r => r.trim()), displayOrder: 0 };
        const res = await fetch(editingExp ? `/api/site/experiences/${editingExp.id}` : '/api/site/experiences', {
            method: editingExp ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        const res = await fetch(`/api/site/experiences/${id}`, { method: 'DELETE' });
        if (res.ok) fetchData();
    };

    // Education handlers
    const handleEduSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...eduForm, startYear: parseInt(eduForm.startYear), endYear: eduForm.endYear ? parseInt(eduForm.endYear) : null, displayOrder: 0 };
        const res = await fetch(editingEdu ? `/api/site/education/${editingEdu.id}` : '/api/site/education', {
            method: editingEdu ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        const res = await fetch(`/api/site/education/${id}`, { method: 'DELETE' });
        if (res.ok) fetchData();
    };

    // Skills handlers
    const handleSkillsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const category = editingCategory || skillCategory;
        const skillsArray = skillsList.split(',').map(s => s.trim()).filter(s => s);
        const res = await fetch('/api/site/skills', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
        await fetch('/api/site/skills', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, skills: [] })
        });
        fetchData();
    };

    if (loading) {
        return (
            <AdminLayout title="Content">
                <div className="content-loading">
                    <div className="content-spinner" />
                </div>
            </AdminLayout>
        );
    }

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'experiences', label: 'Experience', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { id: 'education', label: 'Education', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
        { id: 'skills', label: 'Skills', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
    ];

    return (
        <AdminLayout title="Site Content" subtitle="Manage experiences, education and skills">
            {/* Tabs */}
            <div className="admin-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                        </svg>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ========== EXPERIENCES TAB ========== */}
            {activeTab === 'experiences' && (
                <div>
                    <div className="content-header">
                        <div>
                            <h2 className="content-item-title">Experience</h2>
                            <p className="admin-card-subtitle">{experiences.length} entries</p>
                        </div>
                        <button onClick={() => { setShowExpForm(true); setEditingExp(null); setExpForm({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' }); }}
                            className="admin-btn admin-btn-primary">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Experience
                        </button>
                    </div>

                    {showExpForm && (
                        <div className="admin-form-section" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="admin-form-section-title">{editingExp ? 'Edit Experience' : 'New Experience'}</h3>
                            <form onSubmit={handleExpSubmit}>
                                <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Job Title</label>
                                        <input type="text" value={expForm.title} onChange={e => setExpForm(f => ({ ...f, title: e.target.value }))} className="admin-form-input" required />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Company</label>
                                        <input type="text" value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))} className="admin-form-input" required />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Location</label>
                                        <input type="text" value={expForm.location} onChange={e => setExpForm(f => ({ ...f, location: e.target.value }))} className="admin-form-input" />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Start Date</label>
                                        <input type="text" value={expForm.startDate} onChange={e => setExpForm(f => ({ ...f, startDate: e.target.value }))} className="admin-form-input" placeholder="e.g. Oct 2023" required />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">End Date</label>
                                        <input type="text" value={expForm.endDate} onChange={e => setExpForm(f => ({ ...f, endDate: e.target.value }))} className="admin-form-input" disabled={expForm.current} placeholder="e.g. Sep 2025" />
                                    </div>
                                    <div className="admin-form-field" style={{ justifyContent: 'flex-end' }}>
                                        <label className="admin-form-checkbox">
                                            <input type="checkbox" checked={expForm.current} onChange={e => setExpForm(f => ({ ...f, current: e.target.checked, endDate: '' }))} />
                                            Current position
                                        </label>
                                    </div>
                                    <div className="admin-form-field full-width">
                                        <label className="admin-form-label">Responsibilities (one per line)</label>
                                        <textarea value={expForm.responsibilities} onChange={e => setExpForm(f => ({ ...f, responsibilities: e.target.value }))} rows={4} className="admin-form-textarea" />
                                    </div>
                                </div>
                                <div className="content-actions">
                                    <button type="submit" className="admin-btn admin-btn-primary">{editingExp ? 'Update' : 'Create'}</button>
                                    <button type="button" onClick={() => setShowExpForm(false)} className="admin-btn">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {experiences.length === 0 ? (
                        <div className="content-empty">
                            <div className="content-empty-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="content-empty-title">No experiences yet</p>
                            <p className="content-empty-text">Add your work experience</p>
                        </div>
                    ) : (
                        <div className="admin-card-list">
                            {experiences.map(exp => (
                                <div key={exp.id} className="admin-card">
                                    <div className="admin-card-header">
                                        <div>
                                            <div className="admin-card-title">{exp.title}</div>
                                            <div className="admin-card-subtitle">{exp.company} — {exp.location}</div>
                                            <div className="admin-card-meta">
                                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                            </div>
                                        </div>
                                        <div className="admin-card-actions">
                                            <button onClick={() => editExp(exp)} className="admin-btn admin-btn-sm">Edit</button>
                                            <button onClick={() => deleteExp(exp.id)} className="admin-btn admin-btn-sm admin-btn-danger">Delete</button>
                                        </div>
                                    </div>
                                    {exp.responsibilities.length > 0 && (
                                        <div className="admin-card-body">
                                            <ul style={{ paddingLeft: '1.25rem', listStyle: 'disc' }}>
                                                {exp.responsibilities.map((r, i) => (
                                                    <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--gray)', marginBottom: '0.25rem' }}>{r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ========== EDUCATION TAB ========== */}
            {activeTab === 'education' && (
                <div>
                    <div className="content-header">
                        <div>
                            <h2 className="content-item-title">Education</h2>
                            <p className="admin-card-subtitle">{education.length} entries</p>
                        </div>
                        <button onClick={() => { setShowEduForm(true); setEditingEdu(null); setEduForm({ degree: '', institution: '', location: '', startYear: '', endYear: '', current: false, description: '' }); }}
                            className="admin-btn admin-btn-primary">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Education
                        </button>
                    </div>

                    {showEduForm && (
                        <div className="admin-form-section" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="admin-form-section-title">{editingEdu ? 'Edit Education' : 'New Education'}</h3>
                            <form onSubmit={handleEduSubmit}>
                                <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Degree</label>
                                        <input type="text" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} className="admin-form-input" required />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Institution</label>
                                        <input type="text" value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} className="admin-form-input" required />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Location</label>
                                        <input type="text" value={eduForm.location} onChange={e => setEduForm(f => ({ ...f, location: e.target.value }))} className="admin-form-input" />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">Start Year</label>
                                        <input type="number" value={eduForm.startYear} onChange={e => setEduForm(f => ({ ...f, startYear: e.target.value }))} className="admin-form-input" required />
                                    </div>
                                    <div className="admin-form-field">
                                        <label className="admin-form-label">End Year</label>
                                        <input type="number" value={eduForm.endYear} onChange={e => setEduForm(f => ({ ...f, endYear: e.target.value }))} className="admin-form-input" disabled={eduForm.current} />
                                    </div>
                                    <div className="admin-form-field" style={{ justifyContent: 'flex-end' }}>
                                        <label className="admin-form-checkbox">
                                            <input type="checkbox" checked={eduForm.current} onChange={e => setEduForm(f => ({ ...f, current: e.target.checked, endYear: '' }))} />
                                            Currently enrolled
                                        </label>
                                    </div>
                                    <div className="admin-form-field full-width">
                                        <label className="admin-form-label">Description</label>
                                        <textarea value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))} rows={3} className="admin-form-textarea" />
                                    </div>
                                </div>
                                <div className="content-actions">
                                    <button type="submit" className="admin-btn admin-btn-primary">{editingEdu ? 'Update' : 'Create'}</button>
                                    <button type="button" onClick={() => setShowEduForm(false)} className="admin-btn">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {education.length === 0 ? (
                        <div className="content-empty">
                            <div className="content-empty-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                                </svg>
                            </div>
                            <p className="content-empty-title">No education entries yet</p>
                            <p className="content-empty-text">Add your academic background</p>
                        </div>
                    ) : (
                        <div className="admin-card-list">
                            {education.map(edu => (
                                <div key={edu.id} className="admin-card">
                                    <div className="admin-card-header">
                                        <div>
                                            <div className="admin-card-title">{edu.degree}</div>
                                            <div className="admin-card-subtitle">{edu.institution} — {edu.location}</div>
                                            <div className="admin-card-meta">
                                                {edu.startYear} – {edu.current ? 'Present' : edu.endYear}
                                            </div>
                                        </div>
                                        <div className="admin-card-actions">
                                            <button onClick={() => editEdu(edu)} className="admin-btn admin-btn-sm">Edit</button>
                                            <button onClick={() => deleteEdu(edu.id)} className="admin-btn admin-btn-sm admin-btn-danger">Delete</button>
                                        </div>
                                    </div>
                                    {edu.description && (
                                        <div className="admin-card-body">
                                            <p style={{ fontSize: '0.8125rem', color: 'var(--gray)' }}>{edu.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ========== SKILLS TAB ========== */}
            {activeTab === 'skills' && (
                <div>
                    <div className="content-header">
                        <div>
                            <h2 className="content-item-title">Skills</h2>
                            <p className="admin-card-subtitle">{Object.keys(skills).length} categories</p>
                        </div>
                    </div>

                    {/* Add / Edit Skills Form */}
                    <div className="admin-form-section" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="admin-form-section-title">{editingCategory ? `Edit: ${editingCategory}` : 'Add Skill Category'}</h3>
                        <form onSubmit={handleSkillsSubmit}>
                            <div className="admin-card-list">
                                <div className="admin-form-field">
                                    <label className="admin-form-label">Category Name</label>
                                    <input type="text" value={skillCategory} onChange={e => setSkillCategory(e.target.value)} className="admin-form-input" placeholder="e.g. Languages, Frameworks" required disabled={!!editingCategory} />
                                </div>
                                <div className="admin-form-field">
                                    <label className="admin-form-label">Skills (comma-separated)</label>
                                    <input type="text" value={skillsList} onChange={e => setSkillsList(e.target.value)} className="admin-form-input" placeholder="e.g. Java, TypeScript, Python" required />
                                </div>
                                <div className="content-actions">
                                    <button type="submit" className="admin-btn admin-btn-primary">{editingCategory ? 'Update' : 'Add Category'}</button>
                                    {editingCategory && (
                                        <button type="button" onClick={() => { setEditingCategory(null); setSkillCategory(''); setSkillsList(''); }} className="admin-btn">Cancel</button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {Object.keys(skills).length === 0 ? (
                        <div className="content-empty">
                            <div className="content-empty-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <p className="content-empty-title">No skills yet</p>
                            <p className="content-empty-text">Add skill categories above</p>
                        </div>
                    ) : (
                        <div className="content-grid">
                            {Object.entries(skills).map(([category, skillsArr]) => (
                                <div key={category} className="admin-card">
                                    <div className="admin-card-header">
                                        <div className="admin-card-title">{category}</div>
                                        <div className="admin-card-actions">
                                            <button onClick={() => editSkillCategory(category, skillsArr)} className="admin-btn admin-btn-sm">Edit</button>
                                            <button onClick={() => deleteSkillCategory(category)} className="admin-btn admin-btn-sm admin-btn-danger">Delete</button>
                                        </div>
                                    </div>
                                    <div className="admin-card-body">
                                        <div className="admin-tags-wrap">
                                            {skillsArr.map((skill, i) => (
                                                <span key={i} className="admin-tag">{skill}</span>
                                            ))}
                                        </div>
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
