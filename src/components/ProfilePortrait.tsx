import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  PORTRAIT_SRCSET,
  PORTRAIT_INTRINSIC,
  PORTRAIT_FALLBACK_SRC,
} from '../data/portraitManifest';
import {
  STAGE_PORTRAIT_SRCSET,
  STAGE_PORTRAIT_INTRINSIC,
  STAGE_PORTRAIT_FALLBACK_SRC,
} from '../data/stagePortraitManifest';
import { usePrefersReducedMotion, EASE_MICRO } from '../lib/motion';

export interface ProfilePortraitProps {
  /** Source for the <img> fallback; the <picture> ladder is generated from it. */
  src?: string;
  /** Descriptive alt text. Should name the person, not describe the box. */
  alt: string;
  /**
   * `sizes` must describe the REAL rendered width so the browser can pick a
   * sensible candidate from srcset. The clamp() ladder below is mirrored here.
   */
  sizes?: string;
  className?: string;
  /** Show the availability dot on the frame corner. */
  showAvailability?: boolean;
  /** Entrance delay from the load choreography clock (seconds). */
  delay?: number;
  /** 'hero' is larger and gets the tilt; 'compact' is for secondary placements. */
  variant?: 'hero' | 'compact' | 'stage-framed';
}

/**
 * MOBILE-FIRST v4 — PHASE 2: the single canonical portrait.
 *
 * Ratio is a true 7:9 passport crop, baked into the source at build time by
 * scripts/build-portrait.mjs. Because the source ratio equals the display
 * ratio, `object-fit: cover` is a no-op safety net and the face is structurally
 * incapable of being clipped at any viewport — which is why no per-breakpoint
 * object-position tweaking is needed here.
 *
 * Sizing follows the brief exactly (width):
 *   320–399px  clamp(200px, 62vw, 260px)
 *   400–639px  clamp(240px, 58vw, 300px)
 *   640–1023px clamp(280px, 34vw, 340px)
 *   1024px+    clamp(320px, 26vw, 420px)
 *
 * Floor guarantees: never < 200px on phones, never < 320px on desktop.
 */
export const ProfilePortrait: React.FC<ProfilePortraitProps> = ({
  src,
  alt,
  sizes,
  className = '',
  showAvailability = true,
  delay = 0,
  variant = 'hero',
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  // Tilt is gated in CSS behind `(hover: hover) and (pointer: fine)`, so touch
  // devices never latch it and reduced-motion users get no transform at all.
  const useCustomSource = !!src;

  // The stage-framed variant reads the higher-res stage ladder (sourced from the
  // 1024px master); hero/compact keep the v4 ladder. Both are pre-cropped 7:9.
  const isStage = variant === 'stage-framed';
  const ladder = isStage
    ? {
        avif: STAGE_PORTRAIT_SRCSET.avif,
        webp: STAGE_PORTRAIT_SRCSET.webp,
        jpg: STAGE_PORTRAIT_FALLBACK_SRC,
        intrinsic: STAGE_PORTRAIT_INTRINSIC,
      }
    : {
        avif: PORTRAIT_SRCSET.avif,
        webp: PORTRAIT_SRCSET.webp,
        jpg: PORTRAIT_FALLBACK_SRC,
        intrinsic: PORTRAIT_INTRINSIC,
      };

  return (
    <div
      ref={ref}
      data-testid={
        variant === 'hero' ? 'hero-portrait' : isStage ? 'portrait-stage-frame' : 'portrait-compact'
      }
      className={`profile-portrait profile-portrait--${variant} ${className}`}
    >
      {/* Accent glow ring behind the frame — echoes --color-accent without
          touching the face itself (no filters, no dimming). */}
      <span
        aria-hidden="true"
        className="profile-portrait__glow"
      />

      <motion.div
        className="profile-portrait__frame"
        initial={reducedMotion ? false : { opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={
          reducedMotion
            ? undefined
            : inView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 18, filter: 'blur(10px)' }
        }
        transition={{ duration: 0.85, delay, ease: EASE_MICRO }}
      >
        {useCustomSource ? (
          <img
            src={src}
            alt={alt}
            decoding="async"
            fetchPriority="high"
            data-testid="portrait-image"
            className="profile-portrait__img"
          />
        ) : (
          <picture>
            <source type="image/avif" srcSet={ladder.avif} sizes={sizes} />
            <source type="image/webp" srcSet={ladder.webp} sizes={sizes} />
            <img
              src={ladder.jpg}
              alt={alt}
              width={ladder.intrinsic.width}
              height={ladder.intrinsic.height}
              loading="eager"
              decoding="async"
              // The hero portrait is the LCP candidate — it must not queue behind
              // anything else in the critical path.
              fetchPriority="high"
              data-testid="portrait-image"
              className="profile-portrait__img"
            />
          </picture>
        )}

        {/* Tints the neutral studio backdrop toward the canvas colour. Sits in its own
            layer so the <img> itself carries no filter and the face stays
            natural. */}
        <span aria-hidden="true" className="profile-portrait__backdrop-veil" />

        {/* Subtle top-edge sheen, drawn above the image but below content. */}
        <span aria-hidden="true" className="profile-portrait__sheen" />

        {/* Cool rim light tying the frame into the accent palette. */}
        <span aria-hidden="true" className="profile-portrait__rim" />

        {showAvailability && (
          <span
            aria-hidden="true"
            className="profile-portrait__availability"
            title="Open to work"
          >
            <span className="profile-portrait__ping" />
            <span className="profile-portrait__dot" />
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePortrait;