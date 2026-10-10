import React from 'react';
import { motion } from 'motion/react';
import { TabType } from '../types';
import { AppIcon } from './AppIcon';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'projects', label: 'Projects', icon: 'code_blocks' },
    { id: 'experience', label: 'Experience', icon: 'history_edu' },
    { id: 'contact', label: 'Contact', icon: 'alternate_email' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.35)] border-t border-white/5">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[44px] h-12 px-1 transition-all ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 w-6 h-0.5 rounded-full bg-primary shadow-[0_0_8px_#38bdf8]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <AppIcon name={item.icon} className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="font-status-label text-[10px] tracking-tight leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
