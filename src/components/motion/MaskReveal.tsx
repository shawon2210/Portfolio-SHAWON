import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CINEMATIC_EASING } from '../../lib/motion';

export interface MaskRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  delay?: number;
  duration?: number;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  direction = 'up',
  className = '',
  delay = 0,
  duration = 0.8,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getClipPaths = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: 'inset(100% 0% 0% 0%)',
          visible: 'inset(0% 0% 0% 0%)',
        };
      case 'down':
        return {
          hidden: 'inset(0% 0% 100% 0%)',
          visible: 'inset(0% 0% 0% 0%)',
        };
      case 'left':
        return {
          hidden: 'inset(0% 0% 0% 100%)',
          visible: 'inset(0% 0% 0% 0%)',
        };
      case 'right':
        return {
          hidden: 'inset(0% 100% 0% 0%)',
          visible: 'inset(0% 0% 0% 0%)',
        };
    }
  };

  const clip = getClipPaths();

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ clipPath: clip.hidden, opacity: 0 }}
      whileInView={{ clipPath: clip.visible, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration,
        delay,
        ease: CINEMATIC_EASING,
      }}
      className={`overflow-hidden will-change-[clip-path] ${className}`}
    >
      {children}
    </motion.div>
  );
};
