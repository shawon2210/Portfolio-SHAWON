import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: 'section' | 'div' | 'article';
}

export const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  children,
  as: Component = 'section',
  ...props
}) => {
  return (
    <Component
      id={id}
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 sm:py-16 lg:py-20 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
