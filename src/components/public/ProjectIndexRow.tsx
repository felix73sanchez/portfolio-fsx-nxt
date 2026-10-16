import type { Project } from '@/types';

interface ProjectIndexRowProps {
  project: Project;
  index: number;
}

function formatIndex(index: number) {
  return String(index).padStart(2, '0');
}

export default function ProjectIndexRow({ project, index }: ProjectIndexRowProps) {
  return (
    <article className="public-project-row group">
      <span className="public-row-index font-mono">{formatIndex(index)}</span>
      <div className="public-row-main">
        <div className="public-row-heading">
          <h3>{project.title}</h3>
          <span className="public-row-arrow" aria-hidden="true">↗</span>
        </div>
        <p className="public-row-description">{project.description}</p>
        {project.technologies.length > 0 && (
          <p className="public-row-tech font-mono">{project.technologies.join(' · ')}</p>
        )}
        {project.links.length > 0 && (
          <div className="public-row-links">
            {project.links.map((link, linkIndex) => (
              <a
                key={`${link.url}-${linkIndex}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="public-row-link"
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
