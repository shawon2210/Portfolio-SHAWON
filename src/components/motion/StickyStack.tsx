import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export interface StickyStackItemProps {
  children: React.ReactNode;
  index: number;
  total: number;
  topOffset?: number;
  className?: string;
}

export const StickyStackItem: React.FC<StickyStackItemProps> = ({
  children,
  index,
  total,
  topOffset = 28,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Target scale calculation: targetScale = 1 - (total - 1 - index) * 0.03
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  if (shouldReduceMotion) {
    return (
      <div
        className={`relative ${className}`}
        style={{ top: `${index * topOffset}px` }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`sticky top-20 min-h-[70vh] flex items-start justify-center ${className}`}
      style={{
        top: `calc(5rem + ${index * topOffset}px)`,
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full origin-top will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

export interface StickyStackProps {
  children: React.ReactNode;
  className?: string;
}

export const StickyStack: React.FC<StickyStackProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative w-full flex flex-col gap-12 sm:gap-16 ${className}`}>
      {children}
    </div>
  );
};
