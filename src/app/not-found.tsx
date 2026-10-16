import Link from 'next/link';
import type { Metadata } from 'next';
import { Footer, Header } from '@/components';

export const metadata: Metadata = { title: 'Página no encontrada' };

export default function NotFound() {
  return (
    <main className="public-page">
      <Header />
      <div className="public-right-header font-mono">HTTP / 404 · recurso no encontrado</div>
      <div className="public-content public-not-found">
        <div className="public-section-grid">
          <p className="public-section-label font-mono"><span className="public-index">404 /</span><span>Recovery</span></p>
          <div className="public-not-found-copy">
            <div className="public-not-found-number" aria-hidden="true">404</div>
            <h1>Página no encontrada</h1>
            <p>La página que buscas no existe o fue movida. Revisá la URL o volvé al inicio.</p>
            <Link href="/" className="public-not-found-link">&gt; Volver al inicio <span aria-hidden="true">█</span></Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
