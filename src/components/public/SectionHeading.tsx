import type { ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export default function SectionHeading({ children, className = '' }: SectionHeadingProps) {
  return (
    <h2 className={`section-title ${className}`.trim()}>
      <span className="section-accent" aria-hidden="true" />
      {children}
    </h2>
  );
}
