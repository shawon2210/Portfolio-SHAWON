import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Home, Layers, Briefcase, Mail } from 'lucide-react';
import { TabType } from '../types';
import { TRANSITION_INTERACTIVE } from '../lib/motion';

interface FloatingDockProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

const DOCK_ITEMS: {
  id: TabType;
  label: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'projects', label: 'Projects', Icon: Layers },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'contact', label: 'Contact', Icon: Mail },
];

export const FloatingDock: React.FC<FloatingDockProps> = ({ activeTab, onSelectTab }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav
      data-testid="mobile-dock"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center gap-1 bg-[#0d1017]/90 backdrop-blur-2xl px-2 py-2 rounded-2xl border border-white/[0.10] shadow-[0_8px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]">
        {DOCK_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <DockItem
              key={id}
              id={id}
              label={label}
              Icon={Icon}
              isActive={isActive}
              onSelectTab={onSelectTab}
              shouldReduceMotion={!!shouldReduceMotion}
            />
          );
        })}
      </div>
    </nav>
  );
};

interface DockItemProps {
  id: TabType;
  label: string;
  Icon: React.FC<{ className?: string }>;
  isActive: boolean;
  onSelectTab: (tab: TabType) => void;
  shouldReduceMotion: boolean;
}

const DockItem: React.FC<DockItemProps> = ({
  id,
  label,
  Icon,
  isActive,
  onSelectTab,
  shouldReduceMotion,
}) => {
  return (
    <button
      onClick={() => onSelectTab(id)}
      data-testid={`dock-${id}`}
      aria-current={isActive ? 'page' : undefined}
      data-cursor="link"
      aria-label={label}
      title={label}
      className={`relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-200 cursor-pointer pressable focus-ring ${
        isActive
          ? 'text-slate-950'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="dockActiveBackground"
          className="absolute inset-0 bg-sky-400 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.5)]"
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : TRANSITION_INTERACTIVE
          }
        />
      )}
      <motion.span
        className="relative z-10"
        animate={
          shouldReduceMotion
            ? {}
            : isActive
            ? { scale: 1.12 }
            : { scale: 1 }
        }
        transition={shouldReduceMotion ? { duration: 0 } : TRANSITION_INTERACTIVE}
      >
        <Icon className="w-5 h-5" />
      </motion.span>
      <span className="relative z-10 text-[10px] font-semibold leading-none tracking-tight">
        {label}
      </span>
    </button>
  );
};
