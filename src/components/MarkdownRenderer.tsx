'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <article className="prose-custom">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings - clean, no borders
                    h1: ({ children }) => (
                        <h1 className="text-2xl md:text-3xl font-bold mt-12 mb-5" style={{ color: 'var(--fg)' }}>
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-xl md:text-2xl font-bold mt-12 mb-5" style={{ color: 'var(--fg)' }}>
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-lg md:text-xl font-semibold mt-10 mb-4" style={{ color: 'var(--fg)' }}>
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-base md:text-lg font-semibold mt-8 mb-3" style={{ color: 'var(--fg)' }}>
                            {children}
                        </h4>
                    ),

                    // Paragraphs
                    p: ({ children }) => (
                        <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: 'var(--gray)', lineHeight: '1.75' }}>
                            {children}
                        </p>
                    ),

                    // Unordered Lists
                    ul: ({ children }) => (
                        <ul className="my-6 space-y-3 pl-6" style={{ listStyleType: 'disc' }}>
                            {children}
                        </ul>
                    ),

                    // Ordered Lists
                    ol: ({ children }) => (
                        <ol className="my-6 space-y-3 pl-6" style={{ listStyleType: 'decimal' }}>
                            {children}
                        </ol>
                    ),

                    // List items
                    li: ({ children }) => (
                        <li className="text-base md:text-lg leading-relaxed pl-2" style={{ color: 'var(--gray)' }}>
                            {children}
                        </li>
                    ),

                    // Code inline
                    code: ({ className, children, ...props }) => {
                        const isInline = !className;

                        if (isInline) {
                            return (
                                <code
                                    className="px-1.5 py-0.5 rounded text-sm font-mono"
                                    style={{
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: 'var(--accent)'
                                    }}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code className="block" style={{ color: '#d4d4d8' }} {...props}>
                                {children}
                            </code>
                        );
                    },

                    // Code blocks
                    pre: ({ children }) => (
                        <pre
                            className="my-8 p-5 rounded-lg overflow-x-auto font-mono text-sm"
                            style={{
                                background: '#18181b',
                                border: 'none'
                            }}
                        >
                            {children}
                        </pre>
                    ),

                    // Blockquotes
                    blockquote: ({ children }) => (
                        <blockquote
                            className="my-8 pl-5 py-1 italic"
                            style={{
                                borderLeft: '3px solid var(--accent)',
                                color: 'var(--gray)'
                            }}
                        >
                            {children}
                        </blockquote>
                    ),

                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:opacity-80 transition"
                            style={{ color: 'var(--accent)' }}
                        >
                            {children}
                        </a>
                    ),

                    // Bold
                    strong: ({ children }) => (
                        <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>
                            {children}
                        </strong>
                    ),

                    // Italic
                    em: ({ children }) => (
                        <em style={{ color: 'var(--gray)' }}>
                            {children}
                        </em>
                    ),

                    // Horizontal rule
                    hr: () => (
                        <hr className="my-10 border-0 h-px" style={{ background: 'var(--border)' }} />
                    ),

                    // Images
                    img: ({ src, alt }) => (
                        <figure className="my-8">
                            <img
                                src={src}
                                alt={alt || ''}
                                className="rounded-lg w-full"
                                loading="lazy"
                            />
                            {alt && (
                                <figcaption className="text-center text-sm mt-3 italic" style={{ color: 'var(--gray)' }}>
                                    {alt}
                                </figcaption>
                            )}
                        </figure>
                    ),

                    // Tables
                    table: ({ children }) => (
                        <div className="my-8 overflow-x-auto">
                            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead style={{ borderBottom: '2px solid var(--border)' }}>
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--fg)' }}>
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)', color: 'var(--gray)' }}>
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
