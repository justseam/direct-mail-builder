import { cn } from '../../utils';

interface SegmentedButtonProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function SegmentedButton({ options, value, onChange }: SegmentedButtonProps) {
  return (
    <div className="inline-flex rounded-[8px] border border-border bg-white overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={cn(
            'px-5 py-2 text-[14px] font-medium transition-colors cursor-pointer',
            'border-r border-border last:border-r-0',
            opt.value === value
              ? 'bg-primary text-white'
              : 'text-text-primary hover:bg-gray-50',
          )}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
