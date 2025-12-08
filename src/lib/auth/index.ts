import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
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
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  return getUserById(decoded.userId);
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
