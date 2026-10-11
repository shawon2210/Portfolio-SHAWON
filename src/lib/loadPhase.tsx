/**
 * PHASE 5: Page-load orchestration.
 *
 * One provider owns the intro timeline so the preloader, the nav, the hero
 * display heading, the 3D centerpiece and the hero metadata all resolve from a
 * single clock instead of five independent `setTimeout` chains.
 *
 * Lifecycle:
 *   'idle'      — mounted, preloader running (or already skipped this session)
 *   'entering'  — preloader handed off; the choreography is playing
 *   'settled'   — choreography finished; everything below the hero is unblocked
 *
 * On a repeat visit within the same session (or with reduced motion), the whole
 * provider resolves to 'settled' on the first frame and nothing animates.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LOAD_SEQUENCE,
  PRELOADER_MAX_MS,
  SESSION_KEY_ENTRANCE,
  readSessionFlag,
  writeSessionFlag,
} from './motion';

export type LoadPhase = 'idle' | 'entering' | 'settled';

interface LoadPhaseValue {
  phase: LoadPhase;
  /** True when the choreography should actually play (not a repeat visit). */
  shouldAnimate: boolean;
  /** True when the preloader is allowed to paint over the page. */
  showPreloader: boolean;
  /** Delay (seconds) for a given choreography slot, 0 when not animating. */
  at: (slot: keyof typeof LOAD_SEQUENCE) => number;
  /** Called by the Preloader when it finishes handing off. */
  beginEntrance: () => void;
  /** Skips the preloader + choreography entirely (keyboard / click / reduced motion). */
  skipIntro: () => void;
}

const LoadPhaseContext = createContext<LoadPhaseValue | null>(null);

export const LoadPhaseProvider: React.FC<{
  children: React.ReactNode;
  reducedMotion: boolean;
}> = ({ children, reducedMotion }) => {
  // Decide once, synchronously, before first paint: a returning visitor (or a
  // reduced-motion user) must never see the preloader.
  const decidedOnce = useRef(false);
  if (!decidedOnce.current) {
    decidedOnce.current = true;
  }

  const initialReplayed = useMemo(() => readSessionFlag(SESSION_KEY_ENTRANCE), []);

  const [phase, setPhase] = useState<LoadPhase>(() => {
    if (reducedMotion || initialReplayed) return 'settled';
    return 'idle';
  });

  const showPreloader = phase === 'idle';

  const shouldAnimate = phase === 'entering' || (phase === 'settled' && !reducedMotion && !initialReplayed);

  const beginEntrance = useCallback(() => {
    setPhase((prev) => {
      if (prev === 'idle') return reducedMotion ? 'settled' : 'entering';
      return prev;
    });
    writeSessionFlag(SESSION_KEY_ENTRANCE);
  }, [reducedMotion]);

  const skipIntro = useCallback(() => {
    writeSessionFlag(SESSION_KEY_ENTRANCE);
    setPhase('settled');
  }, []);

  // Settle after the longest slot in the choreography has played out.
  useEffect(() => {
    if (phase !== 'entering') return;
    const longest = Math.max(...Object.values(LOAD_SEQUENCE));
    const timer = window.setTimeout(() => setPhase('settled'), (longest + 0.9) * 1000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // If a visitor lands with reduced motion toggled on mid-intro, cut to settled.
  useEffect(() => {
    if (reducedMotion) setPhase('settled');
  }, [reducedMotion]);

  const at = useCallback(
    (slot: keyof typeof LOAD_SEQUENCE) => {
      if (reducedMotion || initialReplayed) return 0;
      // PHASE 5: while the curtain is still up the choreography must NOT run
      // behind it — otherwise the hero is already settled by the time the user
      // sees it. We push each slot's delay past the curtain's maximum lifetime
      // so every element holds its `initial` state; flipping the phase to
      // 'entering' re-arms the transition with the real delay, and because the
      // long-delayed animation was interrupted before it reached its target
      // there is no visible jump.
      if (phase !== 'entering') {
        return PRELOADER_MAX_MS / 1000 + LOAD_SEQUENCE[slot] + 0.2;
      }
      return LOAD_SEQUENCE[slot];
    },
    [phase, reducedMotion, initialReplayed]
  );

  const value = useMemo<LoadPhaseValue>(
    () => ({ phase, shouldAnimate, showPreloader, at, beginEntrance, skipIntro }),
    [phase, shouldAnimate, showPreloader, at, beginEntrance, skipIntro]
  );

  return <LoadPhaseContext.Provider value={value}>{children}</LoadPhaseContext.Provider>;
};

export function useLoadPhase(): LoadPhaseValue {
  const ctx = useContext(LoadPhaseContext);
  if (!ctx) {
    // Safe fallback for isolated/dev harnesses that render components directly.
    return {
      phase: 'settled',
      shouldAnimate: false,
      showPreloader: false,
      at: () => 0,
      beginEntrance: () => {},
      skipIntro: () => {},
    };
  }
  return ctx;
}