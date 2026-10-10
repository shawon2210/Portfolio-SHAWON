import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, Project } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { updateSectionSEO, ProjectCategoryKey } from '../utils/seo';
import { AppIcon } from '../components/AppIcon';

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
    { id: 'all', label: 'All', count: PROJECTS.length },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'aiml', label: 'AI & ML' },
    { id: 'backend', label: 'Backend / SaaS' },
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

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto">
      {/* Atmospheric Top Glow */}
      <div className="relative w-full px-4 sm:px-6 pt-4">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-primary/15 via-primary-container/5 to-transparent blur-3xl pointer-events-none"></div>

        {/* Header Section */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col gap-1 z-10"
        >
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-container-high text-primary border border-white/5">
              <AppIcon name="terminal" className="w-3.5 h-3.5" />
            </span>
            <span className="font-status-label text-[10px] sm:text-[11px] text-primary tracking-wider uppercase font-semibold">
              Systems Catalog • 2024-2025
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Engineered Projects
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Production architectures, multi-tenant AI systems, and scalable full-stack applications.
          </p>
        </motion.div>

        {/* Search & Filter Toolbar */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 my-4 z-10"
        >
          {/* Filter Pills */}
          <div className="relative flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {filterCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-status-label text-xs transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary font-semibold shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-white/5'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center min-w-[200px]">
            <AppIcon
              name="search"
              className="absolute left-2.5 w-4 h-4 text-on-surface-variant pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack, title..."
              className="w-full bg-surface-container-high/70 text-on-surface font-code-sm text-xs pl-8 pr-3 py-1.5 rounded-full outline-none focus:ring-1 focus:ring-primary border border-white/5 transition-all placeholder:text-on-surface-variant/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <AppIcon name="close" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Main Projects Stream */}
      <div className="flex flex-col gap-6 px-4 sm:px-6 mt-1">
        {/* Flagship Projects */}
        <AnimatePresence mode="popLayout">
          {flagshipProjects.map((project) => (
            <motion.article
              layout
              key={project.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              exit="exit"
              whileHover={{ y: -4 }}
              className="flex flex-col bg-surface-container rounded-xl shadow-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 group"
            >
              {/* Media Header & Visual Telemetry Strip */}
              <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
                {project.imageUrl && (
                  <img
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-80 group-hover:scale-102 transition-all duration-500"
                    alt={project.title}
                    src={project.imageUrl}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent"></div>

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-status-label text-xs shadow-sm border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                    <span className={project.badgeColor || 'text-secondary'}>{project.badge}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md font-code-sm text-xs text-primary border border-white/5">
                    {project.versionOrEndpoint}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="font-code-sm text-xs text-primary tracking-wide uppercase font-semibold">
                      {project.flagshipNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl text-on-surface font-bold tracking-tight">
                      {project.title}
                    </h2>
                  </div>
                  <span className="font-status-label text-xs text-on-surface-variant bg-surface-container-lowest/80 px-2.5 py-1 rounded backdrop-blur border border-white/5 capitalize">
                    {project.category === 'fullstack'
                      ? 'Marketplace'
                      : project.category === 'aiml'
                      ? 'B2B SaaS'
                      : 'System'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex flex-col gap-3.5">
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {project.tagline}
                </p>

                {/* High-Impact Architecture Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-surface-container-low border border-white/5">
                  {project.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="flex flex-col">
                      <span
                        className={`font-code-md text-xs sm:text-sm font-bold ${
                          metric.color === 'secondary'
                            ? 'text-secondary'
                            : metric.color === 'tertiary'
                            ? 'text-tertiary'
                            : 'text-primary'
                        }`}
                      >
                        {metric.value}
                      </span>
                      <span className="font-status-label text-[9px] sm:text-[10px] text-on-surface-variant uppercase tracking-wider">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Architecture Highlights */}
                <div className="flex flex-col gap-2 pt-1">
                  {project.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <AppIcon name={highlight.icon} className="text-primary w-[18px] h-[18px] shrink-0 mt-0.5" />
                      <p className="font-body-sm text-xs sm:text-sm text-on-surface leading-snug">
                        {highlight.title && (
                          <strong className="font-semibold text-on-surface mr-1">
                            {highlight.title}:
                          </strong>
                        )}
                        <span>{highlight.description}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tech Chips Flow */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-code-sm text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center gap-2 pt-3">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-code-md text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] border border-white/5 cursor-pointer"
                  >
                    <AppIcon name="code" className="w-[17px] h-[17px]" />
                    <span>Architecture</span>
                  </button>

                  {project.liveUrl && (
                    <a
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-code-md text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] shadow-sm shadow-primary/20 shrink-0"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Live Deployed App"
                    >
                      <AppIcon name="rocket_launch" className="w-4 h-4" />
                      <span>Live App</span>
                    </a>
                  )}

                  <a
                    className="flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface hover:text-primary transition-all active:scale-[0.98] shrink-0 border border-white/5"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open GitHub Repository"
                  >
                    <AppIcon name="open_in_new" className="w-[18px] h-[18px]" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {/* Section Heading: Specialized Deployments */}
        {specializedProjects.length > 0 && (
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-between pt-2 pb-1"
          >
            <div className="flex items-center gap-2">
              <AppIcon name="inventory_2" className="text-primary w-5 h-5" />
              <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
                Specialized Modules
              </h3>
            </div>
            <span className="font-code-sm text-xs text-on-surface-variant">
              {specializedProjects.length} Micro-Apps
            </span>
          </motion.div>
        )}

        {/* Compact Cards */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {specializedProjects.map((project) => (
              <motion.article
                layout
                key={project.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                exit="exit"
                whileHover={{ y: -2 }}
                className="flex flex-col bg-surface-container-low p-4 rounded-xl shadow-md border border-white/5 hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="font-code-sm text-xs text-primary font-semibold">
                      {project.category === 'aiml'
                        ? 'AI Assistant • NLP'
                        : 'MERN Stack • Dockerized'}
                    </span>
                    <h4 className="font-body-lg text-sm sm:text-base text-on-surface font-bold truncate mt-0.5">
                      {project.title}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded bg-surface-container font-status-label text-[10px] shrink-0 ${
                      project.badgeColor || 'text-secondary'
                    }`}
                  >
                    {project.badge}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-2 line-clamp-2">
                  {project.tagline}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="font-code-sm text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 bg-surface-container/40 -mx-4 -mb-4 p-3 rounded-b-xl gap-2">
                  <span className="font-status-label text-xs text-on-surface-variant flex items-center gap-1">
                    <AppIcon name="dns" className="w-3.5 h-3.5" />{' '}
                    {project.versionOrEndpoint}
                  </span>
                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <a
                        className="inline-flex items-center gap-1 font-code-sm text-xs text-secondary hover:text-secondary-fixed transition-colors font-semibold"
                        href={project.liveUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                        title="Open Live App"
                      >
                        <AppIcon name="rocket_launch" className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    <a
                      className="inline-flex items-center gap-1 font-code-sm text-xs text-primary hover:text-primary-fixed transition-colors font-semibold"
                      href={project.githubUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Code</span>
                      <AppIcon name="open_in_new" className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 bg-surface-container-low rounded-xl text-center my-4 border border-white/5"
          >
            <AppIcon name="code_off" className="text-outline w-10 h-10 mb-2" />
            <h4 className="font-headline-md text-base sm:text-lg text-on-surface font-semibold">
              No Systems Found
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant max-w-xs mt-1">
              No active builds match this tag criteria or search query. Try switching back to all projects.
            </p>
            <button
              onClick={() => {
                handleCategorySelect('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-surface-container-highest text-primary font-code-sm text-xs transition-colors hover:bg-surface-bright cursor-pointer"
            >
              Reset Filter
            </button>
          </motion.div>
        )}

        {/* Bottom Call to Action */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-4 p-4 rounded-xl bg-gradient-to-br from-surface-container-high to-surface-container flex flex-col gap-3 shadow-lg border border-white/5"
        >
          <div className="flex items-center gap-2">
            <AppIcon name="hub" className="text-secondary w-5 h-5" />
            <span className="font-code-sm text-xs text-secondary font-bold uppercase tracking-wider">
              Need Custom Architecture?
            </span>
          </div>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant">
            Available for full-stack engineering contracts, AI pipeline designs, and distributed systems consulting.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-primary text-on-primary font-code-md text-xs sm:text-sm font-bold transition-all active:scale-[0.98] shadow-md shadow-primary/20 cursor-pointer"
          >
            <span>Initialize Discussion</span>
            <AppIcon name="terminal" className="w-[18px] h-[18px]" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
