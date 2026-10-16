import type { Metadata } from 'next';
import { Footer, Header } from '@/components';
import { EducationEntry, PublicSectionLabel, ResumeEntry, SkillGroup } from '@/components/public';
import { ensureDbReady } from '@/lib/db/ensure';
import { getAllEducation, getAllExperiences, getSiteConfig, getSkillsByCategory } from '@/lib/db/site';
import { SITE_URL } from '@/lib/site-url';

export const revalidate = 60;

export function generateMetadata(): Metadata {
  ensureDbReady();
  const profile = getSiteConfig();
  return {
    title: 'Sobre mí',
    description: profile.about ? profile.about.slice(0, 160) : undefined,
    alternates: { canonical: '/sobre-mi' },
    openGraph: { title: 'Sobre mí', description: profile.about?.slice(0, 160), type: 'profile', url: `${SITE_URL}/sobre-mi` },
  };
}

export default function SobreMiPage() {
  ensureDbReady();
  const profile = getSiteConfig();
  const experiences = getAllExperiences();
  const skills = getSkillsByCategory();
  const education = getAllEducation();
  const aboutParagraphs = profile.about.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="public-page">
      <Header github={profile.github} linkedin={profile.linkedin} phone={profile.phone} />
      <div className="public-right-header font-mono">02 / perfil · trayectoria técnica</div>
      <div className="public-content">
        <section className="public-section-grid public-about-page-header">
          <PublicSectionLabel index="02 /">Perfil</PublicSectionLabel>
          <div className="public-page-intro">
            <p className="public-kicker font-mono">Perfil profesional</p>
            <h1>Sobre mí</h1>
            <p><span className="public-intro-accent">{profile.title}</span>{profile.subtitle && <> <span className="public-intro-divider">/</span> {profile.subtitle}</>}</p>
          </div>
        </section>

        {profile.about && (
          <section className="public-section-grid public-about-page-section">
            <PublicSectionLabel index="01 /">Quién soy</PublicSectionLabel>
            <div className="public-about-page-content">
              <h2>Una forma de construir sistemas</h2>
              <p className="public-about-lead">{aboutParagraphs[0]}</p>
              {aboutParagraphs.slice(1).map((paragraph, index) => <p key={index} className="public-about-secondary">{paragraph}</p>)}
            </div>
          </section>
        )}

        {experiences.length > 0 && (
          <section className="public-section-grid public-about-page-section">
            <PublicSectionLabel index="02 /">Trayectoria</PublicSectionLabel>
            <div className="public-section-main">
              <h2 className="public-subsection-title">Experiencia</h2>
              <div className="public-resume-list">
                {experiences.map((experience) => <ResumeEntry key={experience.id} {...experience} />)}
              </div>
            </div>
          </section>
        )}

        {Object.keys(skills).length > 0 && (
          <section className="public-section-grid public-about-page-section">
            <PublicSectionLabel index="03 /">Herramientas</PublicSectionLabel>
            <div className="public-section-main">
              <h2 className="public-subsection-title">Habilidades técnicas</h2>
              <div className="public-skills-list">
                {Object.entries(skills).map(([category, skillsArr]) => <SkillGroup key={category} category={category} skills={skillsArr} />)}
              </div>
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="public-section-grid public-about-page-section">
            <PublicSectionLabel index="04 /">Formación</PublicSectionLabel>
            <div className="public-section-main">
              <h2 className="public-subsection-title">Educación</h2>
              <div className="public-education-list">
                {education.map((entry) => <EducationEntry key={entry.id} {...entry} />)}
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer github={profile.github} linkedin={profile.linkedin} email={profile.email} />
    </main>
  );
}
