import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import SegmentedButton from '../ui/SegmentedButton';
import { useCampaign } from '../../stores/CampaignStore';
import { paperSizes } from '../../data/mockData';
import { cn } from '../../utils';

export default function StepSize() {
  const { draft, setFormatType, setPaperSize } = useCampaign();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Format Type */}
      <div className="mb-10">
        <h3 className="text-title-md font-medium text-text-primary mb-4">Format Type</h3>
        <SegmentedButton
          options={[
            { value: 'simplex', label: 'SIMPLEX' },
            { value: 'duplex', label: 'DUPLEX' },
          ]}
          value={draft.formatType}
          onChange={v => setFormatType(v as 'simplex' | 'duplex')}
        />
      </div>

      {/* Paper Size */}
      <div>
        <h3 className="text-title-md font-medium text-text-primary mb-4">Paper Size</h3>

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-2 px-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {paperSizes.map(size => {
              const selected = draft.paperSizeId === size.id;
              return (
                <button
                  key={size.id}
                  className={cn(
                    'min-w-[220px] sm:min-w-[260px] rounded-[16px] p-4 cursor-pointer transition-all text-left flex flex-col shrink-0',
                    selected
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-[#E9EFF3] text-text-primary hover:shadow-sm',
                  )}
                  onClick={() => setPaperSize(size.id)}
                >
                  {/* Title */}
                  <h4 className={cn(
                    'text-[18px] sm:text-[20px] font-medium leading-tight mb-4',
                    selected ? 'text-white' : 'text-text-primary',
                  )}>
                    {size.name}
                  </h4>

                  {/* Size + Max Page Limit */}
                  <div className="flex gap-4 mb-6">
                    <div>
                      <span className={cn(
                        'text-[10px] uppercase font-medium tracking-wide',
                        selected ? 'text-white/70' : 'text-text-secondary',
                      )}>
                        SIZE:
                      </span>
                      <p className={cn(
                        'text-[16px] font-medium',
                        selected ? 'text-white' : 'text-text-primary',
                      )}>
                        {size.width} x {size.height}
                      </p>
                    </div>
                    <div>
                      <span className={cn(
                        'text-[10px] uppercase font-medium tracking-wide',
                        selected ? 'text-white/70' : 'text-text-secondary',
                      )}>
                        MAX PAGE LIMIT:
                      </span>
                      <p className={cn(
                        'text-[16px] font-medium',
                        selected ? 'text-white' : 'text-text-primary',
                      )}>
                        {size.maxPages}
                      </p>
                    </div>
                  </div>

                  {/* Spacer + Check */}
                  <div className="flex-1" />
                  <div className="flex justify-end">
                    {selected && (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scroll(1)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {paperSizes.map(size => (
            <span
              key={size.id}
              className={cn(
                'w-5 h-5 rounded-full transition-colors',
                draft.paperSizeId === size.id ? 'bg-[#A9BBC6]' : 'bg-[#E9EFF3]',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
