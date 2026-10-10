import React from 'react';
import { PERSONAL_INFO, PROJECTS, WORK_EXPERIENCE, EDUCATION_LIST, CERTIFICATES } from '../data/portfolioData';

export const PrintablePortfolio: React.FC = () => {
  return (
    <div id="printable-portfolio" className="print-only">
      {/* Print Document Header */}
      <header className="print-header">
        <div>
          <h1 className="print-name">{PERSONAL_INFO.name}</h1>
          <p className="print-title">{PERSONAL_INFO.title}</p>
          <div className="print-meta-row">
            <span>{PERSONAL_INFO.location}</span>
            <span>&bull;</span>
            <span>{PERSONAL_INFO.email}</span>
            <span>&bull;</span>
            <span>{PERSONAL_INFO.phone}</span>
          </div>
          <div className="print-meta-row">
            <span>github.com/shawon2210</span>
            <span>&bull;</span>
            <span>linkedin.com/in/md-shawon-molla-2a3877293</span>
            <span>&bull;</span>
            <span>oddboundary.lovable.app</span>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="print-section">
        <h2 className="print-section-title">Professional Blueprint</h2>
        <p className="print-summary">{PERSONAL_INFO.bio}</p>
      </section>

      {/* Engineered Projects Catalog */}
      <section className="print-section">
        <h2 className="print-section-title">Engineered Projects (Production &amp; Flagship)</h2>
        <div className="print-projects-grid">
          {PROJECTS.map((project) => (
            <div key={project.id} className="print-card">
              <div className="print-card-header">
                <div>
                  <span className="print-card-badge">{project.flagshipNumber || 'Specialized Module'}</span>
                  <h3 className="print-card-title">{project.title}</h3>
                </div>
                <span className="print-card-status">{project.badge} &bull; {project.versionOrEndpoint}</span>
              </div>
              <p className="print-card-tagline">{project.tagline}</p>
              
              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="print-metrics-row">
                  {project.metrics.map((m, idx) => (
                    <span key={idx} className="print-metric-chip">
                      <strong>{m.value}</strong> {m.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Highlights */}
              <ul className="print-bullet-list">
                {project.highlights.map((h, idx) => (
                  <li key={idx}>
                    {h.title ? <strong>{h.title}: </strong> : null}
                    {h.description}
                  </li>
                ))}
              </ul>

              {/* Stack */}
              <div className="print-stack-row">
                <span className="print-stack-label">Stack:</span>
                <span>{project.techStack.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work & Apprenticeship */}
      <section className="print-section page-break-before">
        <h2 className="print-section-title">Work &amp; Apprenticeship</h2>
        <div className="print-experience-list">
          {WORK_EXPERIENCE.map((exp) => (
            <div key={exp.id} className="print-card">
              <div className="print-card-header">
                <div>
                  <h3 className="print-card-title">{exp.role}</h3>
                  <span className="print-company">{exp.company} &bull; {exp.location}</span>
                </div>
                <span className="print-period">{exp.period}</span>
              </div>
              <p className="print-card-tagline">{exp.stackSummary}</p>
              
              <ul className="print-bullet-list">
                {exp.achievements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Credentials */}
      <section className="print-section">
        <h2 className="print-section-title">Academic Credentials</h2>
        <div className="print-education-grid">
          {EDUCATION_LIST.map((edu) => (
            <div key={edu.id} className="print-edu-item">
              <div className="print-card-header">
                <div>
                  <h4 className="print-edu-title">{edu.degree}</h4>
                  <p className="print-edu-inst">{edu.institution} {edu.boardOrDetails ? `(${edu.boardOrDetails})` : ''}</p>
                </div>
                <div className="print-edu-grade">
                  <span>{edu.gradeLabel}: {edu.gradeValue}</span>
                  <span className="print-period">{edu.period}</span>
                </div>
              </div>
              {edu.curricula && (
                <p className="print-curricula">Curricula: {edu.curricula.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Verified Certifications */}
      <section className="print-section">
        <h2 className="print-section-title">Verified Certifications</h2>
        <div className="print-certs-row">
          {CERTIFICATES.map((cert) => (
            <div key={cert.id} className="print-cert-item">
              <strong>{cert.title}</strong> &bull; {cert.issuer} ({cert.duration}, {cert.completedDate})
            </div>
          ))}
        </div>
      </section>

      <footer className="print-doc-footer">
        <span>Portfolio dossier generated from Shawon.dev</span>
        <span>Verified by MD Shawon Molla</span>
      </footer>
    </div>
  );
};
