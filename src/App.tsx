/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { TabType, Project } from './types';
import { PERSONAL_INFO } from './data/portfolioData';
import { Header } from './components/Header';
import { FloatingDock } from './components/FloatingDock';
import { Toast } from './components/Toast';
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';
import { HomeView } from './views/HomeView';
import { updateSectionSEO, updateProjectSEO } from './utils/seo';
import { MotionConfig, LazyMotion, domAnimation } from 'motion/react';
import { LoadPhaseProvider, useLoadPhase } from './lib/loadPhase';
import { usePrefersReducedMotion, EASE_MICRO } from './lib/motion';
import { scrollWindowTo, cancelScrollTween, installScrollInterruption, HEADER_OFFSET } from './lib/scroll';

// Lazy-loaded secondary views and interactive modals to minimize initial JS bundle
const ProjectsView = lazy(() =>
  import('./views/ProjectsView').then((m) => ({ default: m.ProjectsView }))
);
const ExperienceView = lazy(() =>
  import('./views/ExperienceView').then((m) => ({ default: m.ExperienceView }))
);
const ContactView = lazy(() =>
  import('./views/ContactView').then((m) => ({ default: m.ContactView }))
);

const ResumeModal = lazy(() =>
  import('./components/ResumeModal').then((m) => ({ default: m.ResumeModal }))
);
const ProjectDetailModal = lazy(() =>
  import('./components/ProjectDetailModal').then((m) => ({ default: m.ProjectDetailModal }))
);
const TerminalModal = lazy(() =>
  import('./components/TerminalModal').then((m) => ({ default: m.TerminalModal }))
);
const ImageUploadModal = lazy(() =>
  import('./components/ImageUploadModal').then((m) => ({ default: m.ImageUploadModal }))
);
const PrintablePortfolio = lazy(() =>
  import('./components/PrintablePortfolio').then((m) => ({ default: m.PrintablePortfolio }))
);

// Code-generated 3D background scene, lazy-loaded to prevent blocking initial paint/LCP
const BackgroundScene = lazy(() => import('./components/BackgroundScene'));

const DevUiShowcase = lazy(() =>
  import('./views/DevUiShowcase').then((m) => ({ default: m.DevUiShowcase }))
);

const DevMotionShowcase = lazy(() =>
  import('./components/DevMotionShowcase').then((m) => ({ default: m.DevMotionShowcase }))
);

const CursorFollower = lazy(() =>
  import('./components/motion/CursorFollower').then((m) => ({ default: m.CursorFollower }))
);


export default function App() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <LoadPhaseProvider reducedMotion={reducedMotion}>
          <PortfolioShell reducedMotion={reducedMotion} />
        </LoadPhaseProvider>
      </LazyMotion>
    </MotionConfig>
  );
}

