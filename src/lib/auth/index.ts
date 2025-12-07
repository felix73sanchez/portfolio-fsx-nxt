import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db/init';
import { User, AuthToken } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
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
