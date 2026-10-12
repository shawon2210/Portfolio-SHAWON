import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FileText, Github, Sparkles } from 'lucide-react';
import { TabType } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useLoadPhase } from '../lib/loadPhase';
import { TRANSITION_INTERACTIVE } from '../lib/motion';

interface HeaderProps {
  activeTab: TabType;
  avatarUrl: string;
  onSelectTab: (tab: TabType) => void;
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenUploadModal: () => void;
  onPrintPortfolio: () => void;
}

const NAV_ITEMS: { id: TabType; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenResume,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { at } = useLoadPhase();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // PHASE 5: the nav drops in on the shared choreography clock rather than
  // rendering statically and then being animated by a second timer.
  const navDelay = at('nav');

  return (
    <motion.header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-300 pt-[max(env(safe-area-inset-top),0px)] ${
        scrolled ? 'py-2 sm:py-2.5' : 'py-3 sm:py-4'
      }`}
      role="banner"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : navDelay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex items-center justify-between gap-3 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090b11]/85 backdrop-blur-2xl border border-white/[0.08] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] mx-3 sm:mx-6 px-4 py-2'
            : 'bg-transparent'
        }`}
      >
        {/* Editorial Brand Lockup: Monogram + Name + Live Status */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 group flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-full cursor-pointer text-left pressable"
          /* PHASE 5: the accessible name is derived from the visible text plus a
             visually-hidden suffix. An `aria-label` here previously hid both the
             monogram and "Shawon.dev" from the name, failing WCAG 2.5.3
             Label-in-Name for voice-control users. */
          data-cursor="link"
        >
          {/* Monogram Badge */}
          <div className="relative w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center group-hover:border-sky-400/50 group-hover:bg-sky-500/10 transition-all duration-300">
            <span aria-hidden="true" className="font-mono text-xs font-bold text-sky-400 tracking-tighter">
              SM
            </span>
            {/* Live emerald pulse indicator */}
            <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-mono text-xs font-semibold text-slate-200 tracking-tight group-hover:text-white transition-colors">
              Shawon.dev
            </span>
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase hidden sm:block">
              Open to Work
            </span>
          </div>

          {/* Purpose, exposed to assistive tech without adding visible text */}
          <span className="sr-only">, go to home</span>
        </button>

        {/* Desktop Floating Pill Nav with Spring layoutId Indicator */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-white/[0.03] backdrop-blur-md px-1.5 py-1 rounded-full border border-white/[0.07]"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                data-testid={`nav-${id}`}
                onClick={() => onSelectTab(id)}
                aria-current={isActive ? 'page' : undefined}
                data-cursor="link"
                className={`tap-pill relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 pressable ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="headerActiveTab"
                    className="absolute inset-0 bg-sky-400 rounded-full shadow-[0_0_16px_rgba(56,189,248,0.45)]"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : TRANSITION_INTERACTIVE
                    }
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Resume CTA + GitHub Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {import.meta.env.DEV && (
            <a
              href="#dev-ui"
              className="tap-pill hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-400 hover:text-sky-300 hover:border-sky-500/30 transition-all pressable"
              title="Design System /dev/ui"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>/dev/ui</span>
            </a>
          )}

          <button
            onClick={onOpenResume}
            className="tap-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-sky-500/15 text-xs font-semibold text-sky-400 border border-sky-500/25 hover:border-sky-500/50 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 pressable"
            aria-label="View CV Resume"
            data-cursor="link"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV Resume</span>
          </button>

          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 pressable"
            aria-label="GitHub Profile"
            title="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.header>
  );
};
