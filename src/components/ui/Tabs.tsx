import { cn } from '../../utils';

interface TabsProps {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-border">
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={cn(
            'px-4 py-3 text-[14px] font-medium transition-colors cursor-pointer -mb-px',
            tab.value === value
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary',
          )}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
