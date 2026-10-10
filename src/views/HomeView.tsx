import React, { useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { TabType, Project } from '../types';
import { PERSONAL_INFO, SKILL_CATEGORIES } from '../data/portfolioData';
import { AppIcon } from '../components/AppIcon';

const TechCanvas3D = lazy(() =>
  import('../components/TechCanvas3D').then((m) => ({ default: m.TechCanvas3D }))
);

interface HomeViewProps {
  avatarUrl: string;
  onNavigate: (tab: TabType) => void;
  onOpenResume: () => void;
  onOpenUploadModal: () => void;
  onSelectProject: (project: Project) => void;
  onShowToast: (msg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  avatarUrl,
  onNavigate,
  onOpenResume,
  onOpenUploadModal,
  onShowToast,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const blueprintRef = useRef<HTMLDivElement>(null);

  const handleScrollToBlueprint = () => {
    blueprintRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.codeFocus);
    setCopiedSnippet(true);
    onShowToast('Focus snippet copied to clipboard');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    onShowToast('Email copied to clipboard');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.04,
      },
    },
  };

  const childFade = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* =========================================================================
          PREMIUM EDITORIAL HERO SECTION:
          Left: Clear positioning, concise value proposition, 2 primary CTAs, social links
          Right: Interactive 3D Spatial Architecture Canvas (TechCanvas3D)
      ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-6 lg:px-12 xl:px-16 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Subtle Atmospheric Gradient Scrim (Enhances contrast without covering 3D constellation) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090b11]/30 to-[#090b11]/80" />
        </div>

        {/* Minimal Live Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-20 max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8"
        >
          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-xl shadow-sm border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            <span className="font-status-label text-secondary text-[11px] sm:text-xs font-semibold tracking-wide uppercase">
              {PERSONAL_INFO.statusPill} &bull; Dhaka / Remote
            </span>
          </div>

          {/* Quick Location & Direct GitHub Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low/80 backdrop-blur-md text-on-surface-variant hover:text-primary font-code-sm text-xs border border-white/10 hover:border-primary/30 transition-all"
            >
              <AppIcon name="code" className="w-3.5 h-3.5 text-primary" />
              <span>github.com/shawon2210</span>
              <AppIcon name="open_in_new" className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </motion.div>

        {/* Main Hero Split Grid: Clear Narrative on Left, Interactive 3D on Right */}
        <div className="relative z-20 max-w-6xl w-full mx-auto my-auto py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Core Positioning, Headline, and Actions */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col items-start text-left w-full"
            >
              {/* Responsive Author Profile Identity Lockup */}
              <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                <div
                  onClick={import.meta.env.DEV ? onOpenUploadModal : undefined}
                  className={`relative shrink-0 group ${import.meta.env.DEV ? 'cursor-pointer' : ''}`}
                  title={import.meta.env.DEV ? 'Click to upload/change profile photo' : undefined}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden ring-2 ring-primary/40 shadow-2xl bg-surface-container-high transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={avatarUrl}
                      alt={PERSONAL_INFO.name}
                      className="w-full h-full object-cover object-top filter contrast-[1.03]"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#090b11] border border-white/10 flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[10px] text-secondary font-bold font-status-label uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>


                <div className="flex flex-col min-w-0">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-code-sm text-primary uppercase font-bold text-xs tracking-wider">
                      Full-Stack Software Engineer
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-on-surface-variant font-medium mt-0.5">
                    AI Systems &bull; High-Scale Distributed Web
                  </span>
                  <span className="text-[11px] text-secondary font-code-sm flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>Open for Full-Time Roles &bull; Dhaka / Remote</span>
                  </span>
                </div>
              </div>

              {/* Candidate Name Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.05] mb-4">
                MD Shawon{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed to-secondary">
                  Molla
                </span>
              </h1>

              {/* Value Proposition Statement */}
              <p className="font-body-md text-base sm:text-lg text-on-surface-variant leading-relaxed mb-6 max-w-xl">
                Building high-concurrency web platforms, distributed backend services, and autonomous AI pipelines with clean architecture and mathematical precision.
              </p>

              {/* Terminal Snippet Box */}
              <div className="w-full max-w-lg p-2.5 sm:p-3 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between gap-2 shadow-inner border border-white/10 mb-6">
                <div className="flex items-center gap-2 min-w-0">
                  <AppIcon name="terminal" className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-code-sm text-xs sm:text-[13px] text-on-surface-variant truncate">
                    {PERSONAL_INFO.codeFocus}
                  </span>
                </div>
                <button
                  onClick={handleCopySnippet}
                  className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex-shrink-0 cursor-pointer"
                  title="Copy snippet"
                  aria-label="Copy focus snippet"
                >
                  <AppIcon name={copiedSnippet ? 'check' : 'content_copy'} className="w-4 h-4" />
                </button>
              </div>

              {/* Exactly 2 Primary High-Contrast Actions */}
              <div className="w-full flex flex-wrap items-center gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('projects')}
                  className="h-11 px-5 sm:px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-md font-semibold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(76,215,246,0.35)] transition-all cursor-pointer text-sm"
                >
                  <span>Explore Projects</span>
                  <AppIcon name="arrow_forward" className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenResume}
                  className="h-11 px-5 sm:px-6 rounded-lg bg-surface-container-high/90 hover:bg-surface-bright text-on-surface font-body-md font-medium flex items-center justify-center gap-2 transition-all border border-white/15 cursor-pointer text-sm backdrop-blur-md"
                >
                  <AppIcon name="download" className="w-4 h-4 text-primary" />
                  <span>Inspect CV Resume</span>
                </motion.button>
              </div>

              {/* Verified Presence Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  className="h-8 px-3 rounded-full bg-surface-container-high/70 backdrop-blur-md text-on-surface hover:text-primary font-code-sm text-xs flex items-center gap-1.5 border border-white/10 hover:border-primary/30 transition-all"
                  href={PERSONAL_INFO.githubUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AppIcon name="code" className="w-3.5 h-3.5 text-primary" />
                  <span>GitHub</span>
                  <AppIcon name="open_in_new" className="w-3 h-3 opacity-50" />
                </a>

                <a
                  className="h-8 px-3 rounded-full bg-surface-container-high/70 backdrop-blur-md text-on-surface hover:text-primary font-code-sm text-xs flex items-center gap-1.5 border border-white/10 hover:border-primary/30 transition-all"
                  href={PERSONAL_INFO.linkedinUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AppIcon name="badge" className="w-3.5 h-3.5 text-tertiary" />
                  <span>LinkedIn</span>
                  <AppIcon name="open_in_new" className="w-3 h-3 opacity-50" />
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="h-8 px-3 rounded-full bg-surface-container-high/70 backdrop-blur-md text-on-surface hover:text-secondary font-code-sm text-xs flex items-center gap-1.5 border border-white/10 hover:border-secondary/30 transition-all cursor-pointer"
                >
                  <AppIcon name={copiedEmail ? 'check' : 'alternate_email'} className="w-3.5 h-3.5 text-secondary" />
                  <span>{copiedEmail ? 'Copied' : PERSONAL_INFO.email}</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column: Interactive 3D Spatial Canvas Showpiece */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center w-full"
            >
              <div className="w-full max-w-md flex flex-col gap-3">
                <Suspense
                  fallback={
                    <div className="h-[360px] w-full rounded-2xl bg-surface-container-low/50 animate-pulse border border-white/5 flex items-center justify-center text-on-surface-variant font-code-sm text-xs">
                      Initializing 3D Spatial Canvas...
                    </div>
                  }
                >
                  <TechCanvas3D className="h-[340px] sm:h-[380px] w-full" variant="hero" />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Cue Pinned to Bottom of Hero */}
        <div className="relative z-20 w-full flex justify-center pt-4 sm:pt-6">
          <button
            onClick={handleScrollToBlueprint}
            className="flex flex-col items-center gap-1 text-on-surface-variant/70 hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="font-code-sm text-[11px] tracking-widest uppercase">
              Explore Technical Capabilities
            </span>
            <AppIcon name="keyboard_arrow_down" className="w-5 h-5 animate-bounce text-primary" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SYSTEMS BLUEPRINT & TECHNICAL STACK
          Clear engineering overview + 6-discipline skills matrix + hiring pitch
      ========================================================================= */}
      <div
        ref={blueprintRef}
        className="flex flex-col w-full pb-20 max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12"
      >
        {/* Professional Summary Panel (Engineering Blueprint) */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative z-10 p-5 sm:p-6 rounded-2xl bg-surface-container-low/90 backdrop-blur-md shadow-lg mb-8 flex flex-col gap-4 border border-white/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-code-md text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                Engineering Blueprint
              </span>
            </div>
            <span className="font-status-label text-[10px] text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
              CS GRADUATE
            </span>
          </div>
          <p className="font-body-md text-xs sm:text-sm text-on-surface leading-relaxed">
            {PERSONAL_INFO.bio}
          </p>

          {/* Telemetry Impact Stats Bar */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2"
          >
            <motion.div
              variants={childFade}
              whileHover={{ y: -2 }}
              className="p-3 rounded-lg bg-surface-container-high/70 flex flex-col border border-white/5"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-primary">3+</span>
                <AppIcon name="rocket" className="w-4 h-4 text-primary" />
              </div>
              <span className="font-status-label text-[10px] text-on-surface-variant mt-0.5">
                Production Apps Shipped
              </span>
            </motion.div>
            <motion.div
              variants={childFade}
              whileHover={{ y: -2 }}
              className="p-3 rounded-lg bg-surface-container-high/70 flex flex-col border border-white/5"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-secondary">97</span>
                <AppIcon name="schema" className="w-4 h-4 text-secondary" />
              </div>
              <span className="font-status-label text-[10px] text-on-surface-variant mt-0.5">
                Tables Schema Scaled
              </span>
            </motion.div>
            <motion.div
              variants={childFade}
              whileHover={{ y: -2 }}
              className="p-3 rounded-lg bg-surface-container-high/70 flex flex-col border border-white/5"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-tertiary">+27</span>
                <AppIcon name="speed" className="w-4 h-4 text-tertiary" />
              </div>
              <span className="font-status-label text-[10px] text-on-surface-variant mt-0.5">
                Lighthouse Score Gain
              </span>
            </motion.div>
            <motion.div
              variants={childFade}
              whileHover={{ y: -2 }}
              className="p-3 rounded-lg bg-surface-container-high/70 flex flex-col border border-white/5"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-primary-fixed">91+</span>
                <AppIcon name="verified" className="w-4 h-4 text-primary-fixed" />
              </div>
              <span className="font-status-label text-[10px] text-on-surface-variant mt-0.5">
                Automated Tests Written
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Technical Skills Matrix Section */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative z-10 flex flex-col gap-3 mb-8"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <AppIcon name="developer_board" className="text-secondary w-5 h-5" />
              <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
                Technical Stack &amp; Disciplines
              </h2>
            </div>
            <span className="font-code-sm text-xs text-on-surface-variant">6 Disciplines</span>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {SKILL_CATEGORIES.map((category) => (
              <motion.div
                key={category.id}
                variants={childFade}
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2.5 border border-white/5 hover:border-primary/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <AppIcon name={category.icon} className="w-[18px] h-[18px]" />
                    </div>
                    <span className="font-headline-md text-sm sm:text-base font-semibold text-on-surface">
                      {category.name}
                    </span>
                  </div>
                  <span className="font-status-label text-[10px] text-primary font-code-sm font-semibold">
                    {category.badge}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-code-sm text-xs border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Interactive Hiring Manager Pitch Card */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative z-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low shadow-xl flex flex-col gap-3 border border-white/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppIcon name="handshake" className="text-secondary w-6 h-6" />
              <span className="font-headline-md text-base font-bold text-on-surface">
                Hiring for your engineering team?
              </span>
            </div>
            <span className="font-code-sm text-xs text-secondary bg-surface-container-lowest px-2 py-0.5 rounded">
              Ready to Deploy
            </span>
          </div>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            I am eager to contribute clean, production-grade PRs, build modern React/Next.js interfaces, and scale backend services from day one.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNavigate('contact')}
              className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-sm font-semibold flex items-center justify-center gap-1.5 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <AppIcon name="chat" className="w-[18px] h-[18px]" />
              <span>Schedule an Interview</span>
            </button>
            <button
              onClick={handleCopyEmail}
              className="h-10 px-3.5 rounded-lg bg-surface-container-highest text-on-surface hover:text-primary font-code-sm text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/5 cursor-pointer"
            >
              <AppIcon name={copiedEmail ? 'check' : 'content_copy'} className="w-4 h-4" />
              <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
