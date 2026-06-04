'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    const observed = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Tabla de contenido" className="toc">
      <p className="toc-title">En este artículo</p>
      <ul className="toc-list">
        {items.map((item) => (
          <li
            key={item.id}
            className="toc-item"
            style={{ paddingLeft: item.level >= 3 ? '0.875rem' : 0 }}
          >
            <a
              href={`#${item.id}`}
              className={`toc-link${activeId === item.id ? ' toc-link-active' : ''}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
