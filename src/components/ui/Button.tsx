import { cn } from '../../utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-border text-primary bg-white hover:bg-gray-50',
  ghost: 'text-text-secondary hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[13px] gap-1.5',
  md: 'px-4 py-2 text-[14px] gap-2',
  lg: 'px-6 py-2.5 text-[15px] gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-[24px] transition-colors cursor-pointer whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        props.disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
