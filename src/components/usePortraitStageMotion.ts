import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import { usePrefersReducedMotion, useIsTouchDevice } from '../lib/motion';
import { motionPause } from '../lib/motionPause';

/**
 * MOBILE-FIRST v5 — PHASE 3: motion brain for <PortraitStage />.
 *
 * Owns every dynamic concern so the component stays declarative:
 *  - one-shot entrance trigger (useInView, fires once the stage enters)
 *  - ambient-loop gating: only when in view AND tab visible AND the site's 3D
 *    pause toggle is off AND motion is allowed (≤6 infinite CSS loops total)
 *  - pointer parallax (fine pointer only): raw pointer values are spring-smoothed
 *    once here and re-used by every layer at different magnitudes
 *  - whole-stage tilt (fine pointer only, subtle)
 *
 * Reduced motion: `reducedMotion` short-circuits every branch — no entrance, no
 * loops, no parallax, no tilt; components render their final composed state.
 */

const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));

export function usePortraitStageMotion<T extends HTMLElement>(stageRef: React.RefObject<T | null>) {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  const [tabVisible, setTabVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(() => motionPause.get());
  const inView = useInView(stageRef, { margin: '8% 0px' });

  // Latch the entrance so it plays exactly once (stage is above the fold, so
  // inView flips true almost immediately).
  const enteredRef = useRef(false);
  if (inView && !enteredRef.current) enteredRef.current = true;
  const entered = enteredRef.current;

  useEffect(() => motionPause.subscribe(setUserPaused), []);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Ambient loops run only when it is safe to keep the compositor busy.
  const ambient = inView && tabVisible && !userPaused && !reducedMotion;

  // Pointer parallax: fine pointer, motion allowed, tab visible, not paused.
  const canParallax = !reducedMotion && !userPaused && tabVisible && !isTouch;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.6 });
  const spy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.6 });

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!canParallax) return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set(clamp(((e.clientX - r.left) / r.width) * 2 - 1));
      py.set(clamp(((e.clientY - r.top) / r.height) * 2 - 1));
    },
    [canParallax, px, py],
  );

  const onPointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  // Layer magnitudes (px). Portrait least; cards/decor most and opposite.
  const portraitX = useTransform(spx, (v) => v * 5);
  const portraitY = useTransform(spy, (v) => v * 5);
  const shapeX = useTransform(spx, (v) => v * 13);
  const shapeY = useTransform(spy, (v) => v * 9);
  const blobX = useTransform(spx, (v) => v * -18);
  const blobY = useTransform(spy, (v) => v * -11);
  const decorX = useTransform(spx, (v) => v * -24);
  const decorY = useTransform(spy, (v) => v * -16);
  const cardX = useTransform(spx, (v) => v * -16);
  const cardY = useTransform(spy, (v) => v * -13);
  const tiltX = useTransform(spy, (v) => v * -2.2);
  const tiltY = useTransform(spx, (v) => v * 2.2);

  return {
    reducedMotion,
    ambient,
    entered,
    canParallax,
    onPointerMove,
    onPointerLeave,
    // When parallax is disallowed, feed static zeros so styles collapse to rest.
    style: (mv: MotionValue<number>, rest: number): MotionValue<number> | number =>
      canParallax ? mv : rest,
    layers: { portraitX, portraitY, shapeX, shapeY, blobX, blobY, decorX, decorY, cardX, cardY, tiltX, tiltY },
  };
}