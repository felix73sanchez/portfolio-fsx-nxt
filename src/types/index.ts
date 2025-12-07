export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage?: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  // Author info
  authorId?: number | null;
  authorName?: string | null;
}

export interface CreateBlogPostInput {
  title: string;
  description: string;
  content: string;
  coverImage?: string | null;
  tags?: string[];
  published?: boolean;
  authorId?: number;
}

export interface UpdateBlogPostInput {
  title?: string;
  description?: string;
  content?: string;
  coverImage?: string | null;
  tags?: string[];
  published?: boolean;
}

export interface AuthToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}
