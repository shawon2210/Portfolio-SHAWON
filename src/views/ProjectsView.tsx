import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ExternalLink,
  Code2,
  Rocket,
  Layers,
  Database,
  Cpu,
  Shield,
  Zap,
  Terminal,
  Server,
} from 'lucide-react';
import { TabType, Project } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { updateSectionSEO } from '../utils/seo';
import { GlassCard, Badge, Tag, MagneticButton } from '../components/primitives';

interface ProjectsViewProps {
  onNavigate: (tab: TabType) => void;
  onSelectProject: (project: Project) => void;
  onShowToast: (msg: string) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onNavigate,
  onSelectProject,
  onShowToast,
  activeCategory: propActiveCategory,
  onCategoryChange,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const activeCategory = propActiveCategory !== undefined ? propActiveCategory : internalCategory;
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategorySelect = (catId: string) => {
    setInternalCategory(catId);
    onCategoryChange?.(catId);
    updateSectionSEO('projects', catId);
  };

  const filterCategories = [
    { id: 'all', label: 'All Systems', count: PROJECTS.length },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'aiml', label: 'AI & ML' },
    { id: 'backend', label: 'Backend & Cloud' },
  ];

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesCategory =
      activeCategory === 'all' ||
      project.categories.includes(activeCategory) ||
      project.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  const flagshipProjects = filteredProjects.filter((p) => p.isFlagship);
  const specializedProjects = filteredProjects.filter((p) => !p.isFlagship);

  return (
    <div className="flex flex-col w-full pb-24 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="relative w-full pt-8 sm:pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-start gap-2"
        >
          <div className="flex items-center gap-2">
            <Badge variant="accent" pulse>
              Systems Catalog &bull; 2024&ndash;2025
            </Badge>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              Verified Production Deployments
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Engineered Systems &amp; Flagships
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            High-concurrency commerce platforms, multi-model AI pipelines, and distributed cloud services built with clean architectural boundaries.
          </p>
        </motion.div>

        {/* Filter and Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-white/[0.08]"
        >
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 ${
                    isActive
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projectActiveFilter"
                      className="absolute inset-0 bg-sky-400 rounded-full shadow-[0_0_16px_rgba(56,189,248,0.45)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{cat.label}</span>
                    {cat.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950 font-bold'
                            : 'bg-white/[0.08] text-slate-400'
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex items-center min-w-[220px]">
            <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by stack, keyword..."
              className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-[#0d1017] text-white font-mono text-xs pl-9 pr-8 py-2 rounded-full outline-none border border-white/[0.08] focus:border-sky-400/50 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-500 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Flagship Projects Section */}
      <div className="flex flex-col gap-8 mt-2">
        <AnimatePresence mode="popLayout">
          {flagshipProjects.map((project) => (
            <motion.article
              layout
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <GlassCard
                interactive
                className="overflow-hidden p-0 rounded-2xl bg-[#0d1017]/90 border border-white/[0.09] hover:border-sky-500/40 transition-all duration-300 shadow-2xl"
              >
                {/* Full-Fidelity Media Banner (No mix-blend-luminosity dimming) */}
                <div className="relative w-full h-52 sm:h-64 md:h-72 bg-slate-950 overflow-hidden">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                    />
                  )}
                  {/* Subtle directional gradient overlay for title legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-[#0d1017]/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md font-mono text-xs text-emerald-400 border border-emerald-500/30 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{project.badge}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md font-mono text-xs text-sky-400 border border-white/[0.1] shadow-md">
                      {project.versionOrEndpoint}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="font-mono text-xs text-sky-400 tracking-wider uppercase font-semibold">
                        {project.flagshipNumber}
                      </span>
                      <h2 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
                        {project.title}
                      </h2>
                    </div>

                    <span className="hidden sm:inline-block font-mono text-xs text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/[0.08] capitalize">
                      {project.category === 'fullstack'
                        ? 'Marketplace Architecture'
                        : project.category === 'aiml'
                        ? 'Multi-Model AI Infrastructure'
                        : 'Distributed System'}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 sm:p-7 flex flex-col gap-5">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {project.tagline}
                  </p>

                  {/* Architecture Telemetry Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    {project.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="font-mono text-base sm:text-lg font-bold text-sky-400">
                          {metric.value}
                        </span>
                        <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Architecture Highlights */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    {project.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <span className="text-sky-400 shrink-0 mt-0.5 font-mono text-xs">
                          &gt;
                        </span>
                        <p className="leading-snug">
                          {highlight.title && (
                            <strong className="font-semibold text-white mr-1.5">
                              {highlight.title}:
                            </strong>
                          )}
                          <span className="text-slate-300">{highlight.description}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Tags Flow */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.techStack.map((tech, tIdx) => (
                      <Tag key={tIdx} variant="glass">
                        {tech}
                      </Tag>
                    ))}
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white hover:text-sky-300 font-mono text-xs sm:text-sm font-semibold transition-all border border-white/[0.08] hover:border-sky-500/30 cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-sky-400" />
                      <span>Inspect Architecture</span>
                    </button>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-mono text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:bg-sky-300 transition-all cursor-pointer"
                        title="Open Live Deployed App"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <Rocket className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Live App</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60 relative z-10" />
                      </a>
                    )}

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all border border-white/[0.08] hover:border-white/[0.2]"
                      title="GitHub Repository"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </GlassCard>
            </motion.article>
          ))}
        </AnimatePresence>

        {/* Specialized Modules Section */}
        {specializedProjects.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Specialized Modules &amp; Microservices
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-500">
                {specializedProjects.length} Micro-Services
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {specializedProjects.map((project) => (
                  <motion.article
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                  >
                    <GlassCard
                      interactive
                      className="h-full flex flex-col justify-between p-5 rounded-xl bg-[#0d1017]/85 border border-white/[0.08] hover:border-sky-500/35 transition-all"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs text-sky-400 font-semibold">
                              {project.category === 'aiml' ? 'AI Agent' : 'MERN & Docker'}
                            </span>
                            <h4 className="text-base font-bold text-white mt-0.5">
                              {project.title}
                            </h4>
                          </div>

                          <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {project.badge}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                          {project.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.techStack.slice(0, 4).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/[0.06]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/[0.06]">
                        <button
                          onClick={() => onSelectProject(project)}
                          className="font-mono text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                        >
                          Inspect Code &rarr;
                        </button>

                        <div className="flex items-center gap-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-slate-400 hover:text-white"
                              title="Live URL"
                            >
                              Live
                            </a>
                          )}
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white"
                            title="GitHub Repo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
