import React from 'react';
import { ProfilePortrait } from './ProfilePortrait';

export interface PortraitStageProps {
  /** Descriptive alt text. Use the person's name/title from portfolioData. */
  alt: string;
  /** Dev-only avatar override; when set, a plain <img> is used instead of the stage ladder. */
  src?: string;
  className?: string;
  /**
   * 'framed' (default) is the shipped fallback: the existing photo inside a
   * rounded 7:9 frame sitting over the shape (no pop-out). It is used until the
   * transparent cutout exists. 'cutout' is reserved for the cutout asset.
   */
  variant?: 'framed' | 'cutout';
  /** Entrance delay (seconds) forwarded to the portrait frame. */
  delay?: number;
}

/**
 * MOBILE-FIRST v5 — PHASE 1: the canonical premium "portrait stage".
 *
 * Layer map (bottom → top), all SVG/CSS, NO WebGL (the shared 3D canvas is
 * untouched):
 *   L0 ambient glow   — blurred radial token gradient behind the shape
 *   L1 main shape     — rotated rounded parallelogram, cyan→blue token gradient,
 *                       inner highlight + faint grain
 *   L2 secondary blob — emerald gradient blob lower-right, behind the figure,
 *                       plus a thin diagonal line
 *   L3 decor          — diagonal capsules (amber/mint/sky), dots, a cursor
 *                       glyph and a play-triangle accent (all aria-hidden)
 *   L4 portrait       — <ProfilePortrait variant="stage-framed" />, bottom-centre
 *                       over the shape. TODO(asset): swap to a transparent
 *                       cutout for the reference "pop-out" once supplied.
 *
 * Every decorative layer is aria-hidden; the portrait is the only meaningful
 * content and is exposed via alt text.
 */
export const PortraitStage: React.FC<PortraitStageProps> = ({
  alt,
  src,
  className = '',
  variant = 'framed',
  delay = 0,
}) => {
  // Portrait srcset `sizes` mirrors the stage ladder x the portrait fill ratio,
  // so the browser picks the right stage variant for the real box.
  const portraitSizes =
    '(min-width: 1024px) clamp(346px, 23vw, 432px), (min-width: 640px) clamp(274px, 32vw, 317px), clamp(187px, 59vw, 274px)';

  return (
    <div
      data-testid="portrait-stage"
      className={`portrait-stage portrait-stage--${variant} ${className}`}
    >
      {/* L0 — Soft ambient glow behind the shape. */}
      <span aria-hidden="true" data-testid="stage-glow" className="portrait-stage__glow" />

      {/* L1 — Main geometric shape: rotated rounded parallelogram, cyan→blue. */}
      <span aria-hidden="true" data-testid="stage-shape" className="portrait-stage__shape" />

      {/* L2 — Secondary emerald blob + a thin diagonal line, behind the figure. */}
      <span aria-hidden="true" data-testid="stage-blob" className="portrait-stage__blob" />
      <span aria-hidden="true" className="portrait-stage__line" />

      {/* L3 — Decorative micro-elements (all aria-hidden). */}
      <span aria-hidden="true" data-testid="stage-decor" className="portrait-stage__decor">
        <span className="portrait-stage__cap portrait-stage__cap--amber" />
        <span className="portrait-stage__cap portrait-stage__cap--mint" />
        <span className="portrait-stage__cap portrait-stage__cap--sky" />
        <span className="portrait-stage__dot portrait-stage__dot--1" />
        <span className="portrait-stage__dot portrait-stage__dot--2" />
        <span className="portrait-stage__dot portrait-stage__dot--3" />
        <span className="portrait-stage__dot portrait-stage__dot--4" />
        {/* cursor-arrow glyph */}
        <svg className="portrait-stage__cursor" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 3.5 18.5 12l-6.1 1.4 3.3 6.6-2.7 1.3-3.3-6.6L5 18.5V3.5Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
        {/* play-triangle accent */}
        <svg className="portrait-stage__play" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
        </svg>
      </span>

      {/* Grounding shadow beneath the portrait (pre-baked, no runtime filters). */}
      <span aria-hidden="true" className="portrait-stage__ground" />

      {/* L4 — The portrait. Bottom-centre over the shape. */}
      <div className="portrait-stage__portrait">
        <ProfilePortrait
          src={src}
          alt={alt}
          sizes={portraitSizes}
          // TODO(asset): when the transparent cutout arrives, render a cutout
          // variant here (no frame, head breaks the shape's top edge). Until
          // then the framed fallback is the shipped composition.
          variant="stage-framed"
          delay={delay}
          showAvailability={false}
        />
      </div>
    </div>
  );
};

export default PortraitStage;