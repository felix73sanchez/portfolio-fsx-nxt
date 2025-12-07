import { getDb } from './init';

// ==========================================
// SITE CONFIG (Profile information)
// ==========================================

export interface SiteConfig {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    about: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
}

const DEFAULT_CONFIG: SiteConfig = {
    name: 'Tu Nombre',
    title: 'Tu Título Profesional',
    subtitle: 'Developer',
    location: 'Tu Ciudad, País',
    about: 'Escribe aquí tu descripción profesional...',
    email: 'tu@email.com',
    phone: '+1234567890',
    linkedin: 'https://linkedin.com/in/tu-perfil',
    github: 'https://github.com/tu-usuario'
};

export function getSiteConfig(): SiteConfig {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_config').all() as { key: string; value: string }[];

    const config = { ...DEFAULT_CONFIG };

    for (const row of rows) {
        if (row.key in config) {
            (config as Record<string, string>)[row.key] = row.value;
        }
    }

    return config;
}

export function updateSiteConfig(key: string, value: string): void {
    const db = getDb();
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT id FROM site_config WHERE key = ?').get(key);

    if (existing) {
        db.prepare('UPDATE site_config SET value = ?, updatedAt = ? WHERE key = ?').run(value, now, key);
    } else {
        db.prepare('INSERT INTO site_config (key, value, updatedAt) VALUES (?, ?, ?)').run(key, value, now);
    }
}

export function updateSiteConfigBatch(config: Partial<SiteConfig>): void {
    const db = getDb();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
    INSERT INTO site_config (key, value, updatedAt) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `);

    const transaction = db.transaction(() => {
        for (const [key, value] of Object.entries(config)) {
            if (value !== undefined) {
                stmt.run(key, value, now);
            }
        }
    });

    transaction();
}

// ==========================================
// EXPERIENCES (Work experience)
// ==========================================

export interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    responsibilities: string[];
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

interface DbExperience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    current: number;
    responsibilities: string;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

function mapDbToExperience(row: DbExperience): Experience {
    return {
        ...row,
        current: row.current === 1,
        responsibilities: JSON.parse(row.responsibilities)
    };
}

export function getAllExperiences(): Experience[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM experiences ORDER BY displayOrder ASC, startDate DESC').all() as DbExperience[];
    return rows.map(mapDbToExperience);
}

export function getExperienceById(id: number): Experience | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM experiences WHERE id = ?').get(id) as DbExperience | undefined;
    return row ? mapDbToExperience(row) : null;
}

export function createExperience(input: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Experience {
    const db = getDb();
    const now = new Date().toISOString();

    const result = db.prepare(`
    INSERT INTO experiences (title, company, location, startDate, endDate, current, responsibilities, displayOrder, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        input.title,
        input.company,
        input.location || '',
        input.startDate,
        input.endDate,
        input.current ? 1 : 0,
        JSON.stringify(input.responsibilities),
        input.displayOrder || 0,
        now,
        now
    );

    return getExperienceById(Number(result.lastInsertRowid))!;
}

export function updateExperience(id: number, input: Partial<Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>>): Experience | null {
    const db = getDb();
    const existing = getExperienceById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    db.prepare(`
    UPDATE experiences SET
      title = ?, company = ?, location = ?, startDate = ?, endDate = ?,
      current = ?, responsibilities = ?, displayOrder = ?, updatedAt = ?
    WHERE id = ?
  `).run(
        input.title ?? existing.title,
        input.company ?? existing.company,
        input.location ?? existing.location,
        input.startDate ?? existing.startDate,
        input.endDate ?? existing.endDate,
        input.current !== undefined ? (input.current ? 1 : 0) : (existing.current ? 1 : 0),
        JSON.stringify(input.responsibilities ?? existing.responsibilities),
        input.displayOrder ?? existing.displayOrder,
        now,
        id
    );

    return getExperienceById(id);
}

export function deleteExperience(id: number): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
    return result.changes > 0;
}