const PortfolioShell: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const { showPreloader, beginEntrance, phase } = useLoadPhase();

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeProjectCategory, setActiveProjectCategory] = useState<string>('all');
  const activeProjectCategoryRef = useRef<string>('all');
  activeProjectCategoryRef.current = activeProjectCategory;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  // Floating scroll-to-top button visibility (appears past hero section)
  const [showScrollTop, setShowScrollTop] = useState(false);

  // PHASE 5: the app owns programmatic scrolling — opt out of UA smooth-scroll
  // and let our custom curve (which respects reduced motion) drive the page.
  useEffect(() => {
    document.documentElement.classList.add('has-managed-scroll');
    const teardown = installScrollInterruption();
    return () => {
      document.documentElement.classList.remove('has-managed-scroll');
      teardown();
      cancelScrollTween();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero section (approx 450px or 60% of viewport)
      const threshold = Math.min(window.innerHeight * 0.6, 480);
      setShowScrollTop(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    scrollWindowTo(0, { reducedMotion });
  };

  // Custom avatar with localStorage persistence (v2 cache-busted)
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    try {
      localStorage.removeItem('shawon_portfolio_custom_avatar');
      const stored = localStorage.getItem('shawon_portfolio_custom_avatar_v2');
      return stored || PERSONAL_INFO.portraitUrl;
    } catch {
      return PERSONAL_INFO.portraitUrl;
    }
  });

  // DEV-only UI Showcase toggle (?dev=ui or #dev-ui or /dev/ui)
  const [isDevUi, setIsDevUi] = useState(() => {
    if (typeof window === 'undefined') return false;
    const h = window.location.hash.toLowerCase();
    const p = window.location.pathname.toLowerCase();
    const s = window.location.search.toLowerCase();
    return (
      h.startsWith('#dev-ui') ||
      h.startsWith('#dev/ui') ||
      p.endsWith('/dev/ui') ||
      p.endsWith('/dev-ui') ||
      s.includes('dev=ui')
    );
  });

  const [isDevMotion, setIsDevMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const h = window.location.hash.toLowerCase();
    const p = window.location.pathname.toLowerCase();
    const s = window.location.search.toLowerCase();
    return (
      h.startsWith('#dev-motion') ||
      h.startsWith('#dev/motion') ||
      p.endsWith('/dev/motion') ||
      p.endsWith('/dev-motion') ||
      s.includes('dev=motion')
    );
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const h = window.location.hash.toLowerCase();
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      setIsDevUi(
        h.startsWith('#dev-ui') ||
        h.startsWith('#dev/ui') ||
        p.endsWith('/dev/ui') ||
        p.endsWith('/dev-ui') ||
        s.includes('dev=ui')
      );
      setIsDevMotion(
        h.startsWith('#dev-motion') ||
        h.startsWith('#dev/motion') ||
        p.endsWith('/dev/motion') ||
        p.endsWith('/dev-motion') ||
        s.includes('dev=motion')
      );
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Scroll-Spy: detect which section is currently visible in the viewport
  useEffect(() => {
    const sectionIds: TabType[] = ['home', 'projects', 'experience', 'contact'];


    const handleScrollSpy = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollPosition = window.scrollY + 200; // Header & visual offset
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Bottom-of-page check: if scrolled near the bottom, highlight contact
      if (window.scrollY + windowHeight >= fullHeight - 120) {
        setActiveTab('contact');
        updateSectionSEO('contact', activeProjectCategoryRef.current);
        if (window.location.hash !== '#contact') {
          window.history.replaceState(null, '', '#contact');
        }
        return;
      }

      let currentSection: TabType = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSection = id;
          }
        }
      }

      setActiveTab((prev) => {
        if (prev !== currentSection) {
          if (window.location.hash !== `#${currentSection}`) {
            window.history.replaceState(null, '', `#${currentSection}`);
          }
          updateSectionSEO(currentSection, activeProjectCategoryRef.current);
          return currentSection;
        }
        return prev;
      });
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    const timer = setTimeout(handleScrollSpy, 250);

    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      clearTimeout(timer);
    };
  }, []);

  // Handle initial hash navigation on page load
  useEffect(() => {
    const rawHash = window.location.hash.replace('#', '');
    let initialCategory: string | null = null;
    if (rawHash.includes('category=')) {
      const parts = rawHash.split('?');
      const params = new URLSearchParams(parts[1] || '');
      initialCategory = params.get('category');
    } else if (rawHash.startsWith('projects/')) {
      const parts = rawHash.split('/');
      if (['fullstack', 'aiml', 'backend', 'all'].includes(parts[1])) {
        initialCategory = parts[1];
      }
    }

    if (initialCategory && ['all', 'fullstack', 'aiml', 'backend'].includes(initialCategory)) {
      setActiveProjectCategory(initialCategory);
      activeProjectCategoryRef.current = initialCategory;
    }

    const cleanHash = rawHash.split('?')[0].split('/')[0] as TabType;
    if (rawHash.startsWith('dev') || rawHash.includes('dev')) {
      return;
    }
    if (['home', 'projects', 'experience', 'contact'].includes(cleanHash)) {
      setActiveTab(cleanHash);
      updateSectionSEO(cleanHash, activeProjectCategoryRef.current);
      // Wait for the preloader handoff before jumping, otherwise the deep link
      // scrolls against a page that is still behind the curtain.
      const jumpDelay = showPreloader ? 700 : 60;
      setTimeout(() => {
        const element = document.getElementById(cleanHash);
        if (element) {
          const topOffset = element.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
          scrollWindowTo(Math.max(0, topOffset), { reducedMotion });
        }
      }, jumpDelay);
    } else {
      updateSectionSEO('home', activeProjectCategoryRef.current);
    }

    const handlePopState = () => {
      const currentRaw = window.location.hash.replace('#', '');
      const currentHash = currentRaw.split('?')[0].split('/')[0] as TabType;
      if (['home', 'projects', 'experience', 'contact'].includes(currentHash)) {
        handleTabChange(currentHash);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamically synchronize document title and meta tags with active section, category, and modal
  useEffect(() => {
    if (selectedProject) {
      updateProjectSEO(selectedProject);
    } else {
      updateSectionSEO(activeTab, activeProjectCategory);
    }
  }, [activeTab, activeProjectCategory, selectedProject]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    updateSectionSEO(tab, activeProjectCategoryRef.current);
    isProgrammaticScrollRef.current = true;
    window.history.replaceState(null, '', `#${tab}`);

    const element = document.getElementById(tab);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      scrollWindowTo(Math.max(0, topOffset), { reducedMotion });
    } else {
      scrollWindowTo(0, { reducedMotion });
    }

    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 850);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2400);
  };

  const handleUpdateAvatar = (newUrl: string) => {
    setAvatarUrl(newUrl);
    try {
      localStorage.setItem('shawon_portfolio_custom_avatar_v2', newUrl);
    } catch (e) {
      console.warn('Unable to save avatar to localStorage:', e);
    }
    showToast('Profile photo updated successfully!');
  };

  const handleResetAvatar = () => {
    setAvatarUrl(PERSONAL_INFO.portraitUrl);
    try {
      localStorage.removeItem('shawon_portfolio_custom_avatar_v2');
      localStorage.removeItem('shawon_portfolio_custom_avatar');
    } catch (e) {
      console.warn('Unable to remove avatar from localStorage:', e);
    }
    showToast('Reverted to default portrait.');
  };

  const handlePrintPortfolio = () => {
    showToast('Opening print dialog for portfolio dossier...');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  if (isDevUi) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#090b11] text-slate-400 flex items-center justify-center font-mono text-sm">
            Loading Design System Showcase...
          </div>
        }
      >
        <DevUiShowcase />
      </Suspense>
    );
  }

  if (isDevMotion) {
    return (
      <div className="relative min-h-screen bg-transparent">
        <Suspense fallback={null}>
          <BackgroundScene />
        </Suspense>
        <div className="relative z-1">
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#090b11] text-slate-400 flex items-center justify-center font-mono text-sm">
                Loading Motion Engine Showcase...
              </div>
            }
          >
            <DevMotionShowcase />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-on-surface flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* PHASE 5: skippable, once-per-session, hard-capped at 1.15s. It hands
          off into the shared LoadPhase choreography (heading → 3D → nav). */}
      {showPreloader && (
        <Preloader enabled onComplete={beginEntrance} reducedMotion={reducedMotion} />
      )}

      {/* Code-Generated 3D Animated Constellation Background (Canvas wrapper: fixed inset-0 z-0)

          PHASE 5: deferred until the preloader hands off. Three.js is a 537 kB
          chunk whose module evaluation occupies the main thread for hundreds of
          milliseconds; mounting it during the intro starved the preloader's own
          timers and pushed the curtain from 1.0s out to ~2.1s on a 4x-throttled
          CPU. Mounting it as the curtain lifts keeps the intro honest and the
          scene still resolves on the choreography's `scene` slot. */}
      {phase !== 'idle' && (
        <Suspense fallback={null}>
          <BackgroundScene />
        </Suspense>
      )}

      {/* Page Content Wrapper: relative z-1 with pointer-events-auto */}
      <div className="relative z-1 flex flex-col min-h-screen w-full bg-transparent">
        {/* PHASE 5: scroll progress rail + percentage readout */}
        <ScrollProgress showReadout />

        {/* Contextual Cursor Follower — desktop only, disabled on touch/reduced motion */}
        <Suspense fallback={null}>
          <CursorFollower />
        </Suspense>

        {/* Toast feedback */}
        <Toast message={toastMessage} />

        {/* Top sticky header with active scroll-spy location feedback */}
        <Header
          activeTab={activeTab}
          avatarUrl={avatarUrl}
          onSelectTab={handleTabChange}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onPrintPortfolio={handlePrintPortfolio}
        />

