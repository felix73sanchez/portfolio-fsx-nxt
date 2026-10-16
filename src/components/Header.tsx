'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';

interface HeaderProps {
    github?: string;
    linkedin?: string;
    phone?: string;
}

const navItems = [
    { href: '/', label: 'Inicio', number: '01' },
    { href: '/sobre-mi', label: 'Sobre mí', number: '02' },
    { href: '/proyectos', label: 'Proyectos', number: '03' },
    { href: '/blog', label: 'Blog', number: '04' },
];

function Brand() {
    return (
        <Link href="/" className="logo" aria-label="FSX, inicio">
            <span className="logo-bracket">&lt;</span>
            <span className="logo-text">FSX</span>
            <span className="logo-bracket">/&gt;</span>
        </Link>
    );
}

function SearchButton({ compact = false }: { compact?: boolean }) {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('cmdk:open'))}
            className="public-control public-search-control"
            aria-label="Abrir paleta de comandos"
            title="Buscar (⌘K)"
        >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {!compact && <span className="public-control-label">⌘K</span>}
        </button>
    );
}

function ThemeButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="public-control public-theme-control"
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
            {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
}

function SocialLinks({ github, linkedin, phone }: HeaderProps) {
    return (
        <div className="public-social-links font-mono" aria-label="Redes y contacto">
            {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>}
            {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>Teléfono <span aria-hidden="true">↗</span></a>}
        </div>
    );
}

export default function Header({ github, linkedin, phone }: HeaderProps) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const isActive = (path: string) => path === '/' ? pathname === '/' : pathname.startsWith(path);

    return (
        <>
            <aside className="public-rail" aria-label="Navegación principal">
                <Brand />
                <nav className="public-rail-nav font-mono">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : ''}>
                            <span className="public-index">{item.number}.</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="public-rail-meta">
                    <SocialLinks github={github} linkedin={linkedin} phone={phone} />
                    <div className="public-rail-controls">
                        <SearchButton />
                        <ThemeButton />
                    </div>
                </div>
            </aside>

            <header className="public-mobile-header">
                <Brand />
                <div className="public-mobile-controls">
                    <SearchButton compact />
                    <ThemeButton />
                    <button
                        type="button"
                        className="public-menu-toggle"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuOpen}
                    >
                        <span className={`hamburger ${menuOpen ? 'open' : ''}`} aria-hidden="true"><span /><span /><span /></span>
                    </button>
                </div>
            </header>

            {menuOpen && (
                <>
                    <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)} />
                    <div className="mobile-nav-panel public-mobile-drawer" role="dialog" aria-modal="true" aria-label="Menú principal">
                        <button type="button" className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <nav className="font-mono">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} className={isActive(item.href) ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                                    <span className="public-index">{item.number}.</span>{item.label}
                                </Link>
                            ))}
                        </nav>
                        <SocialLinks github={github} linkedin={linkedin} phone={phone} />
                    </div>
                </>
            )}
        </>
    );
}
