import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useReducedMotion } from 'motion/react';

export const CursorFollower: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 24, stiffness: 280, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable strictly on touch devices or reduced motion
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchCheck);
    if (touchCheck || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if target is clickable
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, [role="button"], input, select, textarea, [data-cursor-hover]')
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, shouldReduceMotion]);

  if (isTouch || shouldReduceMotion || !isVisible) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovered ? 1.8 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.18 }}
      className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-sky-400/40 backdrop-blur-[1px] transition-colors duration-200 ${
        isHovered
          ? 'w-10 h-10 bg-sky-400/15 border-sky-400/60'
          : 'w-6 h-6 bg-sky-400/10'
      }`}
    />
  );
};
