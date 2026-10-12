/**
 * MOBILE-FIRST v5 — shared "motion paused" store.
 *
 * The site's 3D pause toggle is owned inside <BackgroundScene /> and persisted
 * to localStorage. The portrait stage's ambient loops / pointer parallax must
 * honour the SAME toggle without BackgroundScene having to lift its state.
 *
 * BackgroundScene mirrors its `isPaused` value into this tiny external store; the
 * stage subscribes to it. This is additive — BackgroundScene's own behaviour is
 * untouched.
 *
 * The stage ALSO pauses on its own when it is off-screen (useInView) or the tab
 * is hidden; this store only carries the user's explicit toggle.
 */

const KEY = 'shawon_portfolio_bg_paused';

type Listener = (paused: boolean) => void;

let paused = false;
const listeners = new Set<Listener>();

try {
  paused = localStorage.getItem(KEY) === 'true';
} catch {
  paused = false;
}

export const motionPause = {
  get: (): boolean => paused,
  set(next: boolean) {
    if (next === paused) return;
    paused = next;
    listeners.forEach((l) => l(paused));
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    l(paused);
    return () => listeners.delete(l);
  },
};