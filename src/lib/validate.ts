/** Lightweight input validation helper */

export function isString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

export function isOptionalString(value: unknown): value is (string | undefined | null) {
    return value === undefined || value === null || typeof value === 'string';
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

export function isOptionalBoolean(value: unknown): value is boolean | undefined {
    return value === undefined || typeof value === 'boolean';
}

export function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(v => typeof v === 'string');
}

export function isOptionalStringArray(value: unknown): value is string[] | undefined {
    return value === undefined || isStringArray(value);
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
}

export interface ValidationError {
    field: string;
    message: string;
}

export function validateRequiredString(body: Record<string, unknown>, field: string): ValidationError | null {
    const value = body[field];
    if (!isString(value)) {
        return { field, message: `${field} es requerido y debe ser un texto` };
    }
    return null;
}

export function validateOptionalString(body: Record<string, unknown>, field: string): ValidationError | null {
    if (field in body && !isOptionalString(body[field])) {
        return { field, message: `${field} debe ser un texto` };
    }
    return null;
}

export function validateOptionalBoolean(body: Record<string, unknown>, field: string): ValidationError | null {
    if (field in body && !isOptionalBoolean(body[field])) {
        return { field, message: `${field} debe ser un valor booleano` };
    }
    return null;
}

export function validateOptionalStringArray(body: Record<string, unknown>, field: string): ValidationError | null {
    if (field in body && !isOptionalStringArray(body[field])) {
        return { field, message: `${field} debe ser una lista de textos` };
    }
    return null;
}

/** Returns 400 Response with first validation error, or null if valid */
export function validateOrError(body: Record<string, unknown>, validators: ((body: Record<string, unknown>) => ValidationError | null)[]): { error: string; field: string } | null {
    for (const validator of validators) {
        const err = validator(body);
        if (err) {
            return { error: err.message, field: err.field };
        }
    }
    return null;
}
