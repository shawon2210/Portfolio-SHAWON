import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CINEMATIC_EASING } from '../../lib/motion';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  blur?: number;
  as?: keyof typeof motion;
  className?: string;
  once?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  x = 0,
  y = 20,
  blur = 6,
  as = 'div',
  className = '',
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const MotionComponent = (motion as unknown as Record<string, React.ElementType>)[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <MotionComponent
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once }}
        transition={{ duration: 0.2, delay }}
        className={className}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        x,
        y,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: CINEMATIC_EASING,
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};
