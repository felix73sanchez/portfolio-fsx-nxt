'use client';

import { useState } from 'react';

interface ShareBarProps {
  url: string;
  title: string;
}

export default function ShareBar({ url, title }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context); fail silently.
    }
  };

  return (
    <div style={{ padding: '40px 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
      <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>¿Te gustó este artículo?</p>
      <p style={{ marginBottom: '32px', color: 'var(--gray)' }}>Compártelo con tu comunidad</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en X"
          style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }}
          title="X"
        >
          <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en LinkedIn"
          style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }}
          title="LinkedIn"
        >
          <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en Facebook"
          style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }}
          title="Facebook"
        >
          <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
        </a>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Enlace copiado' : 'Copiar enlace'}
          style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: copied ? 'var(--accent)' : 'var(--light-gray)', border: 'none', cursor: 'pointer', color: copied ? '#fff' : 'inherit', transition: 'background 0.2s ease' }}
          title={copied ? '¡Copiado!' : 'Copiar enlace'}
        >
          {copied ? (
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
