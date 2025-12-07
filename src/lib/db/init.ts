import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'portfolio.db');
    const dirPath = path.dirname(dbPath);

    // Crear directorio si no existe
    if (!require('fs').existsSync(dirPath)) {
      require('fs').mkdirSync(dirPath, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initializeDatabase(): void {
  const database = getDb();

  // Crear tabla de usuarios
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      createdAt TEXT NOT NULL
    )
  `);

  // Crear tabla de blog posts con campo de autor
  database.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      coverImage TEXT,
      tags TEXT,
      published INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      publishedAt TEXT,
      authorId INTEGER,
      FOREIGN KEY (authorId) REFERENCES users(id)
    )
  `);

  // Agregar columna authorId si no existe (migración)
  try {
    database.exec(`ALTER TABLE blog_posts ADD COLUMN authorId INTEGER REFERENCES users(id)`);
  } catch {
    // La columna probablemente ya existe, ignorar el error
  }

  // Crear tabla de proyectos
  database.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL,
      links TEXT,
      displayOrder INTEGER DEFAULT 0,
      visible INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Crear tabla de configuración del sitio (perfil)
  database.exec(`
    CREATE TABLE IF NOT EXISTS site_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Crear tabla de experiencias laborales
  database.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT,
      current INTEGER DEFAULT 0,
      responsibilities TEXT NOT NULL,
      displayOrder INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Crear tabla de habilidades
  database.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      displayOrder INTEGER DEFAULT 0
    )
  `);

  // Crear tabla de educación
  database.exec(`
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      location TEXT,
      startYear INTEGER NOT NULL,
      endYear INTEGER,
      current INTEGER DEFAULT 0,
      description TEXT,
      displayOrder INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Crear índices
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published);
    CREATE INDEX IF NOT EXISTS idx_blog_author ON blog_posts(authorId);
    CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(displayOrder);
    CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
    CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);
    CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(displayOrder);
    CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
    CREATE INDEX IF NOT EXISTS idx_education_order ON education(displayOrder);
  `);
}
