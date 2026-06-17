import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock next/server for auth module
jest.mock('next/server', () => ({
    NextRequest: class {
        cookies = {
            get: jest.fn(() => ({ value: 'mock-token' })),
        };
    },
    NextResponse: {
        json: jest.fn((data, init) => ({
            ...init,
            json: async () => data,
        })),
    },
}));

// Mock next/headers for auth module
jest.mock('next/headers', () => ({
    cookies: jest.fn(() => ({
        get: jest.fn(() => ({ value: 'mock-token' })),
        set: jest.fn(),
        delete: jest.fn(),
    })),
}));

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
