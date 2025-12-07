'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';

export default function Header() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <header className="header">
            <nav className="nav-content">
                <Link href="/" className="logo">
                    <span className="logo-bracket">&lt;</span>
                    <span className="logo-text">FSX</span>
                    <span className="logo-bracket">/&gt;</span>
                </Link>

                <div className="nav-links">
                    <Link href="/" className={`nav-link ${isActive('/') && pathname === '/' ? 'active' : ''}`}>
                        <span className="nav-number">01.</span>
                        <span>Inicio</span>
                    </Link>
                    <Link href="/proyectos" className={`nav-link ${isActive('/proyectos') ? 'active' : ''}`}>
                        <span className="nav-number">02.</span>
                        <span>Proyectos</span>
                    </Link>
                    <Link href="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>
                        <span className="nav-number">03.</span>
                        <span>Blog</span>
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    >
                        {theme === 'dark' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
}
