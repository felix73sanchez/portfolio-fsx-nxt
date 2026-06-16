import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import { ensureDbReady } from '@/lib/db/ensure';
import {
  getSiteConfig,
  getAllExperiences,
  getSkillsByCategory,
  getAllEducation,
} from '@/lib/db/site';
import { SITE_URL } from '@/lib/site-url';

// Re-render at most once per minute so admin edits surface without a rebuild.
export const revalidate = 60;

export function generateMetadata(): Metadata {
  ensureDbReady();
  const profile = getSiteConfig();
  const description = profile.about ? profile.about.slice(0, 160) : undefined;

  return {
    title: 'Sobre mí',
    description,
    alternates: { canonical: '/sobre-mi' },
    openGraph: {
      title: 'Sobre mí',
      description,
      type: 'profile',
      url: `${SITE_URL}/sobre-mi`,
    },
  };
}

export default function SobreMiPage() {
  ensureDbReady();

  const profile = getSiteConfig();
  const experiences = getAllExperiences();
  const skills = getSkillsByCategory();
  const education = getAllEducation();

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      {/* Page header */}
      <section className="container" style={{ paddingTop: '6rem', paddingBottom: '0.5rem' }}>
        <h1 className="hero-name" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.75rem' }}>
          Sobre mí
        </h1>
        <p className="hero-role" style={{ marginBottom: 0 }}>
          <span style={{ color: 'var(--accent)' }}>{profile.title}</span>
          {profile.subtitle && (
            <>
              <span className="hero-role-sep" aria-hidden="true">/</span>
              {profile.subtitle}
            </>
          )}
        </p>
      </section>

      {/* About */}
      {profile.about && (
        <section className="section container">
          <h2 className="section-title">Quién soy</h2>
          <p style={{ color: 'var(--gray)' }} className="leading-relaxed text-lg">
            {profile.about}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="section container">
          <h2 className="section-title">Experiencia</h2>
          {experiences.map(exp => (
            <div key={exp.id} className="experience-item">
              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <span style={{ color: 'var(--accent)' }} className="text-sm font-medium">
                  {exp.startDate} – {exp.current ? 'Presente' : exp.endDate}
                </span>
              </div>
              <p style={{ color: 'var(--gray)' }} className="font-medium mb-3">
                {exp.company} • {exp.location}
              </p>
              {exp.responsibilities.length > 0 && (
                <ul style={{ color: 'var(--gray)' }} className="space-y-2 list-disc list-inside">
                  {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {Object.keys(skills).length > 0 && (
        <section className="section container">
          <h2 className="section-title">Habilidades Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skills).map(([category, skillsArr]) => (
              <div key={category} className="skill-category">
                <h4>{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillsArr.map(skill => (
                    <span key={skill} className="tech-badge">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="section container">
          <h2 className="section-title">Educación</h2>
          {education.map(edu => (
            <div key={edu.id} className="project-card mb-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{edu.degree}</h3>
                  <p style={{ color: 'var(--accent)' }} className="font-medium">{edu.institution}</p>
                  {edu.location && <p style={{ color: 'var(--gray)' }} className="text-sm">{edu.location}</p>}
                </div>
                <span style={{ color: 'var(--gray)' }} className="text-sm">
                  {edu.startYear} – {edu.current ? 'Presente' : edu.endYear}
                </span>
              </div>
              {edu.description && (
                <p style={{ color: 'var(--gray)' }} className="mt-2 text-sm">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