{/* Main Content Area: Continuous Sections with Scroll-Spy Integration
            MOBILE-FIRST v4: `data-testid` hooks on every section boundary so the
            responsive/a11y suites select stable nodes instead of matching on
            class names, which change whenever the layout is restyled. */}
        <main className="flex-1 pt-16 flex flex-col w-full relative bg-transparent" data-testid="main-content">
          <section id="home" data-testid="section-home" className="scroll-mt-16 w-full bg-transparent">
            <HomeView
              avatarUrl={avatarUrl}
              onNavigate={handleTabChange}
              onOpenResume={() => setIsResumeOpen(true)}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onSelectProject={(project) => setSelectedProject(project)}
              onShowToast={showToast}
              reducedMotion={reducedMotion}
            />
          </section>

          <section id="projects" data-testid="section-projects" className="scroll-mt-16 w-full border-t border-white/5 bg-transparent">
            <Suspense fallback={<div data-testid="loading-projects" className="min-h-[400px] flex items-center justify-center text-on-surface-variant font-code-sm text-xs">Loading projects catalog...</div>}>
              <ProjectsView
                onNavigate={handleTabChange}
                onSelectProject={(project) => setSelectedProject(project)}
                onShowToast={showToast}
                activeCategory={activeProjectCategory}
                onCategoryChange={(cat) => {
                  setActiveProjectCategory(cat);
                  activeProjectCategoryRef.current = cat;
                  if (activeTab === 'projects') {
                    updateSectionSEO('projects', cat);
                  }
                }}
              />
            </Suspense>
          </section>

          <section id="experience" data-testid="section-experience" className="scroll-mt-16 w-full border-t border-white/5 bg-transparent">
            <Suspense fallback={<div data-testid="loading-experience" className="min-h-[400px] flex items-center justify-center text-on-surface-variant font-code-sm text-xs">Loading experience...</div>}>
              <ExperienceView
                onNavigate={handleTabChange}
                onShowToast={showToast}
              />
            </Suspense>
          </section>

          <section id="contact" data-testid="section-contact" className="scroll-mt-16 w-full border-t border-white/5 pb-28 md:pb-0 bg-transparent">
            <Suspense fallback={<div data-testid="loading-contact" className="min-h-[400px] flex items-center justify-center text-on-surface-variant font-code-sm text-xs">Loading contact terminal...</div>}>
              <ContactView
                avatarUrl={avatarUrl}
                onOpenResume={() => setIsResumeOpen(true)}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                onShowToast={showToast}
              />
            </Suspense>
          </section>
        </main>

        {/* Floating Dock - Mobile Navigation (md:hidden inside component) */}
        <FloatingDock activeTab={activeTab} onSelectTab={handleTabChange} />


        {/* Floating Circular 'Scroll-To-Top' Button with Glow Effect and Smooth Transition */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 16 }}
              transition={{ duration: 0.28, ease: EASE_MICRO }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleScrollToTop}
              className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-surface-container-high/90 backdrop-blur-xl border border-white/20 text-primary hover:text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_24px_rgba(76,215,246,0.65)] hover:border-primary/60 hover:bg-surface-bright cursor-pointer group focus-ring"
              title="Scroll to top"
              aria-label="Scroll to top of page"
            >
              {/* Subtle radial inner glow backdrop */}
              <div className="absolute inset-0 rounded-full bg-primary/10 group-hover:bg-primary/25 transition-colors pointer-events-none" />
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform duration-200 relative z-10" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Modals - Lazy Loaded & Suspended */}
      <Suspense fallback={null}>
        {isResumeOpen && (
          <ResumeModal
            isOpen={isResumeOpen}
            avatarUrl={avatarUrl}
            onClose={() => setIsResumeOpen(false)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onShowToast={showToast}
          />
        )}

        {isTerminalOpen && (
          <TerminalModal
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            onNavigate={handleTabChange}
            onShowToast={showToast}
          />
        )}

        {isUploadModalOpen && (
          <ImageUploadModal
            isOpen={isUploadModalOpen}
            currentAvatar={avatarUrl}
            onClose={() => setIsUploadModalOpen(false)}
            onUpdateAvatar={handleUpdateAvatar}
            onResetAvatar={handleResetAvatar}
            onShowToast={showToast}
          />
        )}

        {/* Simplified, Clean Print-Optimized View (Active during @media print) */}
        <PrintablePortfolio />
      </Suspense>
    </div>
  );
}
