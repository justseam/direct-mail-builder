import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import SegmentedButton from '../ui/SegmentedButton';
import { useCampaign } from '../../stores/CampaignStore';
import { paperSizes } from '../../data/mockData';
import { cn } from '../../utils';

/* ── Layout Preview — miniature canvas page with zones + dimension lines ── */

function LayoutPreview({ paperSizeId }: { paperSizeId: string }) {
  const size = paperSizes.find(s => s.id === paperSizeId);
  if (!size) return null;

  const wInches = parseFloat(size.width.replace('"', ''));
  const hInches = parseFloat(size.height.replace('"', ''));
  const envelope = size.envelope; // 'House 10' | '6x9' | '9x12' | 'None'

  // Scale to fit a ~340px wide preview, with room for dimension lines
  const dimSpace = 40; // space for dimension annotations
  const maxW = 340;
  const maxH = 420;
  const scale = Math.min((maxW - dimSpace) / wInches, (maxH - dimSpace) / hInches) * 0.85;
  const pw = Math.round(wInches * scale);
  const ph = Math.round(hInches * scale);
  const ox = dimSpace; // page x offset (room for left dimension line)
  const oy = 10; // page y offset
  const margin = Math.round(pw * 0.059);
  const svgW = ox + pw + dimSpace;
  const svgH = oy + ph + dimSpace;

  const blue = '#93C5FD'; // blue-300
  const blueTxt = '#60A5FA'; // blue-400
  const dimColor = '#9CA3AF'; // gray-400

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="max-w-full h-auto">
      {/* Page background */}
      <rect x={ox} y={oy} width={pw} height={ph} fill="white" stroke="#D1D5DB" strokeWidth="1" />

      {/* Margin guides */}
      <rect
        x={ox + margin} y={oy + margin}
        width={pw - margin * 2} height={ph - margin * 2}
        fill="none" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="4 3"
      />

      {/* Fold lines for House 10 (tri-fold) */}
      {envelope === 'House 10' && (
        <>
          <line x1={ox} y1={oy + Math.round(ph / 3)} x2={ox + pw} y2={oy + Math.round(ph / 3)} stroke={blue} strokeWidth="0.8" strokeDasharray="4 3" />
          <text x={ox + 6} y={oy + Math.round(ph / 3) - 4} fontSize="8" fill={blueTxt} fontFamily="Roboto, sans-serif">Fold Line</text>
          <line x1={ox} y1={oy + Math.round(ph * 2 / 3)} x2={ox + pw} y2={oy + Math.round(ph * 2 / 3)} stroke={blue} strokeWidth="0.8" strokeDasharray="4 3" />
          <text x={ox + 6} y={oy + Math.round(ph * 2 / 3) - 4} fontSize="8" fill={blueTxt} fontFamily="Roboto, sans-serif">Fold Line</text>
        </>
      )}

      {/* Fold line for 6x9 (half-fold) */}
      {envelope === '6x9' && (
        <>
          <line x1={ox} y1={oy + Math.round(ph / 2)} x2={ox + pw} y2={oy + Math.round(ph / 2)} stroke={blue} strokeWidth="0.8" strokeDasharray="4 3" />
          <text x={ox + 6} y={oy + Math.round(ph / 2) - 4} fontSize="8" fill={blueTxt} fontFamily="Roboto, sans-serif">Fold Line</text>
        </>
      )}

      {/* Postal zones for House 10 */}
      {envelope === 'House 10' && (
        <>
          {/* Return address window */}
          <rect
            x={ox + margin + 8} y={oy + margin + 5}
            width={Math.round(pw * 0.32)} height={Math.round(ph * 0.066)}
            fill="white" stroke={blue} strokeWidth="1.5" rx="1"
          />
          <text
            x={ox + margin + 8 + Math.round(pw * 0.16)} y={oy + margin + 5 + Math.round(ph * 0.025)}
            textAnchor="middle" fontSize="6" fill={blueTxt} fontFamily="Roboto, sans-serif" fontWeight="500"
          >RETURN ADDRESS WINDOW</text>
          <rect x={ox + margin + 14} y={oy + margin + 5 + Math.round(ph * 0.032)} width={Math.round(pw * 0.18)} height="3" rx="1" fill={blue} opacity="0.4" />
          <rect x={ox + margin + 14} y={oy + margin + 5 + Math.round(ph * 0.042)} width={Math.round(pw * 0.14)} height="3" rx="1" fill={blue} opacity="0.4" />

          {/* Address window */}
          <rect
            x={ox + margin + 8} y={oy + margin + Math.round(ph * 0.1)}
            width={Math.round(pw * 0.37)} height={Math.round(ph * 0.095)}
            fill="white" stroke={blue} strokeWidth="1.5" rx="1"
          />
          <text
            x={ox + margin + 8 + Math.round(pw * 0.185)} y={oy + margin + Math.round(ph * 0.1) + Math.round(ph * 0.025)}
            textAnchor="middle" fontSize="6" fill={blueTxt} fontFamily="Roboto, sans-serif" fontWeight="500"
          >ADDRESS WINDOW</text>
          <rect x={ox + margin + 14} y={oy + margin + Math.round(ph * 0.1) + Math.round(ph * 0.035)} width={Math.round(pw * 0.22)} height="3" rx="1" fill={blue} opacity="0.4" />
          <rect x={ox + margin + 14} y={oy + margin + Math.round(ph * 0.1) + Math.round(ph * 0.048)} width={Math.round(pw * 0.18)} height="3" rx="1" fill={blue} opacity="0.4" />
          <rect x={ox + margin + 14} y={oy + margin + Math.round(ph * 0.1) + Math.round(ph * 0.061)} width={Math.round(pw * 0.20)} height="3" rx="1" fill={blue} opacity="0.4" />
        </>
      )}

      {/* ── Dimension lines ── */}
      {/* Width — bottom */}
      <line x1={ox} y1={oy + ph + 16} x2={ox + pw} y2={oy + ph + 16} stroke={dimColor} strokeWidth="0.8" />
      <line x1={ox} y1={oy + ph + 10} x2={ox} y2={oy + ph + 22} stroke={dimColor} strokeWidth="0.8" />
      <line x1={ox + pw} y1={oy + ph + 10} x2={ox + pw} y2={oy + ph + 22} stroke={dimColor} strokeWidth="0.8" />
      <text
        x={ox + pw / 2} y={oy + ph + 30}
        textAnchor="middle" fontSize="10" fill={dimColor} fontFamily="Roboto, sans-serif" fontWeight="500"
      >{wInches}&quot;</text>

      {/* Height — left */}
      <line x1={ox - 16} y1={oy} x2={ox - 16} y2={oy + ph} stroke={dimColor} strokeWidth="0.8" />
      <line x1={ox - 22} y1={oy} x2={ox - 10} y2={oy} stroke={dimColor} strokeWidth="0.8" />
      <line x1={ox - 22} y1={oy + ph} x2={ox - 10} y2={oy + ph} stroke={dimColor} strokeWidth="0.8" />
      <text
        x={ox - 18} y={oy + ph / 2}
        textAnchor="middle" fontSize="10" fill={dimColor} fontFamily="Roboto, sans-serif" fontWeight="500"
        transform={`rotate(-90, ${ox - 18}, ${oy + ph / 2})`}
      >{hInches}&quot;</text>
    </svg>
  );
}

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
          {paperSizes.map((size, i) => (
            <button
              key={size.id}
              className={cn(
                'w-5 h-5 rounded-full transition-colors cursor-pointer',
                draft.paperSizeId === size.id ? 'bg-[#A9BBC6]' : 'bg-[#E9EFF3] hover:bg-[#C5CDD3]',
              )}
              onClick={() => {
                setPaperSize(size.id);
                const container = scrollRef.current;
                if (container) {
                  const cards = container.children;
                  if (cards[i]) {
                    (cards[i] as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Layout Preview */}
      {draft.paperSizeId && (
        <div className="mt-10 flex justify-center">
          <LayoutPreview paperSizeId={draft.paperSizeId} />
        </div>
      )}
    </div>
  );
}
