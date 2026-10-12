import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TabType } from '../types';
import { WORK_EXPERIENCE, EDUCATION_LIST, CERTIFICATES } from '../data/portfolioData';
import { GlassCard, Badge, Tag } from '../components/primitives';

interface ExperienceViewProps {
  onNavigate: (tab: TabType) => void;
  onShowToast: (msg: string) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'work' | 'academy'>('all');

  const showWork = activeFilter === 'all' || activeFilter === 'work';
  const showAcademy = activeFilter === 'all' || activeFilter === 'academy';

  return (
    <div className="flex flex-col w-full pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
      {/* Editorial Header */}
      <div className="relative pt-8 sm:pt-12 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-start gap-2"
        >
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              Trajectory &amp; Credentials
            </Badge>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              Production Experience &amp; Academic Background
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Engineering Trajectory
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Professional software development, full-stack microservices apprenticeships, government ICT programs, and academic achievements.
          </p>
        </motion.div>

        {/* Filter Segment Tabs with Spring Pill
            MOBILE-FIRST P1 / audit R-04: this row was `flex items-center gap-1.5`
            with no wrap and no overflow handling, so at 320–430px the pill track
            forced documentElement.scrollWidth to 509px — a horizontal scroll on
            every phone. ProjectsView already handles the identical row with
            `overflow-x-auto no-scrollbar`; mirroring that fixes R-03/R-05.
            `min-w-0` lets the flex child actually shrink instead of forcing the
            parent wide. */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-white/[0.08] overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 min-w-0" role="tablist" aria-label="Filter milestones">
            {[
              { id: 'all', label: 'All Milestones', icon: Layers },
              { id: 'work', label: 'Work & Apprenticeships', icon: Briefcase },
              { id: 'academy', label: 'Academic & Degrees', icon: GraduationCap },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id as 'all' | 'work' | 'academy')}
                  className={`tap-pill relative shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 ${
                    isActive
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="experienceFilterTab"
                      className="absolute inset-0 bg-sky-400 rounded-full shadow-[0_0_16px_rgba(56,189,248,0.45)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 1: Work Experience Timeline */}
      {showWork && (
        <div className="flex flex-col gap-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Work &amp; Apprenticeship
              </h2>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 font-medium">
              Production Track
            </span>
          </div>

          {/* Clean Editorial Timeline (Zero garish neon glow halos) */}
          <div className="relative pl-6 sm:pl-8 flex flex-col gap-8 mt-2">
            {/* Subtle, restrained 1px timeline spine */}
            <div className="absolute left-2 sm:left-3 top-3 bottom-4 w-px bg-white/[0.12]" />

            {WORK_EXPERIENCE.map((exp, idx) => (
              <div key={exp.id} className="relative flex flex-col gap-3 group">
                {/* Node indicator: obsidian center with crisp border */}
                <div className="absolute -left-[23px] sm:-left-[27px] top-2 w-4 h-4 rounded-full bg-[#090b11] border-2 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)] z-10 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                </div>

                <GlassCard
                  interactive
                  className="p-5 sm:p-6 rounded-2xl bg-[#0d1017]/90 border border-white/[0.08] hover:border-sky-500/40 transition-all duration-300 shadow-xl"
                >
                  {/* Company & Role Header */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-sky-400" />
                        <span className="font-mono text-xs font-bold text-sky-400 tracking-wide uppercase">
                          {exp.company}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full font-medium">
                        {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        {exp.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {exp.role}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.period}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Stack Summary Pill */}
                  <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{exp.stackSummary}</span>
                    <span className="text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {exp.typeBadge}
                    </span>
                  </div>

                  {/* Verified Impact Metrics */}
                  <div className="grid grid-cols-2 gap-2.5 mt-3">
                    {exp.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                            {m.label}
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-white">
                            {m.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Role Achievements Bullet Points */}
                  <div className="flex flex-col gap-2 pt-3 mt-1">
                    {exp.achievements.map((item, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <span className="text-sky-400 font-mono text-xs shrink-0 mt-0.5">&gt;</span>
                        <p className="leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* Project Snapshot (Innofast) */}
                  {exp.previewImage && (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden mt-3 border border-white/[0.08] group-hover:border-sky-500/30 transition-all">
                      <img
                        className="w-full h-full object-cover"
                        alt="Innofast Dashboard Preview"
                        src={exp.previewImage}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                        <span className="font-mono text-xs text-sky-300 bg-slate-950/80 px-2.5 py-1 rounded backdrop-blur border border-white/[0.08]">
                          {exp.previewCaption}
                        </span>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Education & Degrees */}
      {showAcademy && (
        <div className="flex flex-col gap-6 mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Academic Degrees
              </h2>
            </div>
            <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20 font-medium">
              BSc in CSE
            </span>
          </div>

          {/* University Degree Card */}
          <GlassCard
            interactive
            className="p-5 sm:p-6 rounded-2xl bg-[#0d1017]/90 border border-white/[0.08] hover:border-violet-500/40 transition-all duration-300 shadow-xl flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-violet-400 uppercase font-semibold">
                    Bachelor of Science
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    BSc in Computer Science &amp; Engineering
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-200">
                IUBAT &mdash; International University of Business Agriculture &amp; Technology
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Jan 2022 &ndash; Feb 2026</span>
                </span>
                <span className="bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full text-sky-400 font-bold">
                  CGPA: 3.35 / 4.00
                </span>
              </div>
            </div>

            {/* Core Coursework Chips */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                Core Engineering Curricula
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Data Structures & Algorithms',
                  'System Architecture',
                  'Database Systems (RDBMS & NoSQL)',
                  'Computer Networks',
                  'Artificial Intelligence',
                ].map((course, cIdx) => (
                  <Tag key={cIdx} variant="glass">
                    {course}
                  </Tag>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Dual Perfect 5.00 HSC & SSC Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* HSC */}
            <GlassCard
              interactive
              className="p-5 rounded-xl bg-[#0d1017]/90 border border-white/[0.08] flex flex-col justify-between gap-3 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-emerald-400 uppercase font-semibold">
                    Higher Secondary Certificate
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    HSC, Science
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                  GPA 5.00
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
                <span className="text-slate-200 font-medium block truncate">
                  Khulna Public College
                </span>
                <span className="text-slate-500 block mt-0.5">
                  Jessore Board &bull; 2019&ndash;2020
                </span>
              </div>

              <span className="text-xs font-mono text-emerald-400/90 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Perfect Score Achievement
              </span>
            </GlassCard>

            {/* SSC */}
            <GlassCard
              interactive
              className="p-5 rounded-xl bg-[#0d1017]/90 border border-white/[0.08] flex flex-col justify-between gap-3 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-violet-400 uppercase font-semibold">
                    Secondary School Certificate
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    SSC, Science
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-0.5 rounded-full">
                  GPA 5.00
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
                <span className="text-slate-200 font-medium block truncate">
                  A C Laha Pilot High School
                </span>
                <span className="text-slate-500 block mt-0.5">
                  Jessore Board &bull; 2016&ndash;2017
                </span>
              </div>

              <span className="text-xs font-mono text-violet-400/90 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Perfect Score Achievement
              </span>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Section 3: Verified Industry Certifications */}
      <div className="flex flex-col gap-4 mt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Verified Certifications
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase font-medium">
            Industry Validated
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {CERTIFICATES.map((cert) => (
            <GlassCard
              key={cert.id}
              interactive
              className="p-4 sm:p-5 rounded-xl bg-[#0d1017]/85 border border-white/[0.08] hover:border-sky-500/35 transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {cert.title}
                  </h3>
                  <span className="font-mono text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded shrink-0">
                    {cert.duration}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
                  {cert.issuer}
                </p>
                <span className="font-mono text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  <span>{cert.completedDate}</span>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
