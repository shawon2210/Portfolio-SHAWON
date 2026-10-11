import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from 'motion/react';

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  perspective = 1000,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 220, damping: 20, mass: 0.1 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotBackground = useMotionTemplate`radial-gradient(circle 240px at ${spotX}px ${spotY}px, rgba(56, 189, 248, 0.15), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotX.set(x);
    spotY.set(y);

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    mouseX.set(normX);
    mouseY.set(normY);

    rotateY.set(normX * maxTilt);
    rotateX.set(-normY * maxTilt);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  if (isTouch || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective,
        rotateX,
        rotateY,
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* Specular spotlight overlay */}
      <motion.div
        aria-hidden="true"
        style={{ background: spotBackground }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10 transition-opacity duration-300"
      />
      {children}
    </motion.div>
  );
};
