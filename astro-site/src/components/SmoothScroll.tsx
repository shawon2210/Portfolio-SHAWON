import { useEffect } from 'react';
import Lenis from 'lenis';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Lenis smooth scroll island.
 *
 * Mounted once from BaseLayout with `client:load`. Two rules matter here:
 * 1. When the visitor asks for reduced motion we never instantiate Lenis, so the
 *    browser keeps its native (instant) scrolling instead of us animating it.
 * 2. The RAF loop and the instance are torn down together, otherwise Astro view
 *    transitions would leak a running rAF after navigation.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = window.matchMedia(REDUCED_MOTION);
    if (query.matches) {
      document.documentElement.dataset.smoothScroll = 'native';
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      // Let Lenis handle in-page anchor targets (nav links) itself.
      anchors: true,
    });

    document.documentElement.dataset.smoothScroll = 'lenis';
    // Exposed so later islands can sync scroll-driven effects to this instance.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };
    frame = window.requestAnimationFrame(raf);

    const stop = () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      delete document.documentElement.dataset.smoothScroll;
    };

    // If the user flips the OS motion preference while the page is open, drop
    // the animation instead of ignoring the change.
    query.addEventListener('change', (event) => {
      if (event.matches) stop();
    });

    return stop;
  }, []);

  return null;
}