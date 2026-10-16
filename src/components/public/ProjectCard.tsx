import type { Project } from '@/types';
import ProjectLinks from './ProjectLinks';
import ProjectMedia from './ProjectMedia';

interface ProjectCardProps {
  project: Project;
  showLinks?: boolean;
  titleAs?: 'h2' | 'h3';
}

export default function ProjectCard({ project, showLinks = true, titleAs = 'h2' }: ProjectCardProps) {
  const Title = titleAs;

  return (
    <article className="project-card">
      <ProjectMedia
        title={project.title}
        coverImage={project.coverImage}
        technologies={project.technologies}
      />
      <Title className="project-title">{project.title}</Title>
      <p className="project-description">{project.description}</p>

      {project.technologies.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span key={technology} className="tech-badge">{technology}</span>
          ))}
        </div>
      )}

      {showLinks && <ProjectLinks links={project.links} />}
    </article>
  );
}
