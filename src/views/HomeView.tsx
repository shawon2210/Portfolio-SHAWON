import React, { useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { TabType, Project } from '../types';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from '../data/portfolioData';
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
  onSelectProject,
  onShowToast,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const blueprintRef = useRef<HTMLDivElement>(null);

  const amarShopProject = PROJECTS.find((p) => p.id === 'amarshop') || PROJECTS[0];

  const handleScrollToBlueprint = () => {
    blueprintRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.codeFocus);
    setCopiedSnippet(true);
    onShowToast('Snippet copied to clipboard!');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    onShowToast('Email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const videoUrl =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4';

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const childFade = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* =========================================================================
          UNIFIED RESPONSIVE HERO SECTION:
          Background: Full-viewport atmospheric cinematic video with contrast scrims
          Foreground: Merged Executive Profile, Systems Architect identity, Terminal, Telemetry, and CTAs
      ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-6 lg:px-10 xl:px-14 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12">
        {/* Background Video Layer with Responsive Scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <video
              className="w-full h-full object-cover opacity-30 sm:opacity-35 lg:opacity-40 mix-blend-luminosity filter contrast-125 brightness-90"
              autoPlay
              muted
              loop
              playsInline
              src={videoUrl}
            />
          </motion.div>
          {/* Multi-layer semi-transparent scrims for text clarity while preserving 3D background visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#10131a]/60 via-[#10131a]/40 to-[#10131a]/70 z-10" />
          <div className="absolute inset-0 bg-radial-[at_top_right] from-primary/15 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#10131a]/70 to-transparent z-10" />
        </div>

        {/* Top Live Telemetry Bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative z-20 max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-2.5 mb-5 sm:mb-7"
        >
          {/* Left Kicker Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md shadow-sm border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-status-label text-primary text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                Systems Architect &bull; AI Full-Stack
              </span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low/90 backdrop-blur-md text-on-surface font-code-sm text-[10px] sm:text-[11px] border border-white/10">
              <span className="text-primary font-semibold">MD SHAWON MOLLA</span>
              <span className="text-on-surface-variant">&bull;</span>
              <span className="text-on-surface-variant uppercase tracking-wider">SOFTWARE ENGINEER</span>
            </div>
          </div>

          {/* Right Status Badges */}
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md shadow-sm border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-status-label text-secondary tracking-wide uppercase text-[10px] sm:text-[11px] font-semibold">
                Open for Full-Time SWE Roles
              </span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low/90 backdrop-blur-md text-on-surface-variant font-code-sm text-[11px] sm:text-xs border border-white/10">
              <AppIcon name="location_on" className="w-3.5 h-3.5 text-primary" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </motion.div>

        {/* Main Hero Stage: Perfectly Responsive Across Mobile, Tablet, and Desktop */}
        <div className="relative z-20 max-w-6xl w-full mx-auto my-auto py-2 sm:py-4">
          {/* Mobile Profile Banner (Visible on < lg screens for immediate personal connection & responsive flow) */}
          <div className="lg:hidden mb-6 p-4 rounded-2xl bg-surface-container-high/80 backdrop-blur-xl border border-white/15 shadow-xl flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                onClick={import.meta.env.DEV ? onOpenUploadModal : undefined}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-primary/50 shadow-md bg-surface-container-lowest ${
                  import.meta.env.DEV ? 'group cursor-pointer' : ''
                }`}
                title={import.meta.env.DEV ? 'Change Photo' : undefined}
              >
                <img
                  src={avatarUrl}
                  alt="MD Shawon Molla"
                  className="w-full h-full object-cover object-top filter contrast-[1.03]"
                />
                {import.meta.env.DEV && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-primary">
                    <AppIcon name="photo_camera" className="w-5 h-5" />
                  </div>
                )}
              </div>
              {import.meta.env.DEV && (
                <button
                  onClick={onOpenUploadModal}
                  className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-surface-container-high text-primary border border-white/20 flex items-center justify-center shadow transition-all cursor-pointer hover:bg-primary hover:text-on-primary"
                  title="Upload Photo"
                  aria-label="Upload photo"
                >
                  <AppIcon name="upload" className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-surface-container-lowest border border-white/15 flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-status-label text-[9px] text-secondary font-bold uppercase">
                  Active
                </span>
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-code-sm text-[11px] text-primary uppercase tracking-wider font-semibold">
                MD SHAWON MOLLA
              </span>
              <h2 className="text-base sm:text-lg font-bold text-on-surface truncate">
                Junior Software Engineer
              </h2>
              <p className="text-xs text-on-surface-variant font-code-sm truncate">
                Full-Stack Developer &bull; AI Systems
              </p>
              {import.meta.env.DEV && (
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={onOpenUploadModal}
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-code-sm cursor-pointer"
                  >
                    <AppIcon name="photo_camera" className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                  <span className="text-white/20">&bull;</span>
                  <button
                    onClick={onOpenUploadModal}
                    className="inline-flex items-center gap-1 text-[11px] text-secondary hover:underline font-code-sm cursor-pointer"
                  >
                    <AppIcon name="upload" className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              )}

              {/* Mobile Quick Telemetry */}
              <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="font-code-sm text-[11px] font-bold text-primary">97</span>
                  <span className="font-status-label text-[8px] text-on-surface-variant uppercase">PG Tables</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-code-sm text-[11px] font-bold text-secondary">99.9%</span>
                  <span className="font-status-label text-[8px] text-on-surface-variant uppercase">Uptime</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-code-sm text-[11px] font-bold text-tertiary">91+</span>
                  <span className="font-status-label text-[8px] text-on-surface-variant uppercase">Tests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual-Column Master Grid on Desktop, Clean Stack on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            {/* Left Column: Systems Architect & Engineering Thesis */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col items-start text-left w-full"
            >
              {/* Kicker Line */}
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="font-code-sm text-primary tracking-wider uppercase font-semibold text-xs sm:text-sm">
                  Hello World, I'm
                </span>
                <div className="h-[1px] w-8 sm:w-12 bg-primary/40"></div>
                <span className="hidden sm:inline-block font-code-sm text-on-surface-variant text-xs">
                  MD SHAWON MOLLA &bull; SOFTWARE ENGINEER
                </span>
              </div>

              {/* Main Name Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-on-surface tracking-tight leading-[1.08] mb-2">
                MD SHAWON{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed to-secondary">
                  MOLLA
                </span>
              </h1>

              {/* Core Role Title */}
              <p className="font-code-md text-xs sm:text-sm text-primary font-semibold tracking-wide uppercase mb-3">
                Junior Software Engineer &bull; Full-Stack Developer &bull; AI-Integrated Web Applications
              </p>

              {/* The Architectural Headline */}
              <h2 className="text-lg sm:text-2xl font-bold text-on-surface tracking-tight mb-2 text-white">
                Engineering High-Scale Systems &amp; Autonomous AI
              </h2>

              {/* Value Proposition / Architectural Statement */}
              <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4 max-w-xl">
                High-concurrency full-stack platforms, multi-tenant LangChain RAG pipelines, and distributed databases built with mathematical precision.
              </p>

              {/* Interactive Terminal Focus Code Snippet */}
              <div className="w-full max-w-xl p-2.5 sm:p-3 rounded-xl bg-surface-container-lowest/85 backdrop-blur-md flex items-center justify-between gap-2 shadow-inner border border-white/10 mb-5">
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

              {/* Primary Action Button Suite */}
              <div className="w-full flex flex-wrap items-center gap-2.5 sm:gap-3 mb-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('projects')}
                  className="h-11 px-4 sm:px-5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-md font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(76,215,246,0.35)] transition-all cursor-pointer text-xs sm:text-sm grow sm:grow-0"
                >
                  <span>Explore Projects</span>
                  <AppIcon name="arrow_forward" className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenResume}
                  className="h-11 px-4 sm:px-5 rounded-lg bg-surface-container-high/90 hover:bg-surface-bright text-on-surface font-body-md font-medium flex items-center justify-center gap-2 transition-all border border-white/15 cursor-pointer text-xs sm:text-sm backdrop-blur-md grow sm:grow-0"
                >
                  <AppIcon name="download" className="w-4 h-4 text-primary" />
                  <span>Inspect CV Resume</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('contact')}
                  className="h-11 px-3.5 sm:px-4 rounded-lg bg-surface-container-low/80 hover:bg-surface-container text-on-surface-variant hover:text-primary font-body-sm font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/10 cursor-pointer text-xs sm:text-sm backdrop-blur-md grow sm:grow-0"
                >
                  <AppIcon name="mail" className="w-4 h-4 text-secondary" />
                  <span>Initiate Collaboration &amp; Contact</span>
                </motion.button>
              </div>

              {/* Verified Presence / Social Links */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full pb-1">
                <a
                  className="h-8 px-3 rounded-full bg-surface-container-high/80 backdrop-blur-md text-on-surface hover:text-primary font-code-sm text-[11px] flex items-center gap-1.5 border border-white/10 hover:border-primary/30 transition-all shrink-0"
                  href={PERSONAL_INFO.githubUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AppIcon name="code" className="w-3.5 h-3.5 text-primary" />
                  <span>github.com/shawon2210</span>
                  <AppIcon name="open_in_new" className="w-3 h-3 text-on-surface-variant" />
                </a>

                <a
                  className="h-8 px-3 rounded-full bg-surface-container-high/80 backdrop-blur-md text-on-surface hover:text-primary font-code-sm text-[11px] flex items-center gap-1.5 border border-white/10 hover:border-primary/30 transition-all shrink-0"
                  href={PERSONAL_INFO.linkedinUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AppIcon name="badge" className="w-3.5 h-3.5 text-tertiary" />
                  <span>linkedin.com/in/shawon</span>
                  <AppIcon name="open_in_new" className="w-3 h-3 text-on-surface-variant" />
                </a>

                <a
                  className="h-8 px-3 rounded-full bg-surface-container-high/80 backdrop-blur-md text-on-surface hover:text-secondary font-code-sm text-[11px] flex items-center gap-1.5 border border-white/10 hover:border-secondary/30 transition-all shrink-0"
                  href={PERSONAL_INFO.liveAppUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AppIcon name="rocket_launch" className="w-3.5 h-3.5 text-secondary" />
                  <span>oddboundary.lovable.app</span>
                  <AppIcon name="open_in_new" className="w-3 h-3 text-on-surface-variant" />
                </a>
              </div>
            </motion.div>

            {/* Right Column: Executive Profile Card & Telemetry Lockup (Hidden on mobile, desktop master showcase) */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center w-full"
            >
              <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-surface-container-high/85 via-surface-container/75 to-surface-container-low/90 backdrop-blur-xl p-5 sm:p-6 border border-white/15 shadow-2xl flex flex-col items-center text-center">
                {/* Corner Ambient Glow */}
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top Card Badge */}
                <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-white/10 text-xs">
                  <span className="font-code-sm text-[11px] text-primary font-semibold tracking-wider uppercase">
                    Executive Dossier
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-status-label text-[10px] font-bold">
                    Verified SWE
                  </span>
                </div>

                {/* Portrait Container with Interactive Upload Trigger */}
                <div className={`relative mb-4 ${import.meta.env.DEV ? 'group' : ''}`}>
                  <div
                    onClick={import.meta.env.DEV ? onOpenUploadModal : undefined}
                    className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden ring-4 ring-primary/40 shadow-2xl transition-all duration-300 bg-surface-container-lowest ${
                      import.meta.env.DEV ? 'group-hover:ring-primary cursor-pointer' : ''
                    }`}
                    title={import.meta.env.DEV ? 'Click to upload/change photo' : undefined}
                  >
                    <img
                      src={avatarUrl}
                      alt="MD Shawon Molla"
                      className="w-full h-full object-cover object-top filter contrast-[1.03] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Hover Camera Overlay */}
                    {import.meta.env.DEV && (
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-primary font-code-sm text-[11px]">
                        <AppIcon name="photo_camera" className="w-[26px] h-[26px]" />
                        <span>Change Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Upload Badge Button */}
                  {import.meta.env.DEV && (
                    <button
                      onClick={onOpenUploadModal}
                      className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary border border-white/15 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                      title="Upload custom photo"
                      aria-label="Upload photo"
                    >
                      <AppIcon name="upload" className="w-4 h-4" />
                    </button>
                  )}

                  {/* Online Status Marker */}
                  <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md border border-white/15 flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="font-status-label text-[10px] text-secondary font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <h2 className="text-xl font-bold text-on-surface mb-0.5">MD Shawon Molla</h2>
                <p className="text-xs text-on-surface-variant font-code-sm mb-4">
                  Full-Stack Systems &amp; Autonomous AI
                </p>

                {/* Quick Telemetry Grid in Card */}
                <div className="grid grid-cols-3 gap-2 w-full p-2.5 rounded-xl bg-surface-container-lowest/80 border border-white/10 mb-4">
                  <div className="flex flex-col">
                    <span className="font-code-md text-xs sm:text-sm font-bold text-primary">97</span>
                    <span className="font-status-label text-[9px] text-on-surface-variant uppercase">PG Tables</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-code-md text-xs sm:text-sm font-bold text-secondary">99.9%</span>
                    <span className="font-status-label text-[9px] text-on-surface-variant uppercase">Uptime</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-code-md text-xs sm:text-sm font-bold text-tertiary">91+</span>
                    <span className="font-status-label text-[9px] text-on-surface-variant uppercase">Tests</span>
                  </div>
                </div>

                {/* Action Inside Card */}
                <div className="w-full grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="py-2 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-code-sm text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <AppIcon name="send" className="w-[15px] h-[15px]" />
                    <span>Interview</span>
                  </button>
                  <button
                    onClick={handleCopyEmail}
                    className="py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-code-sm text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-white/10"
                  >
                    {copiedEmail ? (
                      <AppIcon name="check" className="w-[15px] h-[15px]" />
                    ) : (
                      <AppIcon name="content_copy" className="w-[15px] h-[15px]" />
                    )}
                    <span>{copiedEmail ? 'Copied' : 'Email'}</span>
                  </button>
                </div>
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
              Scroll For System Blueprint
            </span>
            <AppIcon name="keyboard_arrow_down" className="w-5 h-5 animate-bounce text-primary" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SYSTEMS BLUEPRINT & TECHNICAL PRESENCE
      ========================================================================= */}
      <div
        ref={blueprintRef}
        className="flex flex-col w-full pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-10"
      >
        {/* Interactive 3D Spatial Canvas Section */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative z-10 mb-8"
        >
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <AppIcon name="view_in_ar" className="text-primary w-5 h-5" />
              <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
                Interactive 3D System Lattice
              </h2>
            </div>
            <span className="font-code-sm text-xs text-secondary bg-secondary/10 px-2.5 py-0.5 rounded border border-secondary/20">
              Three.js WebGL &bull; Orbit Control
            </span>
          </div>

          <Suspense
            fallback={
              <div className="h-64 sm:h-72 w-full rounded-2xl bg-surface-container-low/50 animate-pulse border border-white/5 flex items-center justify-center text-on-surface-variant font-code-sm text-xs">
                Initializing 3D Lattice...
              </div>
            }
          >
            <TechCanvas3D className="h-64 sm:h-72 w-full" variant="hero" />
          </Suspense>
        </motion.div>

        {/* Professional Summary Panel (Engineering Blueprint) */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative z-10 p-5 sm:p-6 rounded-2xl bg-surface-container-low backdrop-blur-md shadow-lg mb-8 flex flex-col gap-4 border border-white/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
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

        {/* Featured Flagship Project Hero Teaser */}
        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative z-10 mb-8"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <AppIcon name="stars" className="text-primary w-5 h-5" />
              <h2 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
                Flagship Engineering
              </h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="font-code-sm text-xs text-primary hover:text-primary-fixed transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              <span>Explore all 6+</span>
              <AppIcon name="arrow_forward" className="w-3.5 h-3.5" />
            </button>
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden bg-surface-container-low shadow-xl border border-white/5 hover:border-primary/20 transition-colors"
          >
            {/* Visual Project Header Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                alt="AmarShop Dashboard Mockup"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf4L9HpVKHS0Ipzz4Bznk-gbCuqdn18DgrOvuWbEg4PRBp65xZfZly3mM0PnT3RfyGCXWOa182h_b1UyI6CFkn6kt7RF6-ID9T_xQBCJvkZECC6VHmumDLNpr6GHzZoKipx5p2_ogUy7dr28KOo1Qqo8UXYGCCXW5MCc2JAcS5lR2B6LwuF6yZX1d127djDlijAmuW4V9RmE6E01ZpOCxczmQj7hp-cxg4zMXDOyITtD6Fh7edF38"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/60 to-transparent"></div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-status-label text-[10px] text-secondary uppercase font-semibold">
                  Production Ready
                </span>
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center gap-1 text-on-surface font-code-sm text-xs">
                <AppIcon name="speed" className="w-3.5 h-3.5 text-primary" />
                <span>99.9% Uptime</span>
              </div>
            </div>

            {/* Project Details Body */}
            <div className="p-5 sm:p-6 flex flex-col gap-3">
              <div>
                <span className="font-code-sm text-xs text-primary font-semibold tracking-wide uppercase">
                  ENTERPRISE ARCHITECTURE
                </span>
                <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-bold mt-0.5">
                  AmarShop — Multi-Vendor E-Commerce
                </h3>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                High-concurrency digital marketplace supporting distributed vendors, isolated cart caches, transaction locks, and comprehensive inventory pipelines scaled across 97 normalized tables.
              </p>

              {/* Core Project Stack Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary font-code-sm text-xs border border-white/5">
                  Next.js 16
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-secondary font-code-sm text-xs border border-white/5">
                  NestJS 11
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-tertiary font-code-sm text-xs border border-white/5">
                  Redis Cache
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-code-sm text-xs border border-white/5">
                  PostgreSQL
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-high text-primary-fixed font-code-sm text-xs border border-white/5">
                  97-Table Schema
                </span>
              </div>

              {/* Bottom Action Deck */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(amarShopProject)}
                  className="font-code-md text-xs sm:text-sm text-primary hover:text-primary-fixed flex items-center gap-1 font-semibold group cursor-pointer"
                >
                  <span>Inspect Case Study &amp; Metrics</span>
                  <AppIcon
                    name="arrow_forward"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <div className="flex items-center gap-2">
                  {amarShopProject.liveUrl && (
                    <a
                      href={amarShopProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary/15 hover:bg-primary/25 text-primary text-xs font-code-sm font-semibold transition-colors border border-primary/20"
                      title="Open Live App"
                    >
                      <AppIcon name="rocket_launch" className="w-3.5 h-3.5" />
                      <span>Live App</span>
                    </a>
                  )}
                  <button
                    onClick={() => onSelectProject(amarShopProject)}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                    title="Quick inspect"
                  >
                    <AppIcon name="visibility" className="w-5 h-5" />
                  </button>
                  <a
                    href="https://github.com/shawon2210/AMAR-Shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                    title="View source"
                  >
                    <AppIcon name="terminal" className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
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
                Technical Stack
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
                Hiring for your team?
              </span>
            </div>
            <span className="font-code-sm text-xs text-secondary bg-surface-container-lowest px-2 py-0.5 rounded">
              Fast Learner
            </span>
          </div>
          <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            I am eager to contribute clean, production-grade PRs, handle backend migrations, and build modern React/Next.js interfaces from day one. Let's build something remarkable.
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
              {copiedEmail ? (
                <AppIcon name="check" className="w-4 h-4" />
              ) : (
                <AppIcon name="content_copy" className="w-4 h-4" />
              )}
              <span>{copiedEmail ? 'Copied!' : 'Email'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
