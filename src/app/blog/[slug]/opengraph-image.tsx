import { ImageResponse } from 'next/og';
import { ensureDbReady } from '@/lib/db/ensure';
import { getPostBySlug } from '@/lib/db/blog';

// better-sqlite3 is a native module, so this must run on the Node runtime.
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Artículo del blog de Felix Sanchez';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  ensureDbReady();
  const post = getPostBySlug(slug);

  const title = post?.title ?? 'Blog';
  const author = post?.authorName ?? 'Felix Sanchez';
  const tags = (post?.tags ?? []).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: brand + tags */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 700 }}>
            <span style={{ color: '#3b82f6' }}>&lt;</span>
            <span style={{ color: '#fafafa' }}>FSX</span>
            <span style={{ color: '#3b82f6' }}>/&gt;</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 22,
                  color: '#60a5fa',
                  background: 'rgba(59, 130, 246, 0.15)',
                  padding: '8px 20px',
                  borderRadius: 9999,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 800,
            color: '#fafafa',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {title.length > 90 ? `${title.slice(0, 90)}…` : title}
        </div>

        {/* Bottom: accent bar + author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 64, height: 6, background: '#3b82f6', borderRadius: 3 }} />
          <div style={{ fontSize: 28, color: '#9ca3af' }}>{author}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
