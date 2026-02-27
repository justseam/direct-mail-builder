import { useRef } from 'react';
import { Check, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import SegmentedButton from '../ui/SegmentedButton';
import { useCampaign } from '../../stores/CampaignStore';
import { paperStocks, envelopeStocks } from '../../data/mockData';
import { cn } from '../../utils';
import type { EnvelopeStock } from '../../types';

/* ── Paper Stack Illustration ────────────────────────── */
function PaperStackIcon() {
  return (
    <div className="relative w-[160px] h-[220px] mx-auto">
      {/* Back sheet */}
      <div className="absolute left-[12px] top-[10px] w-[148px] h-[210px] bg-[#CACCCF] rounded-[3px]" />
      {/* Middle sheet */}
      <div className="absolute left-[6px] top-[5px] w-[149px] h-[210px] bg-[#D9DADC] rounded-[3px]" />
      {/* Front sheet */}
      <div className="absolute left-0 top-0 w-[150px] h-[210px] bg-[#E7E8E9] rounded-[3px]" />
    </div>
  );
}

/* ── Envelope SVG Illustrations ──────────────────────── */
function EnvelopeIllustration({ shape }: { shape: EnvelopeStock['shape'] }) {
  if (shape === 'wide') {
    // House 10 Double Window - wider, shorter
    return (
      <svg viewBox="0 0 200 120" className="w-[180px] h-[100px]">
        <rect x="10" y="10" width="180" height="100" rx="2" fill="none" stroke="#2D446B" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="100" y2="60" stroke="#2D446B" strokeWidth="1" />
        <line x1="190" y1="10" x2="100" y2="60" stroke="#2D446B" strokeWidth="1" />
        {/* Double windows */}
        <rect x="25" y="55" width="50" height="25" rx="1" fill="none" stroke="#A8BBC5" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="25" y="85" width="70" height="15" rx="1" fill="none" stroke="#A8BBC5" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
    );
  }
  // Tall envelopes (6x9, 9x12)
  const isLarge = shape === 'tall';
  return (
    <svg viewBox="0 0 160 200" className={cn('h-[140px]', isLarge ? 'w-[120px]' : 'w-[100px]')}>
      <rect x="5" y="5" width="150" height="190" rx="2" fill="none" stroke="#2D446B" strokeWidth="1.5" />
      <line x1="5" y1="5" x2="80" y2="70" stroke="#2D446B" strokeWidth="1" />
      <line x1="155" y1="5" x2="80" y2="70" stroke="#2D446B" strokeWidth="1" />
      <polyline points="5,5 80,70 155,5" fill="none" stroke="#2D446B" strokeWidth="1" />
    </svg>
  );
}

export default function StepMailOptions() {
  const { draft, setPostageType, setPaperStock, setEnvelopeStock } = useCampaign();
  const envScrollRef = useRef<HTMLDivElement>(null);

  const scrollEnv = (dir: number) => {
    envScrollRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Postage Type */}
      <div className="mb-10">
        <h3 className="text-title-md font-medium text-text-primary mb-4">Postage Type</h3>
        <SegmentedButton
          options={[
            { value: 'first-class', label: 'First Class' },
            { value: 'marketing', label: 'Marketing Postage Rate' },
          ]}
          value={draft.postageType}
          onChange={v => setPostageType(v as 'first-class' | 'marketing')}
        />
      </div>

      {/* Paper Stock */}
      <div className="mb-10">
        <h3 className="text-title-md font-medium text-text-primary mb-4">Paper Stock</h3>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {paperStocks.map(stock => {
            const selected = draft.paperStockId === stock.id;
            return (
              <button
                key={stock.id}
                className={cn(
                  'min-w-[210px] sm:min-w-[240px] rounded-[16px] cursor-pointer transition-all text-left shrink-0 p-5',
                  selected
                    ? 'bg-primary shadow-md'
                    : 'bg-white border border-border hover:shadow-sm',
                )}
                onClick={() => setPaperStock(stock.id)}
              >
                {/* Paper stack visual */}
                <div className="mb-3 flex justify-center">
                  <div className="relative w-[160px] h-[180px]">
                    {/* Back sheet */}
                    <div className="absolute left-[10px] top-[8px] w-[140px] h-[165px] bg-[#CACCCF] rounded-[3px]" />
                    {/* Middle sheet */}
                    <div className="absolute left-[5px] top-[4px] w-[141px] h-[165px] bg-[#D9DADC] rounded-[3px]" />
                    {/* Front sheet */}
                    <div className="absolute left-0 top-0 w-[142px] h-[165px] bg-[#E7E8E9] rounded-[3px] p-3 flex flex-col">
                      {/* Top row: count badge + check */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-[#FAFAFC] text-primary text-[10px] font-medium px-2 py-0.5 rounded-sm">
                          {stock.sheetCount}
                        </span>
                        {selected && (
                          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                        )}
                      </div>
                      {/* Paper name */}
                      <p className="text-primary text-[12px] font-medium leading-tight mb-1">
                        {stock.name}
                      </p>
                      {/* Description */}
                      <p className="text-primary/70 text-[10px] leading-tight">
                        {stock.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className={cn(
                  'pt-2',
                  selected ? 'text-white' : 'text-text-primary',
                )}>
                  <p className={cn(
                    'text-[18px] font-medium',
                    selected ? 'text-white' : 'text-primary',
                  )}>
                    $ {stock.pricePerUnit.toFixed(3)}
                  </p>
                  <p className={cn(
                    'text-[11px]',
                    selected ? 'text-white/70' : 'text-text-secondary',
                  )}>
                    Per unit price
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Envelope Stock */}
      <div>
        <h3 className="text-title-md font-medium text-text-primary mb-4">Envelope Stock</h3>

        <div className="relative">
          <button
            onClick={() => scrollEnv(-1)}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={envScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 px-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {envelopeStocks.map(stock => {
              const selected = draft.envelopeStockId === stock.id;
              return (
                <button
                  key={stock.id}
                  className={cn(
                    'min-w-[280px] sm:min-w-[320px] rounded-[20px] cursor-pointer transition-all text-left shrink-0 overflow-hidden',
                    selected
                      ? 'bg-primary shadow-md'
                      : 'bg-white border border-border hover:shadow-sm',
                  )}
                  onClick={() => setEnvelopeStock(stock.id)}
                >
                  {/* Illustration area */}
                  <div className="bg-[#F1F2F3] rounded-t-[20px] h-[180px] flex items-center justify-center">
                    <EnvelopeIllustration shape={stock.shape} />
                  </div>

                  {/* Content area */}
                  <div className="p-4 flex items-start justify-between gap-2">
                    <div>
                      <p className={cn(
                        'text-[15px] font-medium leading-tight',
                        selected ? 'text-white' : 'text-primary',
                      )}>
                        {stock.name}
                      </p>
                      <p className={cn(
                        'text-[16px] font-medium mt-1',
                        selected ? 'text-white' : 'text-primary',
                      )}>
                        $ {stock.pricePerUnit.toFixed(2)}
                      </p>
                      <p className={cn(
                        'text-[11px]',
                        selected ? 'text-white/70' : 'text-text-secondary',
                      )}>
                        Per unit price
                      </p>
                    </div>
                    <Info className={cn(
                      'w-5 h-5 shrink-0 mt-1',
                      selected ? 'text-white' : 'text-primary',
                    )} />
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollEnv(1)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
