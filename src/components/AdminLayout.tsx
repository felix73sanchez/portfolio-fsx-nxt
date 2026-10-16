'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminCopy } from '@/lib/admin-copy';
import { useTheme } from './ThemeContext';
import '@/app/admin/admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole');
    if (storedUser || storedRole) {
      setUser({ name: storedUser || 'Admin', role: storedRole || undefined });
    }

    let active = true;
    fetch('/api/auth/me')
      .then(async (res) => {
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userRole', data.user.role);
            setUser({ name: data.user.name, role: data.user.role });
          }
        } else if (res.status === 401) {
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
          router.push('/admin/login');
        }
      })
      .catch(() => {
        // Fallback to cached state if offline
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    router.push('/admin/login');
  };

  // Redirect editor users away from owner-only pages
  useEffect(() => {
    if (!user?.role) return;

    const ownerOnlyPaths = ['/admin/projects', '/admin/profile', '/admin/content'];
    const isOwnerOnly = ownerOnlyPaths.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    );

    if (user.role !== 'owner' && isOwnerOnly) {
      router.push('/admin/dashboard');
    }
  }, [user, pathname, router]);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [sidebarOpen]);

  const allNavItems = [
    {
      index: '01',
      href: '/admin/dashboard',
      label: adminCopy.navigation.dashboard,
      icon: (
        <svg className="admin-sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      requireOwner: false,
    },
    {
      index: '02',
      href: '/admin/posts',
      label: adminCopy.navigation.posts,
      icon: (
        <svg className="admin-sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      requireOwner: false,
    },
    {
      index: '03',
      href: '/admin/projects',
      label: adminCopy.navigation.projects,
      icon: (
        <svg className="admin-sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      requireOwner: true,
    },
    {
      index: '04',
      href: '/admin/content',
      label: adminCopy.navigation.content,
      icon: (
        <svg className="admin-sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      requireOwner: true,
    },
    {
      index: '05',
      href: '/admin/profile',
      label: adminCopy.navigation.profile,
      icon: (
        <svg className="admin-sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      requireOwner: true,
    },
  ];

  const navItems = allNavItems.filter(
    (item) => !item.requireOwner || user?.role === 'owner'
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-accent" />

        {/* Brand */}
        <div className="admin-sidebar-brand">
          <Link href="/admin/dashboard" className="admin-sidebar-brand-link">
            <span className="logo">
              <span className="logo-bracket">&lt;</span>
              <span className="logo-text">FSX</span>
              <span className="logo-bracket">/&gt;</span>
            </span>
            <span className="admin-sidebar-badge font-mono">ADMIN</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-sidebar-close"
            aria-label="Cerrar menú"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="admin-sidebar-section-label font-mono">Navegación</div>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`admin-sidebar-link ${isActive(item.href) ? 'active' : ''}`}
            >
              <span className="admin-sidebar-index font-mono">{item.index}</span>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer / User */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar font-mono">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-row">
                <p className="admin-sidebar-user-name">{user?.name}</p>
                {user?.role && (
                  <span className="admin-sidebar-role font-mono">
                    {user.role === 'owner' ? 'Owner' : 'Editor'}
                  </span>
                )}
              </div>
              <div className="admin-sidebar-footer-links">
                <Link href="/" target="_blank" className="admin-sidebar-logout font-mono">
                  {adminCopy.navigation.viewSite} ↗
                </Link>
                <button onClick={handleLogout} className="admin-sidebar-logout font-mono">
                  {adminCopy.navigation.logout} ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-inner">
            <div className="admin-header-left">
              <button
                onClick={() => setSidebarOpen(true)}
                className="admin-mobile-toggle"
                aria-label="Abrir menú"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="admin-header-titles">
                <h1 className="admin-header-title">{title}</h1>
                {subtitle && <p className="admin-header-subtitle">{subtitle}</p>}
              </div>
            </div>
            <div className="admin-header-right">
              {actions}
              <button
                type="button"
                onClick={toggleTheme}
                className="admin-btn admin-btn-icon"
                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              >
                {theme === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <Link
                href="/"
                target="_blank"
                className="admin-view-site font-mono"
                title={adminCopy.navigation.viewSite}
                aria-label={adminCopy.navigation.viewSite}
              >
                <span className="admin-view-site-label">{adminCopy.navigation.viewSite}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
