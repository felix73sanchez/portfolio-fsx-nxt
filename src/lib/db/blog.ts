import { getDb } from '@/lib/db/init';
import { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAllPublishedPosts(): BlogPost[] {
  const db = getDb();
  const posts = db
    .prepare(`
      SELECT id, slug, title, description, content, coverImage, tags, 
             published, createdAt, updatedAt, publishedAt 
      FROM blog_posts 
      WHERE published = 1 
      ORDER BY publishedAt DESC
    `)
    .all() as any[];

  return posts.map(parseBlogPost);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const db = getDb();
  const post = db
    .prepare(`
      SELECT id, slug, title, description, content, coverImage, tags, 
             published, createdAt, updatedAt, publishedAt 
      FROM blog_posts 
      WHERE slug = ?
    `)
    .get(slug) as any | undefined;

  return post ? parseBlogPost(post) : null;
}

export function getPostById(id: number): BlogPost | null {
  const db = getDb();
  const post = db
    .prepare(`
      SELECT id, slug, title, description, content, coverImage, tags, 
             published, createdAt, updatedAt, publishedAt 
      FROM blog_posts 
      WHERE id = ?
    `)
    .get(id) as any | undefined;

  return post ? parseBlogPost(post) : null;
}

export function createPost(input: CreateBlogPostInput): BlogPost {
  const db = getDb();
  const slug = slugify(input.title);
  const tags = JSON.stringify(input.tags || []);

  const result = db
    .prepare(`
      INSERT INTO blog_posts (slug, title, description, content, coverImage, tags, published, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      slug,
      input.title,
      input.description,
      input.content,
      input.coverImage || null,
      tags,
      input.published ? 1 : 0,
      input.published ? new Date().toISOString() : null
    );

  const post = getPostById(result.lastInsertRowid as number);
  if (!post) {
    throw new Error('Failed to create post');
  }

  return post;
}

export function updatePost(id: number, input: UpdateBlogPostInput): BlogPost {
  const db = getDb();
  const post = getPostById(id);

  if (!post) {
    throw new Error('Post not found');
  }

  const updates: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    updates.title = input.title;
  }
  if (input.description !== undefined) {
    updates.description = input.description;
  }
  if (input.content !== undefined) {
    updates.content = input.content;
  }
  if (input.coverImage !== undefined) {
    updates.coverImage = input.coverImage;
  }
  if (input.tags !== undefined) {
    updates.tags = JSON.stringify(input.tags);
  }
  if (input.published !== undefined) {
    updates.published = input.published ? 1 : 0;
    if (input.published && !post.publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }
  }

  const setClause = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');

  const values = [...Object.values(updates), id];

  db.prepare(`UPDATE blog_posts SET ${setClause} WHERE id = ?`).run(...values);

  const updated = getPostById(id);
  if (!updated) {
    throw new Error('Failed to update post');
  }

  return updated;
}

export function deletePost(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
  return result.changes > 0;
}

function parseBlogPost(row: any): BlogPost {
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [],
    published: Boolean(row.published),
  };
}
