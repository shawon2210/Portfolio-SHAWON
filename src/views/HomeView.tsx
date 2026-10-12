import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, FileText, Github, Linkedin, Check, Copy, ChevronDown } from 'lucide-react';
import { TabType, Project } from '../types';
import { PERSONAL_INFO, SKILL_CATEGORIES, PROJECTS } from '../data/portfolioData';
import { AppIcon } from '../components/AppIcon';
import { Badge } from '../components/primitives';
import { ProfilePortrait } from '../components/ProfilePortrait';
import { useLoadPhase } from '../lib/loadPhase';
import { EASE_MICRO } from '../lib/motion';
import { scrollElementTo } from '../lib/scroll';
import {
  GradientHeading,
  PillButton,
  GhostButton,
  Anchor3D,
  FadeIn,
  Magnet,
  ScrollMarquee,
  AnimatedText,
} from '../components/motion';

interface HomeViewProps {
  avatarUrl: string;
  onNavigate: (tab: TabType) => void;
  onOpenResume: () => void;
  onOpenUploadModal: () => void;
  onSelectProject: (project: Project) => void;
  onShowToast: (msg: string) => void;
  reducedMotion?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  avatarUrl,
  onNavigate,
  onOpenResume,
  onOpenUploadModal,
  onSelectProject,
  onShowToast,
  reducedMotion = false,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);

  /* PHASE 5: every hero element reads its delay from the shared choreography
     so the heading, the 3D centerpiece and the nav resolve as one gesture. */
  const { at, shouldAnimate } = useLoadPhase();

  // Dynamic verified role rotation
  const roles = [
    'Full-Stack Software Engineer',
    'AI Systems Architecture',
    'Distributed Cloud Platforms',
  ];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [roles.length, reducedMotion]);

  // Scroll cue fades out on scroll
  const { scrollY } = useScroll();
  const scrollCueOpacity = useTransform(scrollY, [0, 160], [1, 0]);

  const handleScrollToBlueprint = () => {
    scrollElementTo(blueprintRef.current, { reducedMotion });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    onShowToast('Email copied to clipboard');
    setTimeout(() => setCopiedEmail(false), 2000);
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
      transition: { duration: 0.4, ease: EASE_MICRO },
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
        data-testid="hero"
        className="relative w-full min-h-[100vh] flex flex-col justify-between px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden select-none"
      >
        {/* Soft aurora ambient highlight */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-25">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[42rem] h-[28rem] bg-sky-500/15 rounded-full blur-[140px]" />
        </div>

        {/* Top Status & Identity Row — choreography slot: meta

            MOBILE-FIRST v4 / PHASE 2: the brief's mobile order is
            availability pill -> passport portrait -> name. On phones the whole
            identity block becomes a centred column (portrait between pill and
            the giant heading below), and the social pills move under it.
            From lg up this row returns to the original cinematic left-aligned
            layout so the desktop design is unchanged.

            The 48px avatar chip is gone. <ProfilePortrait /> is the single
            canonical portrait for the whole site. */}
        <motion.div
          className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: at('meta'), ease: EASE_MICRO }}
        >
          {/* Availability pill comes FIRST on mobile (per the brief's order). */}
          <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:gap-4">
            <Badge variant="availability" pulse>
              {PERSONAL_INFO.statusPill}
            </Badge>

            {/* Canonical passport portrait — centred on mobile, left on desktop. */}
            <div
              onClick={import.meta.env.DEV ? onOpenUploadModal : undefined}
              className={import.meta.env.DEV ? 'cursor-pointer' : ''}
              title={import.meta.env.DEV ? 'Click to change profile picture' : undefined}
            >
              <ProfilePortrait
                // Dev-only avatar upload override. When it still matches the
                // default we render the generated <picture> ladder instead.
                src={avatarUrl !== PERSONAL_INFO.portraitUrl ? avatarUrl : undefined}
                alt={`Portrait of ${PERSONAL_INFO.name}, ${PERSONAL_INFO.title}`}
                // Mirrors the clamp() ladder in index.css so the browser picks
                // the right candidate from srcset for the actual box.
                sizes="(min-width: 1024px) clamp(320px, 26vw, 420px), (min-width: 640px) clamp(280px, 34vw, 340px), (min-width: 400px) clamp(240px, 58vw, 300px), clamp(200px, 62vw, 260px)"
                delay={at('meta') + 0.05}
                showAvailability={false}
              />
            </div>

            <span className="text-xs sm:text-sm font-mono text-slate-400 lg:order-2">
              {PERSONAL_INFO.location} &bull; Remote Available
            </span>
          </div>

