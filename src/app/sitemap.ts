import type { MetadataRoute } from 'next';
import { ensureDbReady } from '@/lib/db/ensure';
import { getAllPublishedPosts } from '@/lib/db/blog';
import { SITE_URL } from '@/lib/site-url';

export const revalidate = 60;

export default function sitemap(): MetadataRoute.Sitemap {
  ensureDbReady();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/sobre-mi`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/proyectos`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPublishedPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
