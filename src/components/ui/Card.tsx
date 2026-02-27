import { cn } from '../../utils';
import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children: ReactNode;
}

export default function Card({ selected, children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[12px] border bg-white p-4 transition-all',
        selected ? 'border-selected border-2 shadow-sm' : 'border-border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