{/* Social Presence Pills — MOBILE-FIRST v4: previously hidden below sm.
                Now visible on phones as a centred row under the portrait,
                because the brief's mobile hero order ends with social icons. */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-2 lg:justify-end"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: at('meta') + 0.05, ease: EASE_MICRO }}
            >
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sky-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all pressable"
            >
              <Github className="w-3.5 h-3.5 text-sky-400" />
              <span>GitHub</span>
            </a>
            <a
              href={PERSONAL_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-violet-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all pressable"
            >
              <Linkedin className="w-3.5 h-3.5 text-violet-400" />
              <span>LinkedIn</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-500/30 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer pressable"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copiedEmail ? 'Copied' : PERSONAL_INFO.email}</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Centerpiece Stage: Giant Display Heading BEHIND 3D Core Showpiece */}
        <div className="relative w-full max-w-7xl mx-auto my-auto flex flex-col items-center justify-center py-8">
          {/* Layer 0: Giant Full-Width Gradient Display Heading (behind showpiece) */}
          <div className="relative z-0 w-full flex justify-center text-center overflow-hidden pointer-events-none">
            <GradientHeading
              text="SHAWON MOLLA"
              as="h1"
              delay={at('heading')}
              stagger={shouldAnimate ? 0.022 : 0}
              gradient="linear-gradient(180deg, #f8fafc 0%, #94a3b8 62%, #475569 100%)"
              className="text-[14vw] sm:text-[13vw] lg:text-[11.5vw] font-black tracking-[-0.04em] leading-[0.88] uppercase"
            />
          </div>

          {/* Layer 1: Centered 3D Showpiece Anchor overlapping the heading in front */}
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.82, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.9,
              delay: at('scene'),
              ease: EASE_MICRO,
            }}
          >
            <Magnet padding={40} strength={0.3}>
              {/* data-cursor="drag" drives the contextual cursor's grab state */}
              <div
                data-cursor="drag"
                className="relative flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
              >
                {/* Anchor DOM rect projects to the 3D core in the single WebGL scene */}
                {/* MOBILE-FIRST v4 / PHASE 2: on phones the portrait owns the hero, so the
                centerpiece shrinks to a small ambient element and is pushed
                behind the heading rather than sitting on top of it. From sm up
                it returns to the full cinematic size. The audit at 390px showed
                a 192px core sitting directly over the display heading. */}
                <Anchor3D
                  name="hero-centerpiece"
                  className="w-32 h-32 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full flex items-center justify-center relative opacity-60 sm:opacity-100"
                >
                  {/* Visual aura halo ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/10 via-violet-500/5 to-transparent blur-2xl pointer-events-none" />
                </Anchor3D>
              </div>
            </Magnet>
          </motion.div>
        </div>

        {/* Bottom Hero Bar: Tagline bottom-left, CTAs bottom-right */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-4">
          {/* Bottom-Left: Role Pill + Value Proposition Tagline */}
          <motion.div
            className="flex flex-col items-start space-y-2 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: at('tagline'), ease: EASE_MICRO }}
          >
            <div className="h-7 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIndex}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: EASE_MICRO }}
                  className="font-mono text-xs sm:text-sm font-semibold text-sky-400 flex items-center gap-2"
                >
                  <span className="text-slate-400 font-normal" aria-hidden="true">
                    &gt;
                  </span>
                  <span>{roles[roleIndex]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
              High-concurrency systems, distributed microservices, and autonomous AI orchestration. Built for resilience and performance.
            </p>
          </motion.div>

          {/* Bottom-Right: Exactly Two CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: at('cta'), ease: EASE_MICRO }}
          >
            <PillButton data-testid="cta-explore-projects" onClick={() => onNavigate('projects')} className="group">
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </PillButton>

            <GhostButton data-testid="cta-inspect-resume" onClick={onOpenResume}>
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Inspect CV Resume</span>
            </GhostButton>
          </motion.div>
        </div>

        {/* Scroll Cue with useTransform Opacity Fade — choreography slot: cue */}
        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="relative z-20 w-full flex justify-center pt-6 sm:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: at('cue') }}
        >
          <button
            onClick={handleScrollToBlueprint}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-full px-3 py-1 pressable"
            /* PHASE 5: accessible name contains the visible label (a11y fix) */
            aria-label="Explore Technical Capabilities — scroll to next section"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase">
              Explore Technical Capabilities
            </span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-sky-400" />
          </button>
        </motion.div>
      </section>

      {/* =========================================================================
          PATTERN 3: TWO-ROW SCROLL-DRIVEN PROJECT MARQUEE ("Selected work in motion")
          Row 1 moves right, Row 2 moves left; driven by scroll position with velocity skew
      ========================================================================= */}
      <section data-testid="section-marquee" className="relative w-full py-16 sm:py-24 overflow-hidden border-y border-white/[0.06] bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-sky-400">
                Selected Work In Motion
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              Scroll Driven &bull; Velocity Sensitive
            </span>
          </div>
        </div>

        {/* Row 1: moves right */}
        <div className="w-full mb-5">
          <ScrollMarquee direction="right" speed={0.25}>
            {PROJECTS.map((proj) => (
              <div
                key={`row1-${proj.id}`}
                onClick={() => onSelectProject(proj)}
                className="w-[340px] sm:w-[420px] h-[220px] sm:h-[260px] rounded-2xl overflow-hidden relative group border border-white/10 bg-[#0d1017]/80 shrink-0 cursor-pointer shadow-xl transition-all hover:border-sky-400/40 hover:scale-[1.02] pressable-strong" data-cursor="project"
              >
                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 font-mono text-xs text-slate-500">
                    TODO(asset)
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                  <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider font-semibold">
                    {proj.flagshipNumber}
                  </span>
                  <h2 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {proj.title}
                  </h2>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {proj.tagline}
                  </p>
                </div>
              </div>
            ))}
          </ScrollMarquee>
        </div>

        {/* Row 2: moves left */}
        <div className="w-full">
          <ScrollMarquee direction="left" speed={0.25}>
            {PROJECTS.slice().reverse().map((proj) => (
              <div
                key={`row2-${proj.id}`}
                onClick={() => onSelectProject(proj)}
                className="w-[340px] sm:w-[420px] h-[220px] sm:h-[260px] rounded-2xl overflow-hidden relative group border border-white/10 bg-[#0d1017]/80 shrink-0 cursor-pointer shadow-xl transition-all hover:border-sky-400/40 hover:scale-[1.02] pressable-strong" data-cursor="project"
              >
                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 font-mono text-xs text-slate-500">
                    TODO(asset)
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    {proj.badge}
                  </span>
                  <h2 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {proj.title}
                  </h2>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {proj.tagline}
                  </p>
                </div>
              </div>
            ))}
          </ScrollMarquee>
        </div>
      </section>

      {/* =========================================================================
          PATTERN 4 & 5: ABOUT SECTION WITH 4 CORNER 3D ANCHORS + CHAR SCROLL REVEAL
          Corners:
          - Top-Left: Anchor3D name="about-torus"
          - Top-Right: Anchor3D name="about-gyro"
          - Bottom-Left: Anchor3D name="about-blocks"
          - Bottom-Right: Anchor3D name="about-noise-sphere"
      ========================================================================= */}
      <section
        ref={blueprintRef}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24 sm:py-32 scroll-mt-20 overflow-hidden"
      >
        {/* 4 Decorative 3D Corner Anchors sliding in from sides with staggered FadeIn */}
        <div className="absolute top-8 left-4 sm:left-8 pointer-events-none z-10 hidden md:block">
          <FadeIn delay={0.1} x={-30} y={0}>
            <Anchor3D name="about-torus" className="w-28 h-28 lg:w-36 lg:h-36" />
          </FadeIn>
        </div>

        <div className="absolute top-8 right-4 sm:right-8 pointer-events-none z-10 hidden md:block">
          <FadeIn delay={0.2} x={30} y={0}>
            <Anchor3D name="about-gyro" className="w-28 h-28 lg:w-36 lg:h-36" />
          </FadeIn>
        </div>

        <div className="absolute bottom-8 left-4 sm:left-8 pointer-events-none z-10 hidden md:block">
          <FadeIn delay={0.3} x={-30} y={0}>
            <Anchor3D name="about-blocks" className="w-28 h-28 lg:w-36 lg:h-36" />
          </FadeIn>
        </div>

        <div className="absolute bottom-8 right-4 sm:right-8 pointer-events-none z-10 hidden md:block">
          <FadeIn delay={0.4} x={30} y={0}>
            <Anchor3D name="about-noise-sphere" className="w-28 h-28 lg:w-36 lg:h-36" />
          </FadeIn>
        </div>

        {/* Central Editorial Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
          <FadeIn delay={0.1}>
            <span className="font-mono text-xs uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3.5 py-1.5 rounded-full inline-block">
              About &bull; System Architecture
            </span>
          </FadeIn>

          <GradientHeading
            text="ENGINEERING SYSTEMS WITH RESILIENCE"
            as="h2"
            delay={0.15}
            className="text-3xl sm:text-5xl lg:text-6xl text-center justify-center font-black"
          />

          {/* Character-by-Character Scroll-Reveal Paragraph */}
          <div className="pt-4 max-w-3xl mx-auto">
            <AnimatedText
              text={PERSONAL_INFO.bio}
              className="text-lg sm:text-2xl text-slate-200 font-medium leading-relaxed tracking-tight"
              offset={['start 0.85', 'end 0.35']}
            />
          </div>

          {/* Telemetry Stats Bar */}
          <FadeIn delay={0.4} className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-bold text-sky-400 font-mono">3+</span>
                <span className="block text-[11px] font-mono text-slate-400 mt-1 uppercase">Shipped Apps</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-bold text-violet-400 font-mono">97</span>
                <span className="block text-[11px] font-mono text-slate-400 mt-1 uppercase">PG Tables</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">+27</span>
                <span className="block text-[11px] font-mono text-slate-400 mt-1 uppercase">Lighthouse Gain</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">91+</span>
                <span className="block text-[11px] font-mono text-slate-400 mt-1 uppercase">Vitest Specs</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* =========================================================================
          PATTERN 6: NUMBERED SERVICES / DISCIPLINES ON LIGHT INVERTED SECTION
          Huge 01-05 numerals, uppercase title, muted description, hairline dividers,
          on light section with rounded-t-[60px] that overlaps the dark section.
      ========================================================================= */}
      <section data-testid="section-services" className="relative w-full bg-[#f8fafc] text-slate-900 rounded-t-[48px] sm:rounded-t-[60px] pt-20 sm:pt-28 pb-24 px-4 sm:px-8 lg:px-16 shadow-[0_-20px_50px_rgba(0,0,0,0.4)] z-30">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Inverted Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-300 pb-8">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
                02 &bull; Core Disciplines
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 uppercase">
                Technical Capabilities
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-md font-normal leading-relaxed">
              Modern full-stack architecture, distributed systems, and AI orchestration delivered with verified benchmarks.
            </p>
          </div>

          {/* Numbered Services List: Huge 01-05 Numerals + Hairline Dividers */}
          <div className="divide-y divide-slate-200">
            {SKILL_CATEGORIES.map((category, idx) => {
              const num = String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={category.id}
                  className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start group hover:bg-slate-100/60 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-2xl transition-colors duration-300"
                >
                  {/* Huge Numeral */}
                  <div className="lg:col-span-2 font-mono text-4xl sm:text-6xl font-black text-slate-500 group-hover:text-sky-700 transition-colors">
                    {num}
                  </div>

                  {/* Title & Badge */}
                  <div className="lg:col-span-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-950 tracking-tight">
                        {category.name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-semibold text-sky-700 uppercase tracking-wider">
                      {category.badge}
                    </span>
                  </div>

                  {/* Skills Pills Flow */}
                  <div className="lg:col-span-6 flex flex-wrap gap-2 pt-1">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-full bg-white text-slate-800 font-mono text-xs font-medium border border-slate-200 shadow-sm pressable"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Pitch inside Inverted Section */}
          <div className="pt-8 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-950">
                Ready to deploy these capabilities to your engineering team?
              </h3>
              <p className="text-sm text-slate-600">
                Full-time software engineering role &bull; Remote or Dhaka, Bangladesh
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PillButton data-testid="cta-schedule-interview" onClick={() => onNavigate('contact')}>
                <span>Schedule Interview</span>
                <ArrowRight className="w-4 h-4" />
              </PillButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
