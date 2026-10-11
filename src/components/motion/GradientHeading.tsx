import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CINEMATIC_EASING } from '../../lib/motion';

export interface GradientHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  gradient?: string;
  delay?: number;
  stagger?: number;
}

export const GradientHeading: React.FC<GradientHeadingProps> = ({
  text,
  className = '',
  as = 'h2',
  gradient = 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
  delay = 0.1,
  stagger = 0.035,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Tag = as;
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return (
      <Tag
        className={`font-black tracking-[-0.03em] uppercase leading-none select-none ${className}`}
        style={{
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={`font-black tracking-[-0.03em] uppercase leading-none select-none flex flex-wrap gap-x-[0.25em] ${className}`}
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          className="inline-flex overflow-hidden py-1"
          style={{
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {word.split('').map((char, charIdx) => {
            const letterIndex = words.slice(0, wordIdx).join('').length + charIdx;
            return (
              <motion.span
                key={charIdx}
                initial={{ y: '115%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, margin: '100px' }}
                transition={{
                  duration: 0.65,
                  delay: delay + letterIndex * stagger,
                  ease: CINEMATIC_EASING,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};
