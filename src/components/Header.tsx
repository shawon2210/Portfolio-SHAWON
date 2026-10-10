import React from 'react';
import { motion } from 'motion/react';
import { FileText, Terminal, Camera } from 'lucide-react';
import { TabType } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { AppIcon } from './AppIcon';

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

        {/* Desktop Navigation links with smooth sliding active pill */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          {(['home', 'projects', 'experience', 'contact'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onSelectTab(tab)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize cursor-pointer ${
                  isActive ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_12px_rgba(76,215,246,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <button
            onClick={onOpenResume}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-semibold text-primary border border-primary/20 hover:border-primary/40 transition-all cursor-pointer shadow-sm"
            title="Inspect CV Resume"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV Resume</span>
          </button>

          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
            title="GitHub Profile"
            aria-label="GitHub Profile"
          >
            <AppIcon name="code" className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenTerminal}
            className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
            title="Launch Terminal CLI"
            aria-label="Launch interactive terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {import.meta.env.DEV ? (
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
                <Camera className="w-3.5 h-3.5" />
              </span>
            </button>
          ) : (
            <div className="relative rounded-full flex-shrink-0">
              <img
                alt="MD Shawon Molla Profile"
                className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-primary/40 flex-shrink-0"
                src={avatarUrl}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
