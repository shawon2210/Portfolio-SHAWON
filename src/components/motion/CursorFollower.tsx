/**
 * PHASE 5: Contextual cursor follower.
 *
 * States are resolved by DOM delegation (one `mouseover` listener on the
 * document) rather than `closest()` on every `mousemove`, and the follower
 * itself is composed of two transforms only (translate + scale), so it never
 * triggers layout. The native cursor is hidden only while the follower is live.
 *
 *   default  → 20px outlined dot
 *   link     → 40px filled ring (a, button, [role=button])
 *   project  → 68px ring with a "VIEW" label (data-cursor="project")
 *   drag     → 46px ring with grab affordance (data-cursor="drag")
 *   text     → 2×26px I-beam (inputs, textarea, contenteditable)
 *   pressed  → any state, shrunk while the primary button is down
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { useIsTouchDevice, usePrefersReducedMotion, TRANSITION_INTERACTIVE } from '../../lib/motion';

export type CursorState = 'default' | 'link' | 'project' | 'drag' | 'text';

interface StateConfig {
  scale: number;
  width: number;
  height: number;
  fill: string;
  border: string;
  label?: string;
}

const STATE_CONFIG: Record<CursorState, StateConfig> = {
  default: { scale: 1, width: 20, height: 20, fill: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.55)' },
  link: { scale: 1, width: 40, height: 40, fill: 'rgba(56,189,248,0.16)', border: 'rgba(56,189,248,0.85)' },
  project: {
    scale: 1,
    width: 68,
    height: 68,
    fill: 'rgba(76,215,246,0.12)',
    border: 'rgba(76,215,246,0.9)',
    label: 'VIEW',
  },
  drag: { scale: 1, width: 46, height: 46, fill: 'rgba(52,211,153,0.14)', border: 'rgba(52,211,153,0.85)' },
  // I-beam: collapse to a thin vertical caret instead of scaling a ring.
  text: { scale: 1, width: 2, height: 26, fill: 'rgba(226,232,240,0.9)', border: 'rgba(226,232,240,0)' },
};

const TEXT_ENTRY_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]), textarea, select, [contenteditable="true"], [contenteditable=""], [data-cursor="text"]';

/** Resolve the cursor state for an event target. Pure + synchronous. */
function resolveState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default';

  const project = target.closest('[data-cursor="project"]');
  if (project) return 'project';

  const drag = target.closest('[data-cursor="drag"]');
  if (drag) return 'drag';

  if (target.closest(TEXT_ENTRY_SELECTOR)) return 'text';

  if (
    target.closest(
      'a[href], button, [role="button"], [role="tab"], summary, label[for], [data-cursor="link"]'
    )
  ) {
    return 'link';
  }

  return 'default';
}

export const CursorFollower: React.FC = () => {
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();

  const [state, setState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  const springX = useSpring(rawX, { damping: 26, stiffness: 520, mass: 0.32 });
  const springY = useSpring(rawY, { damping: 26, stiffness: 520, mass: 0.32 });

  const frameRef = useRef(0);
  const pointerRef = useRef({ x: -200, y: -200 });
  const visibleRef = useRef(false);

  const config = STATE_CONFIG[state];

  // Springs are replaced on reduced motion so the dot tracks the pointer 1:1.
  const x = reducedMotion ? rawX : springX;
  const y = reducedMotion ? rawY : springY;

  const setPointer = useCallback((clientX: number, clientY: number) => {
    pointerRef.current = { x: clientX, y: clientY };
    rawX.set(clientX);
    rawY.set(clientY);
  }, [rawX, rawY]);

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    let rafScheduled = false;

    const flush = () => {
      rafScheduled = false;
      setPointer(pointerRef.current.x, pointerRef.current.y);
    };

    const handleMove = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }

      // One transform write per frame regardless of mouse event frequency.
      if (!rafScheduled) {
        rafScheduled = true;
        frameRef.current = window.requestAnimationFrame(flush);
      }
    };

    const handleOver = (e: MouseEvent) => {
      setState(resolveState(e.target));
    };

    const handleDown = (e: MouseEvent) => {
      // Only the primary button produces the press state.
      if (e.button !== 0) return;
      setIsPressed(true);
    };

    const handleUp = () => setIsPressed(false);

    // `mouseleave` does not bubble, so this fires only when the pointer truly
    // leaves the document. `mouseout` would also fire every time the pointer
    // crosses from <html> to <body>, flickering the follower off mid-page.
    const handleLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
      setIsPressed(false);
      setState('default');
    };

    const handleVisibility = () => {
      if (document.hidden) handleLeave();
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mousedown', handleDown, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', () => setIsVisible(true), { once: true });

    // Hide the native cursor only once the follower is actually mounted, so a
    // JS failure can never leave the user without a cursor.
    document.documentElement.classList.add('has-custom-cursor');

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [isTouch, reducedMotion, setPointer]);

  if (isTouch || reducedMotion) return null;

  const sharedStyle = {
    x,
    y,
    translateX: '-50%' as const,
    translateY: '-50%' as const,
    willChange: 'transform' as const,
  };

  return (
    <>
      {/* One fixed-size element per contextual state, cross-faded. Animating
          opacity + scale only keeps the follower off the layout/paint path
          entirely (no width/height tween, no reflow). */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="cursor-shell"
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[110]"
            style={sharedStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.12 }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={state}
                className="absolute left-0 top-0 flex items-center justify-center"
                style={{
                  width: config.width,
                  height: config.height,
                  translateX: '-50%',
                  translateY: '-50%',
                  backgroundColor: config.fill,
                  border: `1px solid ${config.border}`,
                  borderRadius: state === 'text' ? 1 : 9999,
                  mixBlendMode: 'difference',
                }}
                initial={{ scale: 0.45, opacity: 0 }}
                animate={{ scale: isPressed ? 0.78 : 1, opacity: 1 }}
                exit={{ scale: 0.45, opacity: 0 }}
                transition={reducedMotion ? { duration: 0 } : TRANSITION_INTERACTIVE}
              >
                {/* Drag affordance — opposite chevrons */}
                {state === 'drag' && (
                  <>
                    <span className="absolute left-[5px] font-mono text-[9px] leading-none text-white/90 select-none">
                    &#9664;
                  </span>
                    <span className="absolute right-[5px] font-mono text-[9px] leading-none text-white/90 select-none">
                    &#9654;
                  </span>
                  </>
                )}
                {state === 'project' && config.label && (
                  <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-white select-none mix-blend-difference">
                    {config.label}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CursorFollower;