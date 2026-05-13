import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => {
  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`glass-card ${paddings[padding]} ${
        hover
          ? 'hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
