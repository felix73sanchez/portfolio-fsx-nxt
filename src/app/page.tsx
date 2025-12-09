'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BlogPost } from '@/types';
import { Header, Footer } from '@/components';

interface SiteConfig {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  about: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  twitter: string;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  responsibilities: string[];
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number | null;
  current: boolean;
  description: string | null;
}

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [profile, setProfile] = useState<SiteConfig | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, profileRes, expRes, eduRes, skillsRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/site/config'),
          fetch('/api/site/experiences'),
          fetch('/api/site/education'),
          fetch('/api/site/skills')
        ]);

        if (postsRes.ok) setRecentPosts((await postsRes.json()).slice(0, 3));
        if (profileRes.ok) setProfile(await profileRes.json());
        if (expRes.ok) setExperiences(await expRes.json());
        if (eduRes.ok) setEducation(await eduRes.json());
        if (skillsRes.ok) setSkills(await skillsRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />

      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{profile?.name || 'Cargando...'}</h1>
          <p className="text-xl md:text-2xl mb-3" style={{ color: 'var(--gray)' }}>
            {profile?.title} {profile?.subtitle && `| ${profile.subtitle}`}
          </p>
          <p className="text-lg flex items-center justify-center gap-2" style={{ color: 'var(--gray)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile?.location || 'Cargando...'}
          </p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="contact-btn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {profile.email}
            </a>
          )}
          {profile?.phone && (
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`} className="contact-btn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {profile.phone}
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-btn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          )}
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-btn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          )}
          {profile?.twitter && (
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="contact-btn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X
            </a>
          )}
        </div>
      </section>

      {/* About */}
      <section className="section container">
        <h2 className="section-title">Sobre Mí</h2>
        <p style={{ color: 'var(--gray)' }} className="leading-relaxed text-lg">
          {profile?.about || 'Cargando...'}
        </p>
      </section>

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

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="section container">
          <h2 className="section-title">Últimos Artículos</h2>
          <div className="space-y-6">
            {recentPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block project-card transition hover:border-[var(--accent)]">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p style={{ color: 'var(--gray)' }} className="text-sm mb-2">{post.description}</p>
                <span style={{ color: 'var(--accent)' }} className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/blog" className="link-btn inline-flex items-center gap-2">
              Ver todos los artículos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Projects CTA */}
      <section className="section container text-center">
        <h2 className="section-title">Proyectos</h2>
        <p style={{ color: 'var(--gray)' }} className="mb-6">
          Explora mis proyectos personales y experimentos con tecnologías modernas.
        </p>
        <Link href="/proyectos" className="cta-btn inline-flex items-center gap-2">
          Ver Proyectos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </section>

      <Footer />
    </main>
  );
}
