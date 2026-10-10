import React from 'react';
import { TabType } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeaderProps {
  activeTab: TabType;
  avatarUrl: string;
  onSelectTab: (tab: TabType) => void;
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenUploadModal: () => void;
  onPrintPortfolio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  avatarUrl,
  onSelectTab,
  onOpenTerminal,
  onOpenResume,
  onOpenUploadModal,
  onPrintPortfolio,
}) => {
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'home':
        return 'Home';
      case 'projects':
        return 'Projects';
      case 'experience':
        return 'Experience';
      case 'contact':
        return 'Contact';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.25)] border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand identity lockup */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 min-w-0 cursor-pointer select-none group"
        >
          <img
            alt="Shawon Molla Dev Logo"
            className="h-8 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
            src={PERSONAL_INFO.logoUrl}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-code-md text-primary font-bold tracking-tight truncate group-hover:text-primary-fixed transition-colors">
                Shawon.dev
              </span>
              <span className="font-body-sm text-on-surface-variant hidden sm:inline">/</span>
              <span className="font-body-sm text-on-surface truncate hidden sm:inline capitalize font-medium">
                {getTabLabel(activeTab)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-status-label text-secondary tracking-wide uppercase text-[10px] sm:text-[11px] font-semibold">
                Open to Work
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container-low/70 px-2 py-1 rounded-full border border-white/5">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('projects')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => onSelectTab('experience')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'experience'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => onSelectTab('contact')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'contact'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <button
            onClick={onPrintPortfolio}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-semibold text-on-surface hover:text-primary border border-white/10 transition-colors cursor-pointer"
            title="Print Portfolio Dossier (Projects & Experience)"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span className="hidden sm:inline">Print Portfolio</span>
          </button>

          <button
            onClick={onOpenResume}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-semibold text-primary border border-primary/20 transition-colors cursor-pointer"
            title="Inspect CV Resume"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>CV Resume</span>
          </button>

          <button
            onClick={onOpenTerminal}
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
            title="Launch Terminal CLI"
            aria-label="Launch interactive terminal"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 group cursor-pointer"
            title="Upload / Change Profile Photo"
          >
            <img
              alt="MD Shawon Molla Profile"
              className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-primary/40 group-hover:ring-primary transition-all flex-shrink-0"
              src={avatarUrl}
            />
            <span className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-primary">
              <span className="material-symbols-outlined text-[14px]">photo_camera</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
