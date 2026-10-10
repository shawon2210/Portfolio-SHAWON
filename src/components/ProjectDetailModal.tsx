import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onShowToast,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  if (!project) return null;

  // Calculate estimated reading time based on full architectural text
  const fullContent = [
    project.title,
    project.tagline,
    project.architectureDetails?.overview || '',
    ...(project.architectureDetails?.keyDecisions || []),
    ...project.highlights.map((h) => `${h.title || ''} ${h.description}`),
    ...project.techStack,
  ].join(' ');

  const wordCount = fullContent.trim().split(/\s+/).filter(Boolean).length;
  // Technical specification reading speed: ~180 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${project.githubUrl}.git`);
    onShowToast('Git clone command copied to clipboard!');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const total = target.scrollHeight - target.clientHeight;
    if (total > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (target.scrollTop / total) * 100)));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface-container rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-surface-container-high">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[22px]">code_blocks</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-code-sm text-xs text-primary font-bold uppercase tracking-wider">
                  {project.flagshipNumber || 'Project Architecture'}
                </span>
                <span className="text-on-surface-variant text-[11px] font-code-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-secondary">schedule</span>
                  <span>{readingTimeMinutes} min read</span>
                </span>
              </div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mt-0.5">
                {project.title}
              </h2>
              <div className="flex items-center gap-1.5 text-on-surface-variant font-code-sm text-[11px] mt-0.5">
                <span>{wordCount} words</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span>Technical Architecture Spec</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scroll Progress Bar */}
        <div className="w-full h-[2.5px] bg-white/5 relative overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary-fixed to-secondary transition-all duration-75 shadow-[0_0_8px_rgba(76,215,246,0.6)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Scrollable Content */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm"
        >
          {project.imageUrl && (
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/5">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur text-xs font-code-sm text-secondary">
                  {project.badge}
                </span>
                <span className="px-2.5 py-1 rounded bg-surface-container-lowest/80 backdrop-blur text-xs font-code-sm text-primary">
                  {project.versionOrEndpoint}
                </span>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-on-surface text-base">Summary</h3>
              <span className="font-code-sm text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">menu_book</span>
                <span>Est. {readingTimeMinutes} min read</span>
              </span>
            </div>
            <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-container-low border border-white/5">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-code-md text-primary font-bold">{m.value}</span>
                <span className="font-status-label text-[10px] text-on-surface-variant uppercase tracking-wider">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Architecture Details */}
          {project.architectureDetails && (
            <div className="space-y-3">
              <h3 className="font-code-sm text-xs text-primary font-bold uppercase tracking-wider">
                Engineering Architecture
              </h3>
              <p className="text-on-surface-variant text-xs leading-relaxed bg-surface-container-low p-3 rounded-lg border border-white/5">
                {project.architectureDetails.overview}
              </p>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-on-surface">Architectural Decisions:</span>
                <ul className="space-y-1.5 text-xs text-on-surface-variant">
                  {project.architectureDetails.keyDecisions.map((decision, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                        check
                      </span>
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Highlights */}
          <div className="space-y-2.5">
            <h3 className="font-code-sm text-xs text-secondary font-bold uppercase tracking-wider">
              Core Technical Highlights
            </h3>
            <div className="space-y-2">
              {project.highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container-low border border-white/5 text-xs"
                >
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                    {h.icon}
                  </span>
                  <div>
                    {h.title && (
                      <span className="font-semibold text-on-surface mr-1">{h.title}:</span>
                    )}
                    <span className="text-on-surface-variant">{h.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="font-code-sm text-xs text-tertiary font-bold uppercase tracking-wider">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-code-sm text-xs border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Clone snippet */}
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 font-code-sm text-xs text-on-surface-variant truncate">
              <span className="text-secondary">$</span>
              <span className="truncate">git clone {project.githubUrl}.git</span>
            </div>
            <button
              onClick={handleCopyClone}
              className="p-1.5 rounded text-on-surface-variant hover:text-primary transition-colors shrink-0"
              title="Copy Clone Command"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 py-3.5 border-t border-white/10 bg-surface-container-high">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-code-sm text-xs font-semibold transition-all shadow-sm shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                <span>Open Live App</span>
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-code-sm text-xs font-semibold transition-colors border border-white/5"
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span>GitHub Repo</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-code-sm text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
