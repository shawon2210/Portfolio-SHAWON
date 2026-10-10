import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MOTION_EASING, MOTION_DURATIONS } from '../../lib/motion';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = MOTION_DURATIONS.base,
  yOffset = 20,
  blur = 8,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blur}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: MOTION_EASING,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
