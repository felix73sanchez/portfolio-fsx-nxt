'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';

export default function Header() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const navItems = [
        { href: '/', label: 'Inicio', number: '01' },
        { href: '/sobre-mi', label: 'Sobre mí', number: '02' },
        { href: '/proyectos', label: 'Proyectos', number: '03' },
        { href: '/blog', label: 'Blog', number: '04' },
    ];

    return (
        <header className="header">
            <nav className="nav-content">
                <Link href="/" className="logo">
                    <span className="logo-bracket">&lt;</span>
                    <span className="logo-text">FSX</span>
                    <span className="logo-bracket">/&gt;</span>
                </Link>

                {/* Desktop nav */}
                <div className="nav-links">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? 'active' : ''}`}>
                            <span className="nav-number">{item.number}.</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <button
                        onClick={() => window.dispatchEvent(new Event('cmdk:open'))}
                        className="cmdk-trigger"
                        aria-label="Abrir paleta de comandos"
                        title="Buscar (⌘K)"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span className="cmdk-trigger-kbd">⌘K</span>
                    </button>

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

                {/* Mobile controls */}
                <div className="mobile-controls">
                    <button
                        onClick={() => window.dispatchEvent(new Event('cmdk:open'))}
                        className="cmdk-trigger"
                        aria-label="Buscar"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {theme === 'dark' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="mobile-menu-btn"
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuOpen}
                    >
                        <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
                            <span />
                            <span />
                            <span />
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile slide-in menu */}
            {menuOpen && (
                <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)} />
            )}
            <div className={`mobile-nav-panel ${menuOpen ? 'open' : ''}`}>
                <nav>
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className="nav-number">{item.number}.</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
