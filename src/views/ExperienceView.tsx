import React, { useState } from 'react';
import { TabType } from '../types';
import { WORK_EXPERIENCE, EDUCATION_LIST, CERTIFICATES } from '../data/portfolioData';
import { AppIcon } from '../components/AppIcon';

interface ExperienceViewProps {
  onNavigate: (tab: TabType) => void;
  onShowToast: (msg: string) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'work' | 'academy'>('all');

  const showWork = activeFilter === 'all' || activeFilter === 'work';
  const showAcademy = activeFilter === 'all' || activeFilter === 'academy';

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto">
      {/* Interactive Ambient Header Aura */}
      <div className="relative px-4 sm:px-6 pt-4 pb-2 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-container-high text-primary border border-white/5">
            <AppIcon name="timeline" className="w-[15px] h-[15px]" />
          </span>
          <span className="font-status-label text-[10px] sm:text-[11px] text-primary uppercase tracking-wider font-semibold">
            Career Telemetry &amp; Degrees
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Experience &amp; Education
        </h1>
        <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
          Professional software engineering trajectory, technical internships, national ICT training, and academic background.
        </p>

        {/* Top Telemetry Micro-Stats Bento */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between shadow-sm border border-white/5">
            <span className="font-code-sm text-[11px] text-on-surface-variant">Lighthouse</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-secondary">91</span>
              <span className="font-code-sm text-xs text-secondary font-semibold">/100</span>
            </div>
            <span className="font-status-label text-[10px] text-secondary mt-0.5 font-semibold">+27 boost</span>
          </div>
          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between shadow-sm border border-white/5">
            <span className="font-code-sm text-[11px] text-on-surface-variant">API Latency</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-primary">-30%</span>
            </div>
            <span className="font-status-label text-[10px] text-primary mt-0.5 font-semibold">Speed index</span>
          </div>
          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between shadow-sm border border-white/5">
            <span className="font-code-sm text-[11px] text-on-surface-variant">Academic</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-tertiary">5.00</span>
            </div>
            <span className="font-status-label text-[10px] text-tertiary mt-0.5 font-semibold">Dual 100% GPA</span>
          </div>
        </div>
      </div>

      {/* Interactive Segment Tabs */}
      <div className="px-4 sm:px-6 my-4">
        <div className="bg-surface-container-lowest p-1 rounded-xl flex items-center gap-1 shadow-inner border border-white/5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-2 px-3 rounded-lg font-code-sm text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-surface-container-high text-primary shadow-sm border border-white/5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <AppIcon name="hub" className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveFilter('work')}
            className={`flex-1 py-2 px-3 rounded-lg font-code-sm text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeFilter === 'work'
                ? 'bg-surface-container-high text-primary shadow-sm border border-white/5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <AppIcon name="terminal" className="w-4 h-4" />
            <span>Work</span>
          </button>
          <button
            onClick={() => setActiveFilter('academy')}
            className={`flex-1 py-2 px-3 rounded-lg font-code-sm text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeFilter === 'academy'
                ? 'bg-surface-container-high text-primary shadow-sm border border-white/5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <AppIcon name="school" className="w-4 h-4" />
            <span>Academy</span>
          </button>
        </div>
      </div>

      {/* Section 1: Professional Experience */}
      {showWork && (
        <div className="px-4 sm:px-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
                Work &amp; Apprenticeship
              </h2>
            </div>
            <span className="font-code-sm text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
              Production Track
            </span>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative pl-6 flex flex-col gap-6 mt-1">
            {/* Glow timeline trace line */}
            <div className="absolute left-2.5 top-3 bottom-4 w-0.5 bg-gradient-to-b from-primary via-secondary to-tertiary opacity-40"></div>

            {/* Experience Items */}
            {WORK_EXPERIENCE.map((exp, idx) => (
              <div key={exp.id} className="relative flex flex-col gap-3 group">
                {/* Node indicator */}
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-surface flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      idx === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-secondary ring-4 ring-secondary/20'
                    }`}
                  ></div>
                </div>

                <div className="bg-surface-container rounded-2xl p-4 shadow-md flex flex-col gap-3 border border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-code-sm text-xs font-bold ${exp.badgeColor === 'text-secondary' ? 'text-primary' : 'text-secondary'}`}>
                        {exp.company}
                      </span>
                      <span className="inline-flex items-center gap-1 font-status-label text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-semibold">
                        {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                        {exp.badge}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-semibold leading-tight">
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span className="font-code-sm text-xs text-on-surface-variant flex items-center gap-1">
                        <AppIcon name="calendar_month" className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </span>
                      <span className="font-code-sm text-xs text-on-surface-variant flex items-center gap-1">
                        <AppIcon name="pin_drop" className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Stack Summary Banner */}
                  <div className="bg-surface-container-high rounded-xl px-3 py-2 flex items-center justify-between text-on-surface border border-white/5">
                    <span className="font-body-sm text-xs font-medium">{exp.stackSummary}</span>
                    <span className="font-code-sm text-xs text-secondary bg-surface-container px-2 py-0.5 rounded">
                      {exp.typeBadge}
                    </span>
                  </div>

                  {/* Highlight Metric Badges */}
                  <div className="grid grid-cols-2 gap-2">
                    {exp.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-surface-container-low rounded-xl p-2.5 flex items-center gap-2.5 border border-white/5"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            m.color === 'text-secondary' ? 'bg-secondary/15 text-secondary' : 'bg-primary/15 text-primary'
                          }`}
                        >
                          <AppIcon name={m.icon} className="w-[18px] h-[18px]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-status-label text-[9px] text-on-surface-variant uppercase tracking-wider">
                            {m.label}
                          </span>
                          <span className={`font-code-md text-xs sm:text-sm font-bold ${m.color}`}>
                            {m.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bullet Points */}
                  <div className="flex flex-col gap-2 pt-1">
                    {exp.achievements.map((item, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2.5">
                        <AppIcon name="check_circle" className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Visual Project Snapshot (Innofast) */}
                  {exp.previewImage && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden mt-1 shadow-sm border border-white/5 group-hover:border-primary/20">
                      <img
                        className="w-full h-full object-cover"
                        alt="Innofast Dashboard UI"
                        src={exp.previewImage}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent flex items-end p-2.5">
                        <span className="font-code-sm text-[11px] text-primary-fixed bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur">
                          {exp.previewCaption}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Education Cards */}
      {showAcademy && (
        <div className="px-4 sm:px-6 flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
                Academic Credentials
              </h2>
            </div>
            <span className="font-code-sm text-xs text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-full font-medium">
              BSc in CSE
            </span>
          </div>

          {/* Education Card 1: University */}
          <div className="bg-surface-container rounded-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden border border-white/5">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 shadow-sm border border-white/5">
                  <AppIcon name="account_balance" className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-status-label text-[10px] text-primary uppercase font-bold tracking-wider">
                    Bachelor Degree
                  </span>
                  <h3 className="font-body-lg text-sm sm:text-base text-on-surface font-bold leading-snug">
                    BSc in Computer Science &amp; Engineering
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="font-body-sm text-xs sm:text-sm text-on-surface font-semibold">
                  IUBAT — International University of Business Agriculture &amp; Technology
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="font-code-sm text-xs text-on-surface-variant flex items-center gap-1">
                  <AppIcon name="calendar_today" className="w-3.5 h-3.5" />
                  <span>Jan 2022 – Feb 2026</span>
                </span>
                <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-0.5 rounded-full border border-white/5">
                  <span className="font-status-label text-[10px] text-on-surface-variant">CGPA</span>
                  <span className="font-code-sm text-xs text-primary font-bold">3.35 / 4.00</span>
                </div>
              </div>
            </div>

            {/* Core Coursework Chips */}
            <div className="flex flex-col gap-1.5">
              <span className="font-status-label text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Core Engineering Curricula
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Data Structures & Algorithms',
                  'Software Engineering',
                  'Database Management',
                  'Computer Networks',
                  'Artificial Intelligence',
                ].map((course, cIdx) => (
                  <span
                    key={cIdx}
                    className="font-code-sm text-xs px-2.5 py-1 rounded bg-surface-container-high text-on-surface border border-white/5"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Double Perfect 5.00 HSC & SSC Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* HSC */}
            <div className="bg-surface-container rounded-2xl p-4 shadow-md flex flex-col justify-between gap-3 relative border border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                    <AppIcon name="verified_user" className="w-[18px] h-[18px]" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-status-label text-[10px] text-secondary uppercase font-bold">
                      Higher Secondary
                    </span>
                    <h4 className="font-body-md text-xs sm:text-sm text-on-surface font-bold">
                      HSC, Science
                    </h4>
                  </div>
                </div>
                <span className="font-code-sm text-xs text-secondary bg-secondary/15 px-2 py-0.5 rounded-full font-bold">
                  GPA 5.00
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low p-2.5 rounded-xl border border-white/5">
                <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                  Khulna Public College
                </span>
                <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-[11px] mt-0.5">
                  <span>Jessore Board</span>
                  <span>2019 – 2020</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-secondary font-code-sm text-xs font-medium">
                <AppIcon name="star" className="w-3.5 h-3.5" /> Perfect Score Achiever
              </div>
            </div>

            {/* SSC */}
            <div className="bg-surface-container rounded-2xl p-4 shadow-md flex flex-col justify-between gap-3 relative border border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
                    <AppIcon name="military_tech" className="w-[18px] h-[18px]" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-status-label text-[10px] text-tertiary uppercase font-bold">
                      Secondary School
                    </span>
                    <h4 className="font-body-md text-xs sm:text-sm text-on-surface font-bold">
                      SSC, Science
                    </h4>
                  </div>
                </div>
                <span className="font-code-sm text-xs text-tertiary bg-tertiary/15 px-2 py-0.5 rounded-full font-bold">
                  GPA 5.00
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low p-2.5 rounded-xl border border-white/5">
                <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                  A C Laha Pilot High School
                </span>
                <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-[11px] mt-0.5">
                  <span>Jessore Board</span>
                  <span>2016 – 2017</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-tertiary font-code-sm text-xs font-medium">
                <AppIcon name="star" className="w-3.5 h-3.5" /> Perfect Score Achiever
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Verified Technical Certifications */}
      <div className="px-4 sm:px-6 flex flex-col gap-3 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppIcon name="workspace_premium" className="w-5 h-5 text-primary" />
            <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
              Verified Certificates
            </h2>
          </div>
          <span className="font-status-label text-[10px] text-on-surface-variant uppercase font-semibold">
            Industry Validated
          </span>
        </div>

        {CERTIFICATES.map((cert) => (
          <div
            key={cert.id}
            className="bg-surface-container rounded-2xl p-4 shadow-md flex items-center gap-3.5 border border-white/5 hover:border-primary/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shrink-0 shadow-inner border border-white/5">
              <AppIcon name={cert.icon} className="w-6 h-6" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-body-md text-xs sm:text-sm text-on-surface font-bold truncate">
                  {cert.title}
                </h4>
                <span className="font-code-sm text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded shrink-0">
                  {cert.duration}
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant truncate mt-0.5">
                {cert.issuer}
              </p>
              <span className="font-code-sm text-xs text-primary mt-1 flex items-center gap-1">
                <AppIcon name="event_available" className="w-3.5 h-3.5" />
                <span>{cert.completedDate}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
