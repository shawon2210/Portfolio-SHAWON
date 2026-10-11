/**
 * Shared Motion Tokens, Curves & Custom Hooks
 * Adheres strictly to the portfolio cinematic v3 specification.
 */

import { useRef, RefObject } from 'react';
import { useScroll, MotionValue } from 'motion/react';

export const MOTION_EASING = [0.22, 1, 0.36, 1] as const;
export const CINEMATIC_EASING = [0.25, 0.1, 0.25, 1] as const;

export const MOTION_DURATIONS = {
  instant: 0.15, // 150ms micro-interactions (press, toggle)
  fast: 0.3,    // 300ms hover transitions, pills
  base: 0.6,    // 600ms content reveals, card entrances
  slow: 0.9,    // 900ms major section hero transitions
} as const;

export const MOTION_STAGGER = 0.06; // 60ms stagger interval

export const TRANSITION_FAST = {
  duration: MOTION_DURATIONS.fast,
  ease: MOTION_EASING,
};

export const TRANSITION_BASE = {
  duration: MOTION_DURATIONS.base,
  ease: MOTION_EASING,
};

export const TRANSITION_SLOW = {
  duration: MOTION_DURATIONS.slow,
  ease: MOTION_EASING,
};

export const TRANSITION_CINEMATIC = {
  duration: MOTION_DURATIONS.base,
  ease: CINEMATIC_EASING,
};

/**
 * Blur-Fade Reveal Variant (Signature Entrance)
 */
export const blurFadeVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: TRANSITION_BASE,
  },
};

/**
 * Standard Stagger Container Variant
 */
export const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_STAGGER,
      delayChildren: 0.04,
    },
  },
};

/**
 * Simple Fade Variant
 */
export const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITION_FAST,
  },
};

/**
 * Hook to track scroll progress within a targeted section
 * Used to synchronize 3D camera choreography and scroll timelines
 */
export function useSectionProgress<T extends HTMLElement = HTMLElement>(
  targetRef?: RefObject<T | null>
): { ref: RefObject<T | null>; scrollYProgress: MotionValue<number> } {
  const internalRef = useRef<T>(null);
  const ref = targetRef || internalRef;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return { ref, scrollYProgress };
}
