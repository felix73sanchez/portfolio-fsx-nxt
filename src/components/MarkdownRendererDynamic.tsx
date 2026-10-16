import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownRendererDynamicProps {
    content: string;
}

export default function MarkdownRendererDynamic({ content }: MarkdownRendererDynamicProps) {
    return <MarkdownRenderer content={content} />;
}
