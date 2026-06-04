/**
 * Public base URL of the site, used for canonical URLs, sitemap, robots and
 * Open Graph metadata. Set `NEXT_PUBLIC_SITE_URL` (e.g. https://example.com)
 * in your production environment. Falls back to localhost for development.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/+$/, '');
