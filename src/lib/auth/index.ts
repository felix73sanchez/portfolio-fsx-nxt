import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db/init';
import { User, AuthToken } from '@/types';

// ============================================
// SECURITY: JWT Secret Configuration
// ============================================
const isProduction = process.env.NODE_ENV === 'production';
const rawSecret = process.env.JWT_SECRET;

// In production, JWT_SECRET MUST be defined - no fallbacks allowed
if (isProduction && !rawSecret) {
  throw new Error(
    '🔴 CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not set.\n' +
    'This is required in production to prevent token forgery attacks.\n' +
    'Please set JWT_SECRET in your environment variables or .env file.'
  );
}

// In development, allow fallback but warn loudly
if (!isProduction && !rawSecret) {
  console.warn(
    '⚠️  WARNING: JWT_SECRET not set. Using insecure default for development only.\n' +
    '   Set JWT_SECRET in .env.local before deploying to production!'
  );
}

const JWT_SECRET: string = rawSecret || 'dev-only-insecure-secret-do-not-use-in-prod';
const JWT_EXPIRY = '7d';

export function hashPassword(password: string): string {
  return bcryptjs.hashSync(password, 10);
}

export function comparePasswords(password: string, hash: string): boolean {
  return bcryptjs.compareSync(password, hash);
}

export function generateToken(userId: number, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  // Auth is cookie-based: the browser automatically sends the httpOnly
  // 'auth-token' cookie on same-origin requests. We no longer read the
  // Authorization header, keeping a single source of truth with the middleware.
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  return getUserById(decoded.userId);
}

/**
 * Reads and verifies the auth token from the httpOnly 'auth-token' cookie.
 * Use in Route Handlers that receive a plain `Request` (no NextRequest),
 * where `request.cookies` is not available.
 */
export async function getAuthFromCookies(): Promise<AuthToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export function createUser(email: string, password: string, name: string): User {
  const db = getDb();
  const hashedPassword = hashPassword(password);
  const createdAt = new Date().toISOString();

  const result = db
    .prepare('INSERT INTO users (email, password, name, createdAt) VALUES (?, ?, ?, ?)')
    .run(email, hashedPassword, name, createdAt);

  return {
    id: result.lastInsertRowid as number,
    email,
    name,
    createdAt,
  };
}

export function getUserByEmail(email: string): (User & { password: string }) | null {
  const db = getDb();
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as (User & { password: string }) | undefined;

  return user || null;
}

export function getUserById(id: number): User | null {
  const db = getDb();
  const user = db
    .prepare('SELECT id, email, name, createdAt FROM users WHERE id = ?')
    .get(id) as User | undefined;

  return user || null;
}

// ============================================
// Password Reset Functions
// ============================================

export function setResetToken(email: string, token: string, expiry: string): boolean {
  const db = getDb();
  const result = db
    .prepare('UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?')
    .run(token, expiry, email);
  return result.changes > 0;
}

export function getUserByResetToken(token: string): { id: number; email: string } | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT id, email FROM users WHERE resetToken = ? AND resetTokenExpiry > datetime('now')`)
    .get(token) as { id: number; email: string } | undefined;
  return row || null;
}

export function updatePassword(userId: number, newPassword: string): boolean {
  const db = getDb();
  const hashed = hashPassword(newPassword);
  const result = db
    .prepare('UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?')
    .run(hashed, userId);
  return result.changes > 0;
}

export function clearResetToken(userId: number): boolean {
  const db = getDb();
  const result = db
    .prepare('UPDATE users SET resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?')
    .run(userId);
  return result.changes > 0;
}
