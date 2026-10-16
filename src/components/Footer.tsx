import Link from 'next/link';

interface FooterProps {
    github?: string;
    linkedin?: string;
    email?: string;
}

export default function Footer({ github, linkedin, email }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="public-footer">
            <div className="public-footer-inner">
                <div className="public-footer-top">
                    <div className="public-footer-brand">
                        <Link href="/" className="logo">
                            <span className="logo-bracket">&lt;</span>
                            <span className="logo-text">FSX</span>
                            <span className="logo-bracket">/&gt;</span>
                        </Link>
                        <p>Ingeniero de software. Entusiasta del open source.</p>
                    </div>
                    <nav className="public-footer-nav" aria-label="Navegación del pie de página">
                        <Link href="/sobre-mi">Sobre mí</Link>
                        <Link href="/proyectos">Proyectos</Link>
                        <Link href="/blog">Blog</Link>
                        {email && <a href={`mailto:${email}`}>Contacto</a>}
                    </nav>
                    <div className="public-footer-nav">
                        {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
                        {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
                    </div>
                </div>
                <div className="public-footer-bottom font-mono">
                    <span>© {currentYear} Felix Sánchez. Santo Domingo, RD.</span>
                    <span>Hecho con Next.js · <a href="https://github.com/felix73sanchez/portfolio-fsx-nxt" target="_blank" rel="noopener noreferrer">Código abierto</a></span>
                </div>
            </div>
        </footer>
    );
}
