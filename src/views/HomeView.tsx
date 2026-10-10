import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, FileText, Github, Linkedin, Mail, Check, Copy, ChevronDown } from 'lucide-react';
import { TabType, Project } from '../types';
import { PERSONAL_INFO, SKILL_CATEGORIES } from '../data/portfolioData';
import { AppIcon } from '../components/AppIcon';
import { Badge, SplitText, MagneticButton } from '../components/primitives';

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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const blueprintRef = useRef<HTMLDivElement>(null);

  // Dynamic verified role rotation
  const roles = [
    'Full-Stack Software Engineer',
    'AI Systems Architecture',
    'Distributed Cloud Platforms',
  ];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [roles.length]);


  const handleScrollToBlueprint = () => {
    blueprintRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      {/* =========================================================================
          PHASE 4: EDITORIAL SPLIT HERO SECTION
          Left: Availability pill, Author Portrait, Name once with SplitText, Dynamic Rotating Role,
                2-sentence value proposition, exactly 2 CTAs (Explore Projects shimmer + Inspect CV Resume),
                minimal verified presence links.
          Right: Showpiece TechCanvas3D in an editorial glass frame (clamped DPR 1.5, paused offscreen).
      ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-6 lg:px-12 xl:px-16 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Soft aurora ambient highlight (complements 3D background without muddying) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-25">
          <div className="absolute top-12 left-1/4 w-[32rem] h-[32rem] bg-sky-500/15 rounded-full blur-[120px]" />
        </div>

        {/* Main Editorial Hero Split Grid */}
        <div className="relative z-20 max-w-6xl w-full mx-auto my-auto py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Narrative, Identity, Headline, Dynamic Role, and CTAs */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col items-start text-left w-full space-y-6"
            >
              {/* Top Meta Lockup: Author Portrait + Status Pill */}
              <div className="flex items-center gap-4">
                <div
                  onClick={import.meta.env.DEV ? onOpenUploadModal : undefined}
                  className={`relative shrink-0 group ${import.meta.env.DEV ? 'cursor-pointer' : ''}`}
                  title={import.meta.env.DEV ? 'Click to change profile picture' : undefined}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-sky-400/30 shadow-2xl bg-white/[0.04] transition-all duration-300 group-hover:ring-sky-400/60 group-hover:scale-105">
                    <img
                      src={avatarUrl}
                      alt={PERSONAL_INFO.name}
                      className="w-full h-full object-cover object-top filter contrast-[1.03]"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 ring-2 ring-[#090b11]" />
                  </span>
                </div>

                <div className="flex flex-col items-start gap-1.5">
                  <Badge variant="availability" pulse>
                    {PERSONAL_INFO.statusPill}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    {PERSONAL_INFO.location} &bull; Remote Available
                  </span>
                </div>
              </div>

              {/* Candidate Headline — NAME APPEARS ONCE */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08]">
                  <SplitText text="MD Shawon Molla" />
                </h1>

                {/* Dynamic Rotating Role Line */}
                <div className="h-7 sm:h-8 flex items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={roleIndex}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="font-mono text-sm sm:text-base font-semibold text-sky-400 flex items-center gap-2"
                    >
                      <span className="text-slate-500 font-normal">&gt;</span>
                      <span>{roles[roleIndex]}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* 2-Sentence Value Proposition */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Building high-concurrency web platforms, distributed backend services, and autonomous AI pipelines. Focused on clean architecture, performance optimization, and scalable engineering.
              </p>

              {/* Exactly 2 Primary High-Contrast Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Primary CTA with Shimmer Effect */}
                <MagneticButton
                  onClick={() => onNavigate('projects')}
                  className="relative group overflow-hidden px-6 py-3 rounded-xl bg-sky-400 text-slate-950 font-semibold text-sm shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:bg-sky-300 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Explore Projects</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </MagneticButton>

                {/* Secondary CTA */}
                <MagneticButton
                  onClick={onOpenResume}
                  className="px-5 py-3 rounded-xl bg-white/[0.04] text-slate-200 hover:text-white hover:bg-white/[0.08] font-medium text-sm border border-white/[0.1] hover:border-white/[0.2] transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
                >
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Inspect CV Resume</span>
                </MagneticButton>
              </div>

              {/* Verified Minimal Presence Links */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href={PERSONAL_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sky-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all"
                  title="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5 text-sky-400" />
                  <span>GitHub</span>
                </a>

                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sky-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5 text-violet-400" />
                  <span>LinkedIn</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{copiedEmail ? 'Copied' : PERSONAL_INFO.email}</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column: 3D Spatial Architecture Showpiece */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center w-full"
            >
              <div className="w-full max-w-md p-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm shadow-2xl">
                <Suspense
                  fallback={
                    <div className="h-[360px] w-full rounded-xl bg-white/[0.02] animate-pulse border border-white/5 flex items-center justify-center text-slate-500 font-mono text-xs">
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
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-sky-400 transition-colors cursor-pointer group"
          >
            <span className="font-mono text-[11px] tracking-widest uppercase">
              Explore Technical Capabilities
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-sky-400" />
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
