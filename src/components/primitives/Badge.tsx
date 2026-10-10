import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'availability' | 'accent' | 'neutral' | 'outline';
  pulse?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  pulse = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    availability:
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(52,211,153,0.15)]',
    accent:
      'bg-sky-500/10 text-sky-400 border-sky-500/25 shadow-[0_0_12px_rgba(56,189,248,0.15)]',
    neutral:
      'bg-white/[0.04] text-slate-300 border-white/[0.08]',
    outline:
      'bg-transparent text-slate-400 border-white/[0.12]',
  };

  const dotColors = {
    availability: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    accent: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
    neutral: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-md transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
