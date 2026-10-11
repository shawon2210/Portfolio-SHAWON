import React, { useEffect, useRef } from 'react';
import { anchorRegistry, AnchorName } from '../../lib/anchorRegistry';

export interface Anchor3DProps {
  name: AnchorName;
  className?: string;
  children?: React.ReactNode;
}

export const Anchor3D: React.FC<Anchor3DProps> = ({
  name,
  className = '',
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    anchorRegistry.register(name, el);
    return () => {
      anchorRegistry.unregister(name);
    };
  }, [name]);

  return (
    <div
      ref={ref}
      data-3d={name}
      className={`relative ${className}`}
    >
      {children}
    </div>
  );
};
