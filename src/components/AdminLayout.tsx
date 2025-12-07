'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) router.push('/admin/login');
        setUser({ name: 'Felix Sanchez' });

        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [router]);

    useEffect(() => {
        if (sidebarOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [sidebarOpen]);

    const navItems = [
        {
            href: '/admin/dashboard', label: 'Dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            )
        },
        {
            href: '/admin/posts/new', label: 'Escribir', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            )
        },
        {
            href: '/admin/projects', label: 'Proyectos', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            )
        },
        {
            href: '/admin/content', label: 'Contenido', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            )
        },
        {
            href: '/admin/profile', label: 'Perfil', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] font-sans flex">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar - Fixed on Mobile, Sticky on Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[var(--card-bg)] lg:bg-[var(--bg)]/50 lg:backdrop-blur-xl border-r border-[var(--border)] transition-transform duration-300 ease-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          flex flex-col lg:sticky lg:top-0 lg:h-screen shrink-0`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--card-bg)]/50">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            F
                        </div>
                        <span className="font-bold tracking-tight">Admin</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--gray)]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${pathname === item.href
                                    ? 'bg-[var(--fg)] text-[var(--bg)] shadow-md'
                                    : 'text-[var(--gray)] hover:text-[var(--fg)] hover:bg-[var(--light-gray)]/50'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Footer */}
                <div className="p-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--light-gray)]/50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <button
                                onClick={() => { localStorage.removeItem('token'); router.push('/admin/login'); }}
                                className="text-xs text-[var(--gray)] hover:text-red-400 block mt-0.5"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className={`sticky top-0 z-30 h-16 transition-all duration-200 ${scrolled ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]' : ''}`}>
                    <div className="h-full w-full max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[var(--gray)]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight">{title}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {actions}
                            <Link href="/" target="_blank" className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--gray)] hover:text-[var(--fg)] transition-colors px-3 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--light-gray)]/50">
                                Ver Sitio ↗
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content Centered */}
                <main className="flex-1 w-full max-w-6xl mx-auto p-6 lg:p-8">
                    <div className="animate-fade-in pb-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
