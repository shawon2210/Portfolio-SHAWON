import React, { useState } from 'react';
import {
  FileText,
  Printer,
  X,
  Camera,
  Mail,
  Briefcase,
  GraduationCap,
  Terminal,
  Award,
  Send,
} from 'lucide-react';
import { PERSONAL_INFO, WORK_EXPERIENCE, EDUCATION_LIST, CERTIFICATES, SKILL_CATEGORIES } from '../data/portfolioData';
import { useModalA11y } from '../hooks/useModalA11y';

interface ResumeModalProps {
  isOpen: boolean;
  avatarUrl: string;
  onClose: () => void;
  onOpenUploadModal: () => void;
  onShowToast: (msg: string) => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  avatarUrl,
  onClose,
  onOpenUploadModal,
  onShowToast,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  useModalA11y(isOpen, onClose);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    onShowToast('Email copied to clipboard!');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const total = target.scrollHeight - target.clientHeight;
    if (total > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (target.scrollTop / total) * 100)));
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface-container rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-surface-container-high">
          <div className="flex items-center gap-2.5">
            <FileText className="text-primary w-5 h-5" />
            <div>
              <h2 id="resume-modal-title" className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                Curriculum Vitae — MD Shawon Molla
              </h2>
              <span className="font-code-sm text-xs text-on-surface-variant">
                Full-Stack &amp; AI Integration Focus · Updated 2025/2026
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface hover:text-primary transition-colors cursor-pointer"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Progress Bar */}
        <div className="w-full h-[2.5px] bg-white/5 relative overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary-fixed to-secondary transition-all duration-75 shadow-[0_0_8px_rgba(76,215,246,0.6)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Scrollable Body */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm"
        >
          {/* Header Info */}
          <div className="border-b border-white/10 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center sm:items-start gap-4">
                <div
                  onClick={import.meta.env.DEV ? onOpenUploadModal : undefined}
                  className={`relative shrink-0 ${import.meta.env.DEV ? 'group cursor-pointer' : ''}`}
                  title={import.meta.env.DEV ? 'Click to change photo' : undefined}
                >
                  <img
                    src={avatarUrl}
                    alt={PERSONAL_INFO.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover object-top ring-2 ring-primary/40 shadow-lg group-hover:ring-primary transition-all"
                  />
                  {import.meta.env.DEV && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-primary">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface">
                    MD SHAWON MOLLA
                  </h1>
                  <p className="text-primary font-medium mt-0.5 text-xs sm:text-sm">{PERSONAL_INFO.title}</p>
                  <p className="text-on-surface-variant text-xs mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>{PERSONAL_INFO.location}</span>
                    <span>•</span>
                    <span>{PERSONAL_INFO.email}</span>
                    <span>•</span>
                    <span>{PERSONAL_INFO.phone}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-code-sm text-xs font-semibold hover:bg-primary-container transition-colors inline-flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:text-primary font-code-sm text-xs transition-colors"
                >
                  Copy Email
                </button>
              </div>
            </div>
            <p className="mt-3 text-on-surface-variant leading-relaxed text-xs sm:text-sm">
              {PERSONAL_INFO.bio}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="font-code-md text-primary font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Work &amp; Apprenticeship</span>
            </h3>
            <div className="space-y-4">
              {WORK_EXPERIENCE.map((exp) => (
                <div key={exp.id} className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">{exp.role}</span>
                      <span className="text-on-surface-variant text-xs">@ {exp.company}</span>
                    </div>
                    <span className="font-code-sm text-xs text-primary">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-on-surface-variant text-xs mt-2">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-code-md text-primary font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Credentials</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EDUCATION_LIST.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="font-status-label text-[10px] text-primary uppercase font-bold">{edu.level}</span>
                  <h4 className="font-bold text-on-surface text-sm mt-0.5">{edu.degree}</h4>
                  <p className="text-on-surface-variant text-xs mt-0.5">{edu.institution}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs font-code-sm">
                    <span className="text-on-surface-variant">{edu.period}</span>
                    <span className="text-secondary font-bold">{edu.gradeLabel}: {edu.gradeValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div>
            <h3 className="font-code-md text-primary font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Technical Stack &amp; Tooling</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.id} className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-xs font-semibold text-primary">{cat.name}</span>
                  <p className="text-on-surface-variant text-xs mt-1">
                    {cat.skills.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div>
            <h3 className="font-code-md text-primary font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </h3>
            <div className="space-y-2">
              {CERTIFICATES.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-white/5 text-xs">
                  <div>
                    <span className="font-semibold text-on-surface">{cert.title}</span>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">{cert.issuer}</p>
                  </div>
                  <span className="font-code-sm text-secondary shrink-0">{cert.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/10 bg-surface-container-high">
          <span className="font-code-sm text-xs text-on-surface-variant">MD_Shawon_Molla_Resume.pdf (142 KB)</span>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${PERSONAL_INFO.email}?subject=Interview%20Request%20-%20MD%20Shawon%20Molla`}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-code-sm text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send Interview Invite</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
