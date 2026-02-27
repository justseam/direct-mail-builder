import { cn } from '../../utils';
import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-label-md font-medium text-text-secondary">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            'w-full appearance-none rounded-[8px] border border-border bg-white px-3 py-2 pr-8 text-body-md text-text-primary',
            'outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer',
            className,
          )}
          {...props}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}
