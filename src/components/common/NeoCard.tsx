import React from 'react';
import { cn } from '@/lib/utils';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'sand' | 'blue' | 'yellow' | 'green' | 'pink' | 'purple' | 'dark';
  shadowSize?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  variant = 'white',
  shadowSize = 'md',
  className,
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white text-zinc-900',
    sand: 'bg-[#FAF6EE] text-zinc-900',
    blue: 'bg-blue-600 text-white',
    yellow: 'bg-amber-300 text-zinc-900',
    green: 'bg-lime-400 text-zinc-900',
    pink: 'bg-rose-400 text-zinc-900',
    purple: 'bg-purple-300 text-zinc-900',
    dark: 'bg-zinc-900 text-white dark:bg-zinc-800'
  };

  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-[2px_2px_0px_#000000]',
    md: 'shadow-[4px_4px_0px_#000000]',
    lg: 'shadow-[6px_6px_0px_#000000]'
  };

  return (
    <div
      className={cn(
        'border-[2.5px] border-black rounded-lg transition-all',
        variantStyles[variant],
        shadowStyles[shadowSize],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
