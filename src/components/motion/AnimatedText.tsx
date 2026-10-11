import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'h3';
  offset?: [`${number | 'start' | 'end'} ${number | 'start' | 'end'}`, `${number | 'start' | 'end'} ${number | 'start' | 'end'}`];
}

interface CharProps {
  char: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}

const Char: React.FC<CharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  as = 'p',
  offset = ['start 0.85', 'end 0.25'],
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef as unknown as React.RefObject<HTMLElement>,
    offset,
  });

  const characters = text.split('');
  const totalChars = characters.length;
  const Tag = as;

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      ref={containerRef as unknown as React.Ref<never>}
      className={`relative select-none ${className}`}
      aria-label={text}
    >
      {/* Accessible invisible copy for screen readers and search bots */}
      <span className="sr-only">{text}</span>

      {/* Visual character-by-character scroll reveal */}
      <span aria-hidden="true" className="inline flex-wrap">
        {characters.map((char, index) => {
          const start = index / totalChars;
          const end = Math.min(1, start + 0.15);
          return (
            <Char
              key={index}
              char={char}
              progress={scrollYProgress}
              range={[start, end]}
            />
          );
        })}
      </span>
    </Tag>
  );
};
