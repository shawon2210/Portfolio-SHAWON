import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ProfilePortrait } from './ProfilePortrait';
import { StageCard } from './StageCard';
import { usePortraitStageMotion } from './usePortraitStageMotion';
import { MOTION_EASING } from '../lib/motion';

export interface PortraitStageProps {
  /** Descriptive alt text. Use the person's name/title from portfolioData. */
  alt: string;
  /** Dev-only avatar override; when set, a plain <img> is used instead of the stage ladder. */
  src?: string;
  className?: string;
  /** 'framed' (default) is the shipped fallback until the cutout exists. */
  variant?: 'framed' | 'cutout';
  /** Base entrance delay (seconds) so the stage lands with the hero choreography. */
  delay?: number;
}

/**
 * MOBILE-FIRST v5 — the canonical premium "portrait stage".
 *
 * Layers (bottom → top), all SVG/CSS/Motion, NO WebGL (the shared 3D canvas is
 * untouched):
 *   L0 ambient glow   — blurred radial token gradient behind the shape (static)
 *   L1 main shape     — rotated rounded parallelogram, cyan→blue token gradient
 *   L2 secondary blob — emerald gradient blob lower-right, behind the figure
 *   L3 decor          — capsules, dots, cursor glyph, play accent (aria-hidden)
 *   L4 portrait       — <ProfilePortrait variant="stage-framed" /> over the shape
 *   L5 cards          — <StageCard /> stat / status / stack (real data)
 *
 * PHASE 3 motion (all transform/opacity; see usePortraitStageMotion for gating):
 *  - one-shot ~1.2s entrance, offset by `delay` so it lands with the hero
 *  - ≤6 ambient CSS loops, paused when off-screen / tab hidden / site pause / reduced
 *  - fine-pointer multi-layer parallax; no parallax on touch
 * Decorative layers are aria-hidden; the portrait is exposed via alt text.
 */
