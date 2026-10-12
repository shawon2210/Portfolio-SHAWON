import React, { useEffect, useRef, useState } from 'react';
import { FolderKanban, Code2 } from 'lucide-react';
import { STAGE_STAT, STAGE_STACK, STAGE_STATUS } from '../data/stageCards';

export interface StageCardProps {
  variant: 'stat' | 'stack' | 'status';
  /** Small device-pixel nudge, not a breakpoint concern. */
  className?: string;
  /** v5/Phase3: enable the one-shot stat count-up (only when motion is allowed). */
  countUp?: boolean;
}

/**
 * MOBILE-FIRST v5 — PHASE 2 (+Phase3 motion): floating info card.
 *
 * Dark-glass surface built from tokens: translucent surface container, 1px token
 * border, sparing backdrop blur, soft shadow, token radius.
 *
 * Content is real (see src/data/stageCards.ts). Cards are exposed as text so
 * assistive tech can read them; they sit outside the face region.
 */

// One-shot count-up for the stat figure (eases 0 -> target over ~900ms). Lives
// here rather than in the stage so the card owns its own number animation.
function CountUp({ to, enabled }: { to: number; enabled: boolean }) {
  const [n, setN] = useState(enabled ? to : 0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setN(to);
      return;
    }
    const dur = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(Math.round(eased * to));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [enabled, to]);

  return <>{String(n)}</>;
}
export const StageCard: React.FC<StageCardProps> = ({ variant, className = '', countUp = false }) => {
  if (variant === 'status') {
    return (
      <div
        data-testid="stage-card-status"
        className={`stage-card stage-card--status ${className}`}
      >
        <span className="stage-card__dot" aria-hidden="true" />
        <span className="stage-card__status-text">{STAGE_STATUS.text}</span>
      </div>
    );
  }

  if (variant === 'stack') {
    return (
      <div
        data-testid="stage-card-stack"
        className={`stage-card stage-card--stack ${className}`}
      >
        <div className="stage-card__head">
          <Code2 className="stage-card__icon" aria-hidden="true" />
          <span className="stage-card__label">{STAGE_STACK.label}</span>
        </div>
        <div className="stage-card__chips">
          {STAGE_STACK.chips.map((chip) => (
            <span key={chip} className="stage-card__chip">
              {chip}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Stat card
  return (
    <div
      data-testid="stage-card-stat"
      className={`stage-card stage-card--stat ${className}`}
    >
      <div className="stage-card__head">
        <FolderKanban className="stage-card__icon" aria-hidden="true" />
        <span className="stage-card__label">{STAGE_STAT.label}</span>
      </div>
      <div className="stage-card__value">
        <CountUp to={STAGE_STAT.valueNum} enabled={countUp} />
      </div>
      <div className="stage-card__caption">{STAGE_STAT.caption}</div>
    </div>
  );
};

export default StageCard;