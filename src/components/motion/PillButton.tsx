import React from 'react';
import { motion } from 'motion/react';
import { Magnet } from './Magnet';

export interface PillButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  magnetic?: boolean;
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  magnetic = true,
}) => {
  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-mono text-xs sm:text-sm font-semibold text-white tracking-wide overflow-hidden shadow-[0_0_20px_-4px_rgba(56,189,248,0.45)] border border-sky-400/40 cursor-pointer transition-all duration-300 group ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9) 0%, rgba(14, 165, 233, 0.95) 50%, rgba(2, 132, 199, 1) 100%)',
      }}
    >
      {/* Inner radial glow */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.35),transparent_70%)] pointer-events-none"
      />

      {/* Shimmer sweep line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-shimmer"
      />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.span>
  );

  const wrapper = href ? (
    <a href={href} onClick={onClick} className="inline-block no-underline">
      {content}
    </a>
  ) : (
    <button onClick={onClick} type="button" className="inline-block bg-transparent border-0 p-0">
      {content}
    </button>
  );

  if (magnetic) {
    return <Magnet padding={25} strength={0.25}>{wrapper}</Magnet>;
  }

  return wrapper;
};

export interface GhostButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  magnetic?: boolean;
}

export const GhostButton: React.FC<GhostButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  magnetic = true,
}) => {
  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-mono text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-sky-400/30 backdrop-blur-md transition-all duration-300 cursor-pointer ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.span>
  );

  const wrapper = href ? (
    <a href={href} onClick={onClick} className="inline-block no-underline">
      {content}
    </a>
  ) : (
    <button onClick={onClick} type="button" className="inline-block bg-transparent border-0 p-0">
      {content}
    </button>
  );

  if (magnetic) {
    return <Magnet padding={25} strength={0.25}>{wrapper}</Magnet>;
  }

  return wrapper;
};
