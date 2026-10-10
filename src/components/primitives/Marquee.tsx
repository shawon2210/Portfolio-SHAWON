import React from 'react';
import { useReducedMotion } from 'motion/react';

export interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right';
  speed?: number;
  speedSeconds?: number;
  pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  className = '',
  direction = 'left',
  speed,
  speedSeconds = 25,
  pauseOnHover = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const duration = speed ?? speedSeconds;

  if (shouldReduceMotion) {
    return (
      <div className={`flex flex-wrap gap-4 overflow-x-auto ${className}`}>
        {children}
      </div>
    );
  }

  const animationStyle = {
    animationDuration: `${duration}s`,
    animationDirection: direction === 'right' ? ('reverse' as const) : ('normal' as const),
  };

  return (
    <div
      className={`group relative flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] ${className}`}
    >
      <div
        className={`flex shrink-0 items-center justify-around gap-4 min-w-full animate-marquee ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]' : ''
        }`}
        style={animationStyle}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-around gap-4 min-w-full animate-marquee ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]' : ''
        }`}
        style={animationStyle}
      >
        {children}
      </div>
    </div>
  );
};
