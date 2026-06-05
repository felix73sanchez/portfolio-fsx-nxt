'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeContext';

interface PostRef {
  title: string;
  slug: string;
}

interface Command {
  id: string;
  group: string;
  label: string;
  keywords: string;
  perform: () => void;
}

const GROUP_ORDER = ['Navegación', 'Tema', 'Artículos'] as const;

export default function CommandPalette({ posts }: { posts: PostRef[] }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (path: string) => () => {
      router.push(path);
      close();
    };

    const base: Command[] = [
      { id: 'nav-home', group: 'Navegación', label: 'Inicio', keywords: 'home inicio', perform: go('/') },
      { id: 'nav-about', group: 'Navegación', label: 'Sobre mí', keywords: 'about sobre mi bio', perform: go('/sobre-mi') },
      { id: 'nav-projects', group: 'Navegación', label: 'Proyectos', keywords: 'projects proyectos work trabajo', perform: go('/proyectos') },
      { id: 'nav-blog', group: 'Navegación', label: 'Blog', keywords: 'blog articulos posts', perform: go('/blog') },
      {
        id: 'theme',
        group: 'Tema',
        label: theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
        keywords: 'theme tema dark light claro oscuro toggle',
        perform: () => {
          toggleTheme();
          close();
        },
      },
    ];

    const postCommands: Command[] = posts.map((post) => ({
      id: `post-${post.slug}`,
      group: 'Artículos',
      label: post.title,
      keywords: post.title,
      perform: go(`/blog/${post.slug}`),
    }));

    return [...base, ...postCommands];
  }, [posts, theme, router, toggleTheme, close]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Group the filtered commands and keep a flat ordered list so keyboard
  // selection and the rendered order always agree.
  const groups = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        items: filtered.filter((c) => c.group === group),
      })).filter((g) => g.items.length > 0),
    [filtered]
  );
  const ordered = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // Toggle with Cmd/Ctrl+K, or open via a custom event (e.g. the header button).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('cmdk:open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('cmdk:open', onOpen);
    };
  }, []);

  // Keep the active item within the current result bounds.
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus the input and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Scroll the active item into view as the user navigates.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, ordered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      ordered[activeIndex]?.perform();
    }
  };

  let runningIndex = -1;

  return (
    <div
      className="cmdk-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Paleta de comandos"
      onClick={close}
    >
      <div className="cmdk-panel" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Buscar páginas, artículos, acciones..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar comandos"
        />

        <ul className="cmdk-list" ref={listRef}>
          {ordered.length === 0 && <li className="cmdk-empty">Sin resultados</li>}

          {groups.map(({ group, items }) => (
            <li key={group}>
              <p className="cmdk-group">{group}</p>
              <ul>
                {items.map((cmd) => {
                  runningIndex += 1;
                  const index = runningIndex;
                  return (
                    <li key={cmd.id}>
                      <button
                        type="button"
                        data-index={index}
                        className={`cmdk-item${index === activeIndex ? ' cmdk-item-active' : ''}`}
                        onMouseMove={() => setActiveIndex(index)}
                        onClick={() => cmd.perform()}
                      >
                        {cmd.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <div className="cmdk-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
          <span><kbd>↵</kbd> abrir</span>
          <span><kbd>esc</kbd> cerrar</span>
        </div>
      </div>
    </div>
  );
}
