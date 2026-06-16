'use client';

import dynamic from 'next/dynamic';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), { ssr: false });

interface MarkdownRendererDynamicProps {
    content: string;
}

export default function MarkdownRendererDynamic({ content }: MarkdownRendererDynamicProps) {
    return <MarkdownRenderer content={content} />;
}
