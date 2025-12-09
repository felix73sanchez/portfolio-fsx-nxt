/**
 * Auth Library Tests
 * Tests for password hashing, JWT tokens, and user authentication
 */

import { hashPassword, comparePasswords, generateToken, verifyToken } from '@/lib/auth';

describe('Auth Library', () => {
    describe('Password Hashing', () => {
        it('should hash a password', () => {
            const password = 'testpassword123';
            const hash = hashPassword(password);

            expect(hash).toBeDefined();
            expect(hash).not.toBe(password);
            expect(hash.length).toBeGreaterThan(0);
        });

        it('should generate different hashes for same password', () => {
            const password = 'testpassword123';
            const hash1 = hashPassword(password);
            const hash2 = hashPassword(password);

            // bcrypt generates different salts each time
            expect(hash1).not.toBe(hash2);
        });

        it('should verify correct password', () => {
            const password = 'testpassword123';
            const hash = hashPassword(password);

            expect(comparePasswords(password, hash)).toBe(true);
        });

        it('should reject incorrect password', () => {
            const password = 'testpassword123';
            const wrongPassword = 'wrongpassword';
            const hash = hashPassword(password);

            expect(comparePasswords(wrongPassword, hash)).toBe(false);
        });
    });

    describe('JWT Tokens', () => {
        const mockUserId = 1;
        const mockEmail = 'test@example.com';

        it('should generate a valid token', () => {
            const token = generateToken(mockUserId, mockEmail);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });

        it('should verify a valid token', () => {
            const token = generateToken(mockUserId, mockEmail);
            const decoded = verifyToken(token);

            expect(decoded).toBeDefined();
            expect(decoded?.userId).toBe(mockUserId);
            expect(decoded?.email).toBe(mockEmail);
        });

        it('should reject an invalid token', () => {
            const invalidToken = 'invalid.token.here';
            const decoded = verifyToken(invalidToken);

            expect(decoded).toBeNull();
        });

        it('should reject a tampered token', () => {
            const token = generateToken(mockUserId, mockEmail);
            const tamperedToken = token.slice(0, -5) + 'xxxxx';
            const decoded = verifyToken(tamperedToken);

            expect(decoded).toBeNull();
        });
    });
});
