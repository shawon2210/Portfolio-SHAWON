import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';

export interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  strength?: number;
  disabled?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  className = '',
  padding = 40,
  strength = 0.35,
  disabled = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.1 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isTouch || shouldReduceMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const boundX = rect.width / 2 + padding;
    const boundY = rect.height / 2 + padding;

    if (Math.abs(distanceX) < boundX && Math.abs(distanceY) < boundY) {
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (disabled || isTouch || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
