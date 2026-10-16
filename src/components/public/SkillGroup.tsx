interface SkillGroupProps {
  category: string;
  skills: string[];
}

export default function SkillGroup({ category, skills }: SkillGroupProps) {
  return (
    <div className="skill-group">
      <h3 className="skill-group-title">{category}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="tech-badge">{skill}</span>
        ))}
      </div>
    </div>
  );
}
