import { cn } from '../../utils';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export default function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-label-md font-medium text-text-secondary">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full rounded-[8px] border border-border bg-white px-3 py-2 text-body-md text-text-primary',
            'placeholder:text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary/30',
            'transition-colors',
            icon ? 'pl-10' : false,
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}
