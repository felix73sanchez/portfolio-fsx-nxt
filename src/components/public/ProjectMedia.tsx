interface ProjectMediaProps {
  title: string;
  coverImage: string | null;
  technologies: string[];
}

export default function ProjectMedia({ title, coverImage, technologies }: ProjectMediaProps) {
  if (coverImage) {
    return (
      <div className="project-media">
        <img src={coverImage} alt={`Vista previa de ${title}`} className="project-media-img" />
      </div>
    );
  }

  return (
    <div className="project-media" aria-label={`Resumen visual del proyecto ${title}`}>
      <div className="project-media-fallback">
        <span className="project-artifact-kicker">Proyecto / {technologies[0] ?? 'Software'}</span>
        <strong className="project-artifact-title">{title}</strong>
        <span className="project-artifact-tech">
          {technologies.slice(0, 3).join(' · ') || 'Arquitectura y producto'}
        </span>
      </div>
    </div>
  );
}
