/**
 * Utility Functions Tests
 * Tests for helper functions and utilities
 */

import { slugify } from '@/lib/db/blog';

describe('Utility Functions', () => {
    describe('Date Formatting', () => {
        it('should create valid Date objects', () => {
            const date = new Date('2025-01-15T12:00:00Z');
            expect(date.getUTCFullYear()).toBe(2025);
            expect(date.getUTCMonth()).toBe(0); // January is 0
            expect(date.getUTCDate()).toBe(15);
        });

        it('should convert dates to ISO string', () => {
            const date = new Date('2025-01-15T12:00:00Z');
            expect(date.toISOString()).toContain('2025-01-15');
        });
    });

    describe('Slug Generation', () => {
        it('should convert title to slug', () => {
            expect(slugify('Hello World')).toBe('hello-world');
        });

        it('should handle special characters', () => {
            expect(slugify('Café con Leche')).toBe('cafe-con-leche');
        });

        it('should handle multiple spaces', () => {
            expect(slugify('Hello   World')).toBe('hello-world');
        });

        it('should handle accented characters and ñ', () => {
            expect(slugify('Programación y Diseño en Español')).toBe('programacion-y-diseno-en-espanol');
        });

        it('should fallback to articulo when title has only special characters', () => {
            expect(slugify('??? !!!')).toBe('articulo');
        });
    });

    describe('Email Validation', () => {
        const isValidEmail = (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        it('should validate correct emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.org')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(isValidEmail('not-an-email')).toBe(false);
            expect(isValidEmail('@nodomain.com')).toBe(false);
            expect(isValidEmail('no@domain')).toBe(false);
        });
    });

    describe('Password Strength', () => {
        const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
            if (password.length < 6) return 'weak';
            if (password.length < 10) return 'medium';
            if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
                return 'strong';
            }
            return 'medium';
        };

        it('should identify weak passwords', () => {
            expect(getPasswordStrength('123')).toBe('weak');
            expect(getPasswordStrength('abc')).toBe('weak');
        });

        it('should identify medium passwords', () => {
            expect(getPasswordStrength('password')).toBe('medium');
        });

        it('should identify strong passwords', () => {
            expect(getPasswordStrength('Password123')).toBe('strong');
        });
    });
});
