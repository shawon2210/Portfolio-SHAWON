/**
 * PHASE 5: Editorial preloader + name reveal.
 *
 * Contract:
 *   - Appears at most once per browsing session (`sessionStorage`).
 *   - Never blocks for longer than PRELOADER_MAX_MS (1150ms) no matter how slow
 *     the fonts, the network or the WebGL context are.
 *   - Skippable instantly: click, tap, Enter, Space or Escape.
 *   - Completely absent for `prefers-reduced-motion: reduce`.
 *   - Hands off into the shared LoadPhase choreography, so the hero heading,
 *     the 3D centerpiece and the nav all resolve on one clock.
 *
 * PERFORMANCE NOTE: this screen sits directly on the critical path, so it is
 * deliberately *not* built out of Motion components. The name reveal is a pure
 * CSS keyframe animation (compositor-only) and the progress rail is animated by
 * writing a CSS custom property inside a single rAF loop — zero React renders
 * per frame. An earlier Motion-based version re-rendered 14 animated spans ~70
 * times per second and cost ~110ms of TBT on a 4x-throttled mobile CPU.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PRELOADER_MAX_MS, PRELOADER_MIN_MS, PRELOADER_EXIT_MS } from '../lib/motion';

interface PreloaderProps {
  onComplete: () => void;
  /** Return true to render (false = session replay or reduced motion). */
  enabled: boolean;
  reducedMotion: boolean;
}

const NAME = 'MD SHAWON MOLLA';
const CHAR_STAGGER_MS = 14;
/** Curtain lifts once the name reveal has finished (40ms base + stagger + rise). */
const REVEAL_BUDGET_MS = 40 + 13 * CHAR_STAGGER_MS + 400;

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, enabled, reducedMotion }) => {
  const [exiting, setExiting] = useState(false);
  const finishedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  /** Fires onComplete exactly once, after the curtain has visually left. */
  const complete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete();
  }, [onComplete]);

  const dismiss = useCallback(() => {
    setExiting((prev) => {
      if (prev) return prev;
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      // Shared-curve curtain lift, then hand off.
      exitTimerRef.current = window.setTimeout(complete, PRELOADER_EXIT_MS);
      return true;
    });
  }, [complete]);

  useEffect(() => {
    if (!enabled || reducedMotion) {
      complete();
      return;
    }

    const start = performance.now();
    let frame = 0;
    let finished = false;
    const shell = shellRef.current;

    /**
     * The curtain lifts as soon as the page could actually be seen — i.e. once
     * webfonts have settled (or REVEAL_BUDGET_MS have passed, whichever is
     * first). It deliberately does NOT wait for `window.load`, because that
     * event waits on every lazy chunk and every font file, which on a throttled
     * connection always collapsed into the 1150ms ceiling and added ~500ms of
     * pure dead time before the hero was visible.
     */
    const assetsReady = () => {
      const elapsed = performance.now() - start;
      return fontsSettled || elapsed >= REVEAL_BUDGET_MS || assetsTimedOut;
    };

    let fontsSettled = false;
    let assetsTimedOut = false;
    document.fonts?.ready.then(() => {
      fontsSettled = true;
      tryFinish();
    });
    const budget = window.setTimeout(() => {
      assetsTimedOut = true;
      tryFinish();
    }, REVEAL_BUDGET_MS);

    const tryFinish = () => {
      if (finished) return;
      const elapsed = performance.now() - start;
      if (elapsed >= PRELOADER_MIN_MS && assetsReady()) {
        finished = true;
        window.cancelAnimationFrame(frame);
        dismiss();
      }
    };

    // Single rAF loop writing a CSS variable. The rail and the numeric readout
    // both read it, so the whole progress display updates without React.
    const tick = () => {
      if (finished) return;
      const elapsed = performance.now() - start;
      // Deterministic 0→100 over PRELOADER_MAX_MS with an ease-out curve, so the
      // bar never "jumps" to 100 and the duration stays legible.
      const raw = Math.min(elapsed / PRELOADER_MAX_MS, 1);
      const eased = 1 - Math.pow(1 - raw, 2.2);
      const pct = Math.round(eased * 100);
      if (shell) {
        shell.style.setProperty('--pct', String(pct));
        shell.setAttribute('aria-valuenow', String(pct));
      }
      if (raw < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };
    frame = window.requestAnimationFrame(tick);

    // Hard ceiling: nothing (fonts, images, slow listeners) can hold the page.
    const cap = window.setTimeout(() => {
      finished = true;
      window.cancelAnimationFrame(frame);
      if (shell) {
        shell.style.setProperty('--pct', '100');
        shell.setAttribute('aria-valuenow', '100');
      }
      dismiss();
    }, PRELOADER_MAX_MS);

    // Early exit as soon as the hero is paintable.
    if (assetsReady()) {
      tryFinish();
    }

    // Skippable: any pointer/key intent dismisses immediately.
    const onSkip = (e: Event) => {
      if (e.type === 'keydown') {
        const key = (e as KeyboardEvent).key;
        if (!['Enter', ' ', 'Spacebar', 'Escape', 'Esc'].includes(key)) return;
      }
      finished = true;
      window.cancelAnimationFrame(frame);
      if (shell) {
        shell.style.setProperty('--pct', '100');
        shell.setAttribute('aria-valuenow', '100');
      }
      dismiss();
    };
    window.addEventListener('pointerdown', onSkip, { once: true });
    window.addEventListener('keydown', onSkip);

    return () => {
      finished = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(cap);
      window.clearTimeout(budget);
      window.removeEventListener('pointerdown', onSkip);
      window.removeEventListener('keydown', onSkip);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, [enabled, reducedMotion, dismiss, complete]);

  if (!enabled || reducedMotion) return null;

  return (
    <div
      ref={shellRef}
      className={`fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-[#090b11] ${
        exiting ? 'preloader-exit' : ''
      }`}
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ ['--pct' as string]: '0' }}
    >
      {/* Ambient aurora so the curtain already carries the site's palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 42%, rgba(76,215,246,0.14) 0%, rgba(9,11,17,0) 70%)',
        }}
      />

      {/* Name reveal — per-character mask rise.
          Compositor-only: transform + opacity on inline-blocks. */}
      <div className="preloader-body relative z-10 flex flex-col items-center px-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-sky-400/80 mb-5">
          Loading
        </span>

        <h1 className="sr-only">{NAME}</h1>

        <p
          aria-hidden="true"
          className="font-sans text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-[-0.02em] text-center flex flex-wrap justify-center gap-x-[0.22em] leading-none"
        >
          {NAME.split('').map((char, i) => (
            <span key={`${char}-${i}`} className="inline-flex overflow-hidden py-[0.08em]">
              <span
                className="preloader-char inline-block bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
                style={{ animationDelay: `${40 + i * CHAR_STAGGER_MS}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </p>

        {/* Progress rail — width driven by --pct, no React involved */}
        <div className="mt-8 h-px w-40 sm:w-56 bg-white/10 overflow-hidden" aria-hidden="true">
          <div className="preloader-rail h-full bg-gradient-to-r from-sky-400 to-emerald-400" />
        </div>

        <span className="preloader-count mt-3 font-mono text-[10px] tabular-nums text-slate-500" aria-hidden="true">
          000
        </span>
      </div>

      {/* Skippable affordance — deliberately low-contrast so it never competes */}
      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-8 right-8 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded px-2 py-1 cursor-pointer transition-colors"
      >
        Skip intro
      </button>
    </div>
  );
};

export default Preloader;