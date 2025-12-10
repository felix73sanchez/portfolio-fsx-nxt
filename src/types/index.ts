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
  description: string | null;
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

// Project types
export interface ProjectLink {
  label: string;
  url: string;
  icon?: 'github' | 'backend' | 'frontend' | 'demo' | 'website';
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  displayOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  technologies: string[];
  links?: ProjectLink[];
  displayOrder?: number;
  visible?: boolean;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  technologies?: string[];
  links?: ProjectLink[];
  displayOrder?: number;
  visible?: boolean;
}
