import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SegmentedButton from '../ui/SegmentedButton';
import Card from '../ui/Card';
import { useCampaign } from '../../stores/CampaignStore';
import { paperSizes } from '../../data/mockData';
import { cn } from '../../utils';

export default function StepSize() {
  const { draft, setFormatType, setPaperSize } = useCampaign();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      {/* Format Type */}
      <div className="mb-10">
        <h3 className="text-title-md font-medium text-text-primary mb-1">Format Type</h3>
        <p className="text-body-sm text-text-secondary mb-4">Choose single-sided or double-sided printing</p>
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
        <h3 className="text-title-md font-medium text-text-primary mb-1">Paper Size</h3>
        <p className="text-body-sm text-text-secondary mb-4">Select the paper size for your mail piece</p>

        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-2 px-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {paperSizes.map(size => (
              <Card
                key={size.id}
                selected={draft.paperSizeId === size.id}
                className={cn(
                  'min-w-[200px] cursor-pointer hover:shadow-sm transition-all',
                  draft.paperSizeId === size.id && 'ring-1 ring-selected',
                )}
                onClick={() => setPaperSize(size.id)}
              >
                <div className="flex flex-col items-center text-center gap-2 py-4">
                  {/* Paper icon representation */}
                  <div className="w-16 h-20 border-2 border-border rounded-[4px] flex items-center justify-center">
                    <span className="text-[10px] text-text-secondary">{size.width} x {size.height}</span>
                  </div>
                  <h4 className="text-title-sm font-medium mt-2">{size.name}</h4>
                  <p className="text-body-sm text-text-secondary">{size.width} x {size.height}</p>
                  <p className="text-label-sm text-text-secondary">Max {size.maxPages} pages</p>
                </div>
              </Card>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {paperSizes.map(size => (
            <span
              key={size.id}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                draft.paperSizeId === size.id ? 'bg-primary' : 'bg-gray-300',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