export const PortraitStage: React.FC<PortraitStageProps> = ({
  alt,
  src,
  className = '',
  variant = 'framed',
  delay = 0,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, ambient, entered, canParallax, onPointerMove, onPointerLeave, layers } =
    usePortraitStageMotion(stageRef);

  const show = reducedMotion || entered;
  const D = (t: number) => delay + t;

  // Portrait srcset `sizes` mirrors the stage ladder × portrait fill ratio.
  const portraitSizes =
    '(min-width: 1024px) clamp(346px, 23vw, 432px), (min-width: 640px) clamp(274px, 32vw, 317px), clamp(187px, 59vw, 274px)';

  return (
    <motion.div
      ref={stageRef}
      data-testid="portrait-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`portrait-stage portrait-stage--${variant} ${
        ambient ? 'portrait-stage--anim' : 'portrait-stage--still'
      } ${className}`}
    >
      {/* L0 — Soft ambient glow behind the shape. */}
      <span aria-hidden="true" data-testid="stage-glow" className="portrait-stage__glow" />

      {/* L1 — Main shape: clip-path wipe + rotation settle (parallax mid). */}
      <motion.span
        aria-hidden="true"
        data-testid="stage-shape"
        className="portrait-stage__shape-wrap"
        initial={reducedMotion ? false : { clipPath: 'inset(0% 100% 0% 0%)', rotate: -17, opacity: 0 }}
        animate={
          show
            ? { clipPath: 'inset(0% 0% 0% 0%)', rotate: -10, opacity: 1 }
            : { clipPath: 'inset(0% 100% 0% 0%)', rotate: -17, opacity: 0 }
        }
        transition={{ duration: 0.7, delay: D(0), ease: MOTION_EASING }}
        style={{ x: canParallax ? layers.shapeX : 0, y: canParallax ? layers.shapeY : 0 }}
      >
        <span className="portrait-stage__shape" />
      </motion.span>

      {/* L2 — Secondary emerald blob: scales in from its lower-right anchor (opposite parallax). */}
      <motion.span
        aria-hidden="true"
        className="portrait-stage__blob-wrap"
        initial={reducedMotion ? false : { scale: 0.4, opacity: 0 }}
        animate={show ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.6, delay: D(0.22), ease: MOTION_EASING }}
        style={{
          x: canParallax ? layers.blobX : 0,
          y: canParallax ? layers.blobY : 0,
          transformOrigin: '88% 88%',
        }}
      >
        <span data-testid="stage-blob" className="portrait-stage__blob" />
      </motion.span>

      {/* Diagonal line — static accent between shape and figure. */}
      <span aria-hidden="true" className="portrait-stage__line" />

      {/* L3 — Decor micro-elements: drift in, then parallax most (opposite). */}
      <motion.span
        aria-hidden="true"
        data-testid="stage-decor"
        className="portrait-stage__decor"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6, delay: D(0.4), ease: MOTION_EASING }}
        style={{ x: canParallax ? layers.decorX : 0, y: canParallax ? layers.decorY : 0 }}
      >
        <span className="portrait-stage__cap portrait-stage__cap--amber" />
        <span className="portrait-stage__cap portrait-stage__cap--mint" />
        <span className="portrait-stage__cap portrait-stage__cap--sky" />
        <span className="portrait-stage__dot portrait-stage__dot--1" />
        <span className="portrait-stage__dot portrait-stage__dot--2" />
        <span className="portrait-stage__dot portrait-stage__dot--3" />
        <span className="portrait-stage__dot portrait-stage__dot--4" />
        <svg className="portrait-stage__cursor" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 3.5 18.5 12l-6.1 1.4 3.3 6.6-2.7 1.3-3.3-6.6L5 18.5V3.5Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
        <svg className="portrait-stage__play" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
        </svg>
      </motion.span>

      {/* Grounding shadow beneath the portrait (static, pre-baked). */}
      <span aria-hidden="true" className="portrait-stage__ground" />

      {/* L4 — Portrait: tiny scale-up + least parallax (its rise/blur is ProfilePortrait's).
          The OUTER div keeps the CSS translateX(-50%) centering (Motion would
          clobber that transform), so the motion lives on an inner wrapper. */}
      <div className="portrait-stage__portrait">
        <motion.div
          className="portrait-stage__portrait-inner"
          initial={reducedMotion ? false : { scale: 1.04 }}
          animate={show ? { scale: 1 } : { scale: 1.04 }}
          transition={{ duration: 0.6, delay: D(0.3), ease: MOTION_EASING }}
          style={{ x: canParallax ? layers.portraitX : 0, y: canParallax ? layers.portraitY : 0 }}
        >
          <ProfilePortrait
            src={src}
            alt={alt}
            sizes={portraitSizes}
            // TODO(asset): swap to a transparent cutout (no frame, head breaks the
            // shape's top edge) once the asset is supplied.
            variant="stage-framed"
            delay={D(0.3)}
            showAvailability={false}
          />
        </motion.div>
      </div>

      {/* L5 — Floating cards: springy stagger; parallax via cardX/Y; ambient float on the inner div. */}
      <div data-testid="stage-cards" className="portrait-stage__cards">
        <motion.div
          className="portrait-stage__slot portrait-stage__slot--stat"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.72 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.72 }}
          transition={{ type: 'spring', stiffness: 340, damping: 18, delay: D(0.55) }}
          style={{ x: canParallax ? layers.cardX : 0, y: canParallax ? layers.cardY : 0 }}
        >
          <div className="portrait-stage__slot-float">
            <StageCard variant="stat" countUp={!reducedMotion && entered} />
          </div>
        </motion.div>

        <motion.div
          className="portrait-stage__slot portrait-stage__slot--status"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.72 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.72 }}
          transition={{ type: 'spring', stiffness: 340, damping: 18, delay: D(0.63) }}
          style={{ x: canParallax ? layers.cardX : 0, y: canParallax ? layers.cardY : 0 }}
        >
          <div className="portrait-stage__slot-float">
            <StageCard variant="status" />
          </div>
        </motion.div>

        <motion.div
          className="portrait-stage__slot portrait-stage__slot--stack"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.72 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.72 }}
          transition={{ type: 'spring', stiffness: 340, damping: 18, delay: D(0.71) }}
          style={{ x: canParallax ? layers.cardX : 0, y: canParallax ? layers.cardY : 0 }}
        >
          <div className="portrait-stage__slot-float">
            <StageCard variant="stack" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PortraitStage;