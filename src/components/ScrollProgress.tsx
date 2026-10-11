/**
 * PHASE 5: Scroll progress indicator.
 *
 * A hairline gradient rail pinned to the top of the viewport plus an optional
 * numeric readout. The rail is driven by a spring derived from the shared
 * motion tokens; under `prefers-reduced-motion` the spring is bypassed and the
 * raw progress is written straight to the transform.
 *
 * The element is transform-only (`scaleX`), so scrolling never invalidates
 * layout.
 */

import React from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react';
import { usePrefersReducedMotion } from '../lib/motion';

interface ScrollProgressProps {
  /** Renders a small percentage chip next to the rail. */
  showReadout?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ showReadout = false }) => {
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const spring = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
    restSpeed: 0.01,
  });

  const progress = reducedMotion ? scrollYProgress : spring;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-sky-400 via-sky-300 to-emerald-400 z-[70] pointer-events-none shadow-[0_0_10px_rgba(56,189,248,0.55)]"
        style={{ scaleX: progress }}
      />

      {showReadout && (
        <Readout progress={reducedMotion ? scrollYProgress : spring} />
      )}
    </>
  );
};

/** Tiny monospace percentage, right-aligned, fades in once scrolling starts. */
const Readout: React.FC<{ progress: ReturnType<typeof useSpring> }> = ({ progress }) => {
  const pct = useMotionValue(0);
  const opacity = useMotionValue(0);

  useMotionValueEvent(progress, 'change', (v) => {
    pct.set(Math.round(Math.min(Math.max(v, 0), 1) * 100));
    opacity.set(v > 0.002 ? 1 : 0);
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-3 right-4 sm:right-6 z-[70] pointer-events-none font-mono text-[10px] tabular-nums text-sky-300/70 mix-blend-screen"
      style={{ opacity }}
    >
      <motion.span>{pct}</motion.span>
    </motion.div>
  );
};

export default ScrollProgress;