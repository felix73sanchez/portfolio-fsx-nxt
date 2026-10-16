import type { ReactNode } from 'react';

interface PublicSectionLabelProps {
  index: string;
  children: ReactNode;
}

export default function PublicSectionLabel({ index, children }: PublicSectionLabelProps) {
  return (
    <p className="public-section-label font-mono">
      <span className="public-index">{index}</span>
      <span>{children}</span>
    </p>
  );
}
