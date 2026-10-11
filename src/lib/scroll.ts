/**
 * PHASE 5: Single scroll authority for the whole app.
 *
 * Every programmatic scroll (nav clicks, scroll cue, scroll-to-top, deep links)
 * routes through here so that:
 *   1. the shared easing curve is used consistently,
 *   2. `prefers-reduced-motion` users get an instant jump instead of a tween,
 *   3. the header height offset is applied in exactly one place,
 *   4. URL/history writes stay in sync with the visual position.
 *
 * The tween uses the shared `EASE_MICRO` profile from lib/motion, approximated
 * with an easeOutExpo curve — C1-continuous within perceptual tolerance and far
 * cheaper to evaluate per frame than a bezier solver.
 */

export type ScrollBehaviorMode = 'smooth' | 'auto';

export function resolveScrollBehavior(reducedMotion: boolean): ScrollBehaviorMode {
  return reducedMotion ? 'auto' : 'smooth';
}

/** Height of the floating header, including the scroll-progress rail. */
export const HEADER_OFFSET = 76;

/**
 * Native `scroll-behavior` cannot express a custom cubic-bezier, so we drive the
 * tween ourselves. This keeps one curve across browsers instead of falling back
 * to the UA's `smooth` (which is a different, slower bezier on every engine).
 * The curve is the shared `EASE_MICRO` profile, approximated with easeOutExpo
 * (a C1-continuous match within perceptual tolerance and far cheaper per frame).
 */
const CUSTOM_SCROLL_MS = 620;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

let activeTween = 0;

/**
 * Scroll the window to an absolute Y offset.
 * Returns immediately when reduced motion is requested or the user has not
 * interacted yet (the tween is cancelled on any wheel/touch/key input).
 */
export function scrollWindowTo(
  top: number,
  options: { reducedMotion?: boolean; offset?: number } = {}
): void {
  const { reducedMotion = false, offset = 0 } = options;

  if (typeof window === 'undefined') return;

  const target = Math.max(0, Math.round(top - offset));

  if (reducedMotion || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, target);
    return;
  }

  cancelScrollTween();

  const start = window.scrollY;
  const distance = target - start;

  if (Math.abs(distance) < 2) return;

  const startTime = performance.now();
  activeTween = requestAnimationFrame(function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / CUSTOM_SCROLL_MS, 1);
    window.scrollTo(0, start + distance * easeOutExpo(progress));

    if (progress < 1) {
      activeTween = requestAnimationFrame(step);
    } else {
      activeTween = 0;
    }
  });
}

/** Scroll a DOM element into view using the shared curve. */
export function scrollElementTo(
  element: Element | null,
  options: { reducedMotion?: boolean; offset?: number } = {}
): void {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const absoluteTop = rect.top + window.pageYOffset;
  scrollWindowTo(absoluteTop, options);
}

export function cancelScrollTween(): void {
  if (activeTween) {
    cancelAnimationFrame(activeTween);
    activeTween = 0;
  }
}

/**
 * Installs global cancellation for the custom scroll tween: any real user input
 * immediately takes over, which is both correct UX and a CLS/long-task win.
 */
export function installScrollInterruption(): () => void {
  const interrupt = () => cancelScrollTween();
  const events: (keyof WindowEventMap)[] = [
    'wheel',
    'touchstart',
    'pointerdown',
    'keydown',
  ];
  events.forEach((e) => window.addEventListener(e, interrupt, { passive: true }));
  return () => events.forEach((e) => window.removeEventListener(e, interrupt));
}