import React from 'react';
import { FolderKanban, Code2 } from 'lucide-react';
import { STAGE_STAT, STAGE_STACK, STAGE_STATUS } from '../data/stageCards';

export interface StageCardProps {
  variant: 'stat' | 'stack' | 'status';
  /** Small device-pixel nudge, not a breakpoint concern. */
  className?: string;
}

/**
 * MOBILE-FIRST v5 — PHASE 2: floating info card for the portrait stage.
 *
 * Dark-glass surface built from tokens: translucent surface container, 1px token
 * border, sparing backdrop blur, soft shadow, token radius. No motion yet — the
 * entrance choreography lands in Phase 3; Phase 2 is the static composition.
 *
 * Content is real (see src/data/stageCards.ts). Cards are exposed as text so
 * assistive tech can read them; they sit outside the face region.
 */
export const StageCard: React.FC<StageCardProps> = ({ variant, className = '' }) => {
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
      <div className="stage-card__value">{STAGE_STAT.value}</div>
      <div className="stage-card__caption">{STAGE_STAT.caption}</div>
    </div>
  );
};

export default StageCard;