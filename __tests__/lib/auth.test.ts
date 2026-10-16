/**
 * Auth Library Tests
 * Tests for password hashing, JWT tokens, and user authentication
 */

import { hashPassword, comparePasswords, generateToken, verifyToken, hashResetToken, verifyServerSecret } from '@/lib/auth';

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
        const mockRole = 'owner' as const;

        it('should generate a valid token', () => {
            const token = generateToken(mockUserId, mockEmail, mockRole);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });

        it('should verify a valid token', () => {
            const token = generateToken(mockUserId, mockEmail, mockRole);
            const decoded = verifyToken(token);

            expect(decoded).toBeDefined();
            expect(decoded?.userId).toBe(mockUserId);
            expect(decoded?.email).toBe(mockEmail);
            expect(decoded?.role).toBe(mockRole);
        });

        it('should reject an invalid token', () => {
            const invalidToken = 'invalid.token.here';
            const decoded = verifyToken(invalidToken);

            expect(decoded).toBeNull();
        });

        it('should reject a tampered token', () => {
            const token = generateToken(mockUserId, mockEmail, mockRole);
            const tamperedToken = token.slice(0, -5) + 'xxxxx';
            const decoded = verifyToken(tamperedToken);

            expect(decoded).toBeNull();
        });
    });

    describe('Password Reset Security', () => {
        const originalInvitationCode = process.env.INVITATION_CODE;
        const originalResetSecret = process.env.ADMIN_RESET_SECRET;

        afterEach(() => {
            process.env.INVITATION_CODE = originalInvitationCode;
            process.env.ADMIN_RESET_SECRET = originalResetSecret;
        });

        it('should deterministically hash reset tokens with SHA-256', () => {
            const rawToken = 'my-raw-reset-token-12345';
            const hash1 = hashResetToken(rawToken);
            const hash2 = hashResetToken(rawToken);

            expect(hash1).toBe(hash2);
            expect(hash1).not.toBe(rawToken);
            expect(hash1).toHaveLength(64); // SHA-256 hex digest
        });

        it('should validate server secret against INVITATION_CODE or ADMIN_RESET_SECRET', () => {
            process.env.INVITATION_CODE = 'my-server-secret';
            delete process.env.ADMIN_RESET_SECRET;

            expect(verifyServerSecret('my-server-secret')).toEqual({ configured: true, valid: true });
            expect(verifyServerSecret('wrong-secret')).toEqual({ configured: true, valid: false });
        });

        it('should prioritize ADMIN_RESET_SECRET when set', () => {
            process.env.INVITATION_CODE = 'invite-secret';
            process.env.ADMIN_RESET_SECRET = 'dedicated-reset-secret';

            expect(verifyServerSecret('dedicated-reset-secret')).toEqual({ configured: true, valid: true });
            expect(verifyServerSecret('invite-secret')).toEqual({ configured: true, valid: false });
        });
    });
});
