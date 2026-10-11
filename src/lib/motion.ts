/**
 * Shared Motion Tokens, Curves & Custom Hooks
 * Adheres strictly to the portfolio cinematic v3 specification.
 *
 * PHASE 5: every interactive surface in the app derives hover / press / focus
 * transitions from the tokens declared here so the whole portfolio shares one
 * physical language instead of ~14 hand-tuned curves.
 */

import { useRef, useEffect, useState, RefObject } from 'react';
import { useScroll, useReducedMotion, MotionValue } from 'motion/react';

/** Mutable cubic-bezier tuple — the exact shape Motion's `Easing` accepts. */
export type Bezier = [number, number, number, number];

export const MOTION_EASING: Bezier = [0.22, 1, 0.36, 1];
export const CINEMATIC_EASING: Bezier = [0.25, 0.1, 0.25, 1];
/** Symmetric ease for reversible hover transitions (no directional overshoot). */
export const EASE_STANDARD: Bezier = [0.4, 0, 0.2, 1];
/** Sharp decelerate — used for micro-interactions that start fast and settle. */
export const EASE_MICRO: Bezier = [0.16, 1, 0.3, 1];

/**
 * PHASE 5: micro-interaction scale contract.
 * `press` is the shared while-tap scale; `pressDeep` is for large surfaces
 * (cards, panels) where a 2% squash reads as "pressed" without feeling soft.
 */
export const PRESS_SCALE = 0.96;
export const PRESS_SCALE_DEEP = 0.985;
export const HOVER_LIFT = -1;

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
 * PHASE 5: the single micro-interaction transition used by every button,
 * card, nav pill and list row. Hover and press share one curve so the
 * app feels like one machined object rather than a set of separate widgets.
 */
export const TRANSITION_INTERACTIVE = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.6,
} as const;

/** Non-spring fallback for the same feel when the user prefers reduced motion. */
export const TRANSITION_INTERACTIVE_REDUCED = {
  duration: MOTION_DURATIONS.instant,
  ease: EASE_STANDARD,
} as const;

/** CSS-ready timing tokens, kept in sync with MOTION_DURATIONS / MOTION_EASING. */
export const CSS_EASING = {
  micro: 'cubic-bezier(0.16, 1, 0.3, 1)',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

export const CSS_DURATION = {
  instant: '150ms',
  fast: '300ms',
  base: '600ms',
} as const;

/**
 * PHASE 5: Page-load choreography.
 * A single timeline drives the hero heading, the 3D scene and the nav so they
 * resolve in one gesture instead of three independent timers.
 *
 *   t=0.00  scrim clears, name reveal begins
 *   t=0.10  nav slides down
 *   t=0.20  hero heading characters rise
 *   t=0.34  3D scene fades + scales in
 *   t=0.46  hero metadata / CTAs
 *   t=0.58  scroll cue
 *
 * The whole sequence lands inside ~1.5s of the preloader handing off, which
 * keeps the perceptual cost of the intro under a blink.
 */
export const LOAD_SEQUENCE = {
  /** Nav container reveal */
  nav: 0.1,
  /** Hero display heading character base delay */
  heading: 0.2,
  /** Per-character interval inside the display heading */
  headingStagger: 0.022,
  /** Hero identity row (portrait + status + social) */
  meta: 0.16,
  /** Hero tagline / rotating role */
  tagline: 0.34,
  /** Hero primary + secondary CTA row */
  cta: 0.44,
  /** Centered 3D centerpiece */
  scene: 0.34,
  /** Scroll cue at the base of the hero */
  cue: 0.56,
  /** Section content below the hero */
  sections: 0.6,
} as const;

/**
 * PHASE 5: the preloader must never block first interaction for longer than
 * this. Measured from the moment the curtain mounts, not from navigation start —
 * the app cannot paint the curtain before the entry chunk has executed, and
 * that boot cost is reported separately in the Phase 5 audit.
 */
export const PRELOADER_MAX_MS = 950;
/** Curtain lift duration once the handoff starts. */
export const PRELOADER_EXIT_MS = 380;
/** PHASE 5: minimum visible time, long enough to read the name but not to wait. */
export const PRELOADER_MIN_MS = 260;

export const SESSION_KEY_PRELOADER = 'shawon.preloader.seen.v1';
export const SESSION_KEY_ENTRANCE = 'shawon.entrance.done.v1';

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

/**
 * PHASE 5: True when the device reports `prefers-reduced-motion: reduce`.
 * Unlike `useReducedMotion()` this resolves to a plain boolean immediately on
 * first render (Motion's hook starts as 
ull`), so it is safe to use inside
 * `useState` initialisers and imperative event handlers.
 */
export function usePrefersReducedMotion(): boolean {
  const fromMotion = useReducedMotion();
  const [preference, setPreference] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPreference(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return fromMotion === true || preference;
}

/**
 * PHASE 5: True on coarse-pointer / touch devices.
 * Gates every pointer-only affordance (custom cursor, magnetic pull, tilt).
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia?.('(pointer: coarse)').matches === true
    );
  });

  useEffect(() => {
    const mq = window.matchMedia?.('(pointer: coarse)');
    if (!mq) return;
    const onChange = () => setIsTouch(mq.matches || navigator.maxTouchPoints > 0);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isTouch;
}

/** PHASE 5: sessionStorage flag that keeps the intro to once per browsing session. */
export function readSessionFlag(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function writeSessionFlag(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    /* Private mode / disabled storage — the intro simply repeats. */
  }
}
