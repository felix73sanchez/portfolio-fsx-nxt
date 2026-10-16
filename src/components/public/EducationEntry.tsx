interface EducationEntryProps {
  degree: string;
  institution: string;
  location?: string;
  startYear: number;
  endYear: number | null;
  current: boolean;
  description?: string | null;
}

export default function EducationEntry({
  degree,
  institution,
  location,
  startYear,
  endYear,
  current,
  description,
}: EducationEntryProps) {
  return (
    <article className="education-entry">
      <div>
        <h3>{degree}</h3>
        <p className="education-entry-institution">{institution}</p>
        {location && <p className="education-entry-location">{location}</p>}
        {description && <p className="education-entry-description">{description}</p>}
      </div>
      <span className="education-entry-year">
        {startYear} – {current ? 'Presente' : endYear}
      </span>
    </article>
  );
}
