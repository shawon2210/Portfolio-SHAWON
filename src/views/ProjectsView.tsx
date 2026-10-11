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
import { StickyStack, StickyStackItem, PillButton, GhostButton, GradientHeading } from '../components/motion';

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
    <div className="flex flex-col w-full pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
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
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer pressable focus-ring ${
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

      {/* =========================================================================
          PATTERN 7: STICKY STACKING PROJECT CARDS
          Each card sticky inside container, scaling down as later cards stack over it
          targetScale = 1 - (total - 1 - index) * 0.03, top offset index * 28px
          40/60 two-column image grid
      ========================================================================= */}
      <div className="mt-6 mb-16">
        <StickyStack>
          {flagshipProjects.map((project, idx) => (
            <StickyStackItem
              key={project.id}
              index={idx}
              total={flagshipProjects.length}
              topOffset={28}
            >
              <div className="w-full rounded-[36px] sm:rounded-[48px] overflow-hidden bg-[#0e121b] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group" data-cursor="project">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[500px]">
                  {/* Left Column (40%): Editorial Context, Highlights & Actions */}
                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between gap-6 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/10 bg-slate-950/60">
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-widest">
                          {project.flagshipNumber}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 font-mono text-[11px] text-emerald-400 border border-emerald-500/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{project.badge}</span>
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                        {project.title}
                      </h2>

                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                        {project.tagline}
                      </p>

                      {/* Architecture Telemetry Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                        {project.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="flex flex-col">
                            <span className="font-mono text-base sm:text-lg font-bold text-sky-400">
                              {metric.value}
                            </span>
                            <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div className="space-y-2 pt-1 hidden sm:block">
                        {project.highlights.slice(0, 2).map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-sky-400 shrink-0 mt-0.5 font-mono text-xs">&gt;</span>
                            <p className="leading-snug">
                              {highlight.title && (
                                <strong className="font-semibold text-white mr-1">
                                  {highlight.title}:
                                </strong>
                              )}
                              <span>{highlight.description}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-mono text-xs font-semibold border border-white/10 cursor-pointer pressable focus-ring"
                      >
                        <Code2 className="w-4 h-4 text-sky-400" />
                        <span>Inspect Architecture</span>
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-mono text-xs font-bold shadow-md cursor-pointer pressable focus-ring"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          <span>Live App</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition-all pressable focus-ring"
                        title="GitHub Repo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column (60%): High-Impact Project Screenshot */}
                  <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[360px] lg:min-h-full bg-slate-950 overflow-hidden order-1 lg:order-2">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        decoding="async"
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-slate-500">
                        TODO(asset)
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                    <div className="absolute top-4 right-4 hidden lg:block">
                      <span className="font-mono text-xs text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        {project.versionOrEndpoint}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </StickyStackItem>
          ))}
        </StickyStack>
      </div>
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
                            <h3 className="text-base font-bold text-white mt-0.5">
                              {project.title}
                            </h3>
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
                          className="font-mono text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer pressable focus-ring"
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
  );
};
