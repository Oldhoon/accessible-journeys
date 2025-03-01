
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2 font-display font-bold', sizeClasses[size], className)}>
      <div className="relative w-8 h-8 bg-accessibility-blue rounded-lg flex items-center justify-center overflow-hidden">
        <span className="text-white text-lg">A</span>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20" />
      </div>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-accessibility-blue to-accessibility-blue/80">
        Access
      </span>
    </div>
  );
};

export default Logo;
