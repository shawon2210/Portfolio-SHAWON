import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, FileText, Github, Linkedin, Check, Copy, ChevronDown } from 'lucide-react';
import { TabType, Project } from '../types';
import { PERSONAL_INFO, SKILL_CATEGORIES } from '../data/portfolioData';
import { AppIcon } from '../components/AppIcon';
import { Badge } from '../components/primitives';
import {
  GradientHeading,
  PillButton,
  GhostButton,
  Anchor3D,
  FadeIn,
  Magnet,
} from '../components/motion';

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
  const heroRef = useRef<HTMLDivElement>(null);
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

  // Scroll cue fades out on scroll
  const { scrollY } = useScroll();
  const scrollCueOpacity = useTransform(scrollY, [0, 160], [1, 0]);

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
          PHASE 3: AWARD-LEVEL CINEMATIC HERO SECTION
          Reference Pattern 1 & 2:
          - Giant full-width gradient display heading spanning viewport (z-0, behind showpiece)
          - Centered 3D "Magnet" showpiece (Anchor3D "hero-centerpiece" z-10, in front of heading)
          - Tagline bottom-left (max-w capped, dynamic role pill)
          - Exactly two CTAs bottom-right (PillButton + GhostButton)
          - Staggered entrance: heading 0.15s, tagline 0.35s, CTA 0.5s, showpiece 0.6s
          - Scroll cue with useTransform opacity fade
      ========================================================================= */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[100vh] flex flex-col justify-between px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden select-none"
      >
        {/* Soft aurora ambient highlight */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-25">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[42rem] h-[28rem] bg-sky-500/15 rounded-full blur-[140px]" />
        </div>

        {/* Top Status & Identity Row (Entrance 0.05s) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          <FadeIn delay={0.05} y={-10} className="flex items-center gap-3 sm:gap-4">
            <div
              onClick={import.meta.env.DEV ? onOpenUploadModal : undefined}
              className={`relative shrink-0 group ${import.meta.env.DEV ? 'cursor-pointer' : ''}`}
              title={import.meta.env.DEV ? 'Click to change profile picture' : undefined}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden ring-2 ring-sky-400/30 shadow-2xl bg-white/[0.04] transition-all duration-300 group-hover:ring-sky-400/60 group-hover:scale-105">
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

            <div className="flex flex-col items-start gap-1">
              <Badge variant="availability" pulse>
                {PERSONAL_INFO.statusPill}
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">
                {PERSONAL_INFO.location} &bull; Remote Available
              </span>
            </div>
          </FadeIn>

          {/* Social Presence Pills */}
          <FadeIn delay={0.1} y={-10} className="hidden sm:flex items-center gap-2">
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sky-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all"
            >
              <Github className="w-3.5 h-3.5 text-sky-400" />
              <span>GitHub</span>
            </a>
            <a
              href={PERSONAL_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-violet-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all"
            >
              <Linkedin className="w-3.5 h-3.5 text-violet-400" />
              <span>LinkedIn</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copiedEmail ? 'Copied' : PERSONAL_INFO.email}</span>
            </button>
          </FadeIn>
        </div>

        {/* Centerpiece Stage: Giant Display Heading BEHIND 3D Core Showpiece */}
        <div className="relative w-full max-w-7xl mx-auto my-auto flex flex-col items-center justify-center py-8">
          {/* Layer 0: Giant Full-Width Gradient Display Heading (behind showpiece, delay 0.15s) */}
          <div className="relative z-0 w-full flex justify-center text-center overflow-hidden pointer-events-none">
            <GradientHeading
              text="SHAWON MOLLA"
              as="h1"
              delay={0.15}
              stagger={0.03}
              gradient="linear-gradient(180deg, #f8fafc 0%, #64748b 70%, #334155 100%)"
              className="text-[14vw] sm:text-[13vw] lg:text-[11.5vw] font-black tracking-[-0.04em] leading-[0.88] uppercase opacity-90"
            />
          </div>

          {/* Layer 1: Centered 3D Showpiece Anchor overlapping the heading in front (delay 0.6s) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <FadeIn delay={0.6} duration={0.8} y={30} blur={10}>
              <Magnet padding={40} strength={0.3}>
                <div className="relative flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing">
                  {/* Anchor DOM rect projects to the 3D core in the single WebGL scene */}
                  <Anchor3D
                    name="hero-centerpiece"
                    className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full flex items-center justify-center relative"
                  >
                    {/* Visual aura halo ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/10 via-violet-500/5 to-transparent blur-2xl pointer-events-none" />
                  </Anchor3D>
                </div>
              </Magnet>
            </FadeIn>
          </div>
        </div>

        {/* Bottom Hero Bar: Tagline bottom-left, CTAs bottom-right */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-4">
          {/* Bottom-Left: Role Pill + Value Proposition Tagline (delay 0.35s) */}
          <FadeIn delay={0.35} y={20} className="flex flex-col items-start space-y-2 max-w-xl">
            <div className="h-7 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIndex}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="font-mono text-xs sm:text-sm font-semibold text-sky-400 flex items-center gap-2"
                >
                  <span className="text-slate-500 font-normal">&gt;</span>
                  <span>{roles[roleIndex]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
              High-concurrency systems, distributed microservices, and autonomous AI orchestration. Built for resilience and performance.
            </p>
          </FadeIn>

          {/* Bottom-Right: Exactly Two CTAs (PillButton + GhostButton) (delay 0.5s) */}
          <FadeIn delay={0.5} y={20} className="flex flex-wrap items-center gap-3">
            <PillButton onClick={() => onNavigate('projects')} className="group">
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </PillButton>

            <GhostButton onClick={onOpenResume}>
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Inspect CV Resume</span>
            </GhostButton>
          </FadeIn>
        </div>

        {/* Scroll Cue with useTransform Opacity Fade */}
        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="relative z-20 w-full flex justify-center pt-6 sm:pt-8"
        >
          <button
            onClick={handleScrollToBlueprint}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-sky-400 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-full px-3 py-1"
            aria-label="Scroll to technical capabilities"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase">
              Explore Technical Capabilities
            </span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-sky-400" />
          </button>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: SYSTEMS BLUEPRINT & TECHNICAL STACK
          Clear engineering overview + 6-discipline skills matrix + hiring pitch
      ========================================================================= */}
      <div
        ref={blueprintRef}
        className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 lg:pb-28 scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28"
      >
        {/* Professional Summary Panel (Engineering Blueprint) */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative z-10 p-5 sm:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/20 mb-8 sm:mb-10 lg:mb-12 flex flex-col gap-4 border border-white/[0.08]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-code-md text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                Engineering Blueprint
              </span>
            </div>
            <span className="font-status-label text-[10px] text-on-surface-variant px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
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
              className="p-3 rounded-lg bg-white/[0.02] flex flex-col border border-white/[0.06] hover:border-sky-400/25 transition-colors"
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
              className="p-3 rounded-lg bg-white/[0.02] flex flex-col border border-white/[0.06] hover:border-sky-400/25 transition-colors"
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
              className="p-3 rounded-lg bg-white/[0.02] flex flex-col border border-white/[0.06] hover:border-sky-400/25 transition-colors"
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
              className="p-3 rounded-lg bg-white/[0.02] flex flex-col border border-white/[0.06] hover:border-sky-400/25 transition-colors"
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
          className="relative z-10 flex flex-col gap-3 mb-8 sm:mb-10 lg:mb-12"
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
                className="p-4 rounded-xl bg-white/[0.02] backdrop-blur-sm flex flex-col gap-2.5 border border-white/[0.08] hover:border-sky-400/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-primary">
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
                      className="px-2.5 py-1 rounded bg-white/[0.03] text-on-surface font-code-sm text-xs border border-white/[0.07]"
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
          className="relative z-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent backdrop-blur-xl shadow-2xl shadow-black/20 flex flex-col gap-3 border border-white/[0.08]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppIcon name="handshake" className="text-secondary w-6 h-6" />
              <span className="font-headline-md text-base font-bold text-on-surface">
                Hiring for your engineering team?
              </span>
            </div>
            <span className="font-code-sm text-xs text-secondary bg-white/[0.03] border border-white/[0.07] px-2 py-0.5 rounded">
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
              className="h-10 px-3.5 rounded-lg bg-white/[0.04] text-on-surface hover:text-sky-400 hover:bg-white/[0.08] font-code-sm text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/[0.1] cursor-pointer"
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
