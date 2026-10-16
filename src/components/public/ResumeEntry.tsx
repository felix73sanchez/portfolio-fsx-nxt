interface ResumeEntryProps {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  responsibilities: string[];
}

export default function ResumeEntry({
  title,
  company,
  location,
  startDate,
  endDate,
  current,
  responsibilities,
}: ResumeEntryProps) {
  return (
    <article className="resume-entry">
      <div>
        <div>
          <h3>{title}</h3>
          <p className="resume-entry-subtitle">{company} · {location}</p>
        </div>
        <span className="resume-entry-meta">
          {startDate} – {current ? 'Presente' : endDate}
        </span>
      </div>

      {responsibilities.length > 0 && (
        <ul className="resume-entry-list">
          {responsibilities.map((responsibility, index) => (
            <li key={`${responsibility}-${index}`}>{responsibility}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
