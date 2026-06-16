import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Página no encontrada',
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
                404
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                Página no encontrada
            </h2>
            <p className="text-base md:text-lg mb-8 text-center max-w-md" style={{ color: 'var(--gray)' }}>
                La página que buscas no existe o fue movida.
                Revisá la URL o volvé al inicio.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80"
                style={{
                    background: 'var(--accent)',
                    color: 'white',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Volver al inicio
            </Link>
        </div>
    );
}
