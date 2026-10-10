import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'subtle' | 'accent';
  size?: 'sm' | 'md';
  interactive?: boolean;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'glass',
  size = 'sm',
  interactive = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-tight',
    md: 'text-xs px-3 py-1 tracking-normal',
  };

  const variantStyles = {
    glass:
      'bg-white/[0.03] text-slate-300 border border-white/[0.08] backdrop-blur-sm',
    subtle:
      'bg-slate-900/40 text-slate-400 border border-white/[0.05]',
    accent:
      'bg-sky-500/10 text-sky-300 border border-sky-500/20',
  };

  const interactiveStyles = interactive
    ? 'hover:border-sky-500/40 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400'
    : '';

  return (
    <span
      className={`inline-flex items-center font-mono rounded-md font-normal select-none transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
