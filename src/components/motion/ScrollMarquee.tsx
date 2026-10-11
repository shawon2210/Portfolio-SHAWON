import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from 'motion/react';

export interface ScrollMarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  className?: string;
  speed?: number;
}

export const ScrollMarquee: React.FC<ScrollMarqueeProps> = ({
  children,
  direction = 'left',
  className = '',
  speed = 0.35,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Skew effect based on scroll velocity (capped to prevent extreme distortion)
  const skewX = useTransform(smoothVelocity, [-1500, 1500], direction === 'left' ? [-10, 10] : [10, -10]);

  // Scroll offset translation
  const baseFactor = direction === 'left' ? -speed : speed;
  const x = useTransform(scrollY, (v) => `${(v * baseFactor) % 50}%`);

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-hidden whitespace-nowrap ${className}`}>
        <div className="flex gap-6 w-max">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap select-none ${className}`}
    >
      <motion.div
        style={{ x, skewX }}
        className="flex gap-6 w-max will-change-transform py-2"
      >
        {/* Tripled children for seamless visual repeating loop */}
        <div className="flex gap-6 shrink-0">{children}</div>
        <div className="flex gap-6 shrink-0">{children}</div>
        <div className="flex gap-6 shrink-0">{children}</div>
      </motion.div>
    </div>
  );
};
