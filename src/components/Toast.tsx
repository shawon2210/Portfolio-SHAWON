import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 flex items-center gap-2 bg-surface-container-highest/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2"
    >
      <BadgeCheck className="text-secondary w-4 h-4 shrink-0" />
      <span className="font-code-sm text-on-surface text-xs font-medium">{message}</span>
    </div>
  );
};