// ==========================================
// SKILLS
// ==========================================

export interface Skill {
    id: number;
    category: string;
    name: string;
    displayOrder: number;
}

export function getAllSkills(): Skill[] {
    const db = getDb();
    return db.prepare('SELECT * FROM skills ORDER BY category, displayOrder').all() as Skill[];
}

export function getSkillsByCategory(): Record<string, string[]> {
    const skills = getAllSkills();
    const grouped: Record<string, string[]> = {};

    for (const skill of skills) {
        if (!grouped[skill.category]) {
            grouped[skill.category] = [];
        }
        grouped[skill.category].push(skill.name);
    }

    return grouped;
}

export function createSkill(category: string, name: string, displayOrder: number = 0): Skill {
    const db = getDb();
    const result = db.prepare('INSERT INTO skills (category, name, displayOrder) VALUES (?, ?, ?)').run(category, name, displayOrder);
    return { id: Number(result.lastInsertRowid), category, name, displayOrder };
}

export function deleteSkill(id: number): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM skills WHERE id = ?').run(id);
    return result.changes > 0;
}

export function deleteSkillsByCategory(category: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM skills WHERE category = ?').run(category);
    return result.changes > 0;
}

export function updateSkillsForCategory(category: string, skills: string[]): void {
    const db = getDb();

    const transaction = db.transaction(() => {
        db.prepare('DELETE FROM skills WHERE category = ?').run(category);

        const stmt = db.prepare('INSERT INTO skills (category, name, displayOrder) VALUES (?, ?, ?)');
        skills.forEach((name, index) => {
            stmt.run(category, name, index);
        });
    });

    transaction();
}

// ==========================================
// EDUCATION
// ==========================================

export interface Education {
    id: number;
    degree: string;
    institution: string;
    location: string;
    startYear: number;
    endYear: number | null;
    current: boolean;
    description: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

interface DbEducation {
    id: number;
    degree: string;
    institution: string;
    location: string;
    startYear: number;
    endYear: number | null;
    current: number;
    description: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

function mapDbToEducation(row: DbEducation): Education {
    return {
        ...row,
        current: row.current === 1
    };
}

export function getAllEducation(): Education[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM education ORDER BY displayOrder ASC, startYear DESC').all() as DbEducation[];
    return rows.map(mapDbToEducation);
}

export function getEducationById(id: number): Education | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM education WHERE id = ?').get(id) as DbEducation | undefined;
    return row ? mapDbToEducation(row) : null;
}

export function createEducation(input: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Education {
    const db = getDb();
    const now = new Date().toISOString();

    const result = db.prepare(`
    INSERT INTO education (degree, institution, location, startYear, endYear, current, description, displayOrder, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        input.degree,
        input.institution,
        input.location || '',
        input.startYear,
        input.endYear,
        input.current ? 1 : 0,
        input.description,
        input.displayOrder || 0,
        now,
        now
    );

    return getEducationById(Number(result.lastInsertRowid))!;
}

export function updateEducation(id: number, input: Partial<Omit<Education, 'id' | 'createdAt' | 'updatedAt'>>): Education | null {
    const db = getDb();
    const existing = getEducationById(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    db.prepare(`
    UPDATE education SET
      degree = ?, institution = ?, location = ?, startYear = ?, endYear = ?,
      current = ?, description = ?, displayOrder = ?, updatedAt = ?
    WHERE id = ?
  `).run(
        input.degree ?? existing.degree,
        input.institution ?? existing.institution,
        input.location ?? existing.location,
        input.startYear ?? existing.startYear,
        input.endYear ?? existing.endYear,
        input.current !== undefined ? (input.current ? 1 : 0) : (existing.current ? 1 : 0),
        input.description ?? existing.description,
        input.displayOrder ?? existing.displayOrder,
        now,
        id
    );

    return getEducationById(id);
}

export function deleteEducation(id: number): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM education WHERE id = ?').run(id);
    return result.changes > 0;
}
