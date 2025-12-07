import { getDb } from './init';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types';

interface DbProject {
    id: number;
    title: string;
    description: string;
    technologies: string;
    links: string | null;
    displayOrder: number;
    visible: number;
    createdAt: string;
    updatedAt: string;
}

function mapDbToProject(row: DbProject): Project {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        technologies: JSON.parse(row.technologies),
        links: row.links ? JSON.parse(row.links) : [],
        displayOrder: row.displayOrder,
        visible: row.visible === 1,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
    };
}

// Get all visible projects (for public page)
export function getVisibleProjects(): Project[] {
    const db = getDb();
    const rows = db.prepare(`
    SELECT * FROM projects 
    WHERE visible = 1 
    ORDER BY displayOrder ASC, createdAt DESC
  `).all() as DbProject[];

    return rows.map(mapDbToProject);
}

// Get all projects (for admin)
export function getAllProjects(): Project[] {
    const db = getDb();
    const rows = db.prepare(`
    SELECT * FROM projects 
    ORDER BY displayOrder ASC, createdAt DESC
  `).all() as DbProject[];

    return rows.map(mapDbToProject);
}

// Get project by ID
export function getProjectById(id: number): Project | null {
    const db = getDb();
    const row = db.prepare(`
    SELECT * FROM projects WHERE id = ?
  `).get(id) as DbProject | undefined;

    return row ? mapDbToProject(row) : null;
}

// Create project
export function createProject(input: CreateProjectInput): Project {
    const db = getDb();
    const now = new Date().toISOString();

    const result = db.prepare(`
    INSERT INTO projects (title, description, technologies, links, displayOrder, visible, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        input.title,
        input.description,
        JSON.stringify(input.technologies),
        input.links ? JSON.stringify(input.links) : null,
        input.displayOrder ?? 0,
        input.visible !== false ? 1 : 0,
        now,
        now
    );

    return getProjectById(Number(result.lastInsertRowid))!;
}

// Update project
export function updateProject(id: number, input: UpdateProjectInput): Project | null {
    const db = getDb();
    const existing = getProjectById(id);

    if (!existing) return null;

    const now = new Date().toISOString();

    db.prepare(`
    UPDATE projects SET
      title = ?,
      description = ?,
      technologies = ?,
      links = ?,
      displayOrder = ?,
      visible = ?,
      updatedAt = ?
    WHERE id = ?
  `).run(
        input.title ?? existing.title,
        input.description ?? existing.description,
        JSON.stringify(input.technologies ?? existing.technologies),
        JSON.stringify(input.links ?? existing.links),
        input.displayOrder ?? existing.displayOrder,
        input.visible !== undefined ? (input.visible ? 1 : 0) : (existing.visible ? 1 : 0),
        now,
        id
    );

    return getProjectById(id);
}

// Delete project
export function deleteProject(id: number): boolean {
    const db = getDb();
    const result = db.prepare(`DELETE FROM projects WHERE id = ?`).run(id);
    return result.changes > 0;
}

// Reorder projects
export function reorderProjects(projectIds: number[]): void {
    const db = getDb();
    const stmt = db.prepare(`UPDATE projects SET displayOrder = ? WHERE id = ?`);

    const transaction = db.transaction(() => {
        projectIds.forEach((id, index) => {
            stmt.run(index, id);
        });
    });

    transaction();
}
