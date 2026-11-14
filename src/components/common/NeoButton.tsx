import React from 'react';
import { cn } from '@/lib/utils';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'neutral' | 'outline' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-amber-300 text-black hover:bg-amber-400',
    accent: 'bg-lime-400 text-black hover:bg-lime-500',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    neutral: 'bg-white text-black hover:bg-zinc-100 dark:bg-zinc-800 dark:text-white',
    outline: 'bg-transparent text-black border-black hover:bg-black/5 dark:text-white dark:border-white',
    purple: 'bg-purple-600 text-white hover:bg-purple-700'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs font-bold gap-1.5',
    md: 'px-4 py-2 text-sm font-bold gap-2',
    lg: 'px-6 py-3 text-base font-extrabold gap-2.5'
  };

  return (
    <button
      className={cn(
        'neo-btn select-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

