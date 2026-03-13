import { Check } from 'lucide-react';
import SegmentedButton from '../ui/SegmentedButton';
import Input from '../ui/Input';
import { useCampaign } from '../../stores/CampaignStore';
import { paperStocks, envelopeStocks } from '../../data/mockData';
import { cn } from '../../utils';

/* ── Envelope SVG Illustrations ──────────────────────── */

/** House 10 Double Window — wide envelope with flap, letter behind with two dashed address windows */
function House10Illustration() {
  return (
    <svg viewBox="0 0 220 160" className="w-[200px] h-[140px]">
      {/* Back letter/paper */}
      <rect x="55" y="8" width="130" height="140" rx="2" fill="#E8EAED" stroke="#C4C8CC" strokeWidth="1" />
      {/* Address lines on back letter */}
      <rect x="70" y="55" width="65" height="10" rx="1" fill="none" stroke="#B0B5BC" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="70" y="72" width="80" height="10" rx="1" fill="none" stroke="#B0B5BC" strokeWidth="1" strokeDasharray="3 2" />

      {/* Front envelope body */}
      <rect x="10" y="35" width="170" height="115" rx="3" fill="white" stroke="#9CA3AF" strokeWidth="1.2" />
      {/* Envelope flap — dashed triangle */}
      <polyline points="10,35 95,85 180,35" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4 3" />

      {/* Double windows on envelope */}
      <rect x="25" y="75" width="55" height="22" rx="2" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="25" y="105" width="70" height="16" rx="2" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}

/** House 9x12 — tall envelope with document peeking out, small window */
function House9x12Illustration() {
  return (
    <svg viewBox="0 0 170 190" className="w-[140px] h-[155px]">
      {/* Document peeking out top-right */}
      <rect x="65" y="5" width="90" height="120" rx="2" fill="#E8EAED" stroke="#C4C8CC" strokeWidth="1" />
      {/* Lines on document */}
      <rect x="78" y="22" width="50" height="6" rx="1" fill="#D1D5DB" />
      <rect x="78" y="34" width="40" height="6" rx="1" fill="#D1D5DB" />

      {/* Front envelope body */}
      <rect x="8" y="30" width="130" height="155" rx="3" fill="white" stroke="#9CA3AF" strokeWidth="1.2" />
      {/* Small window */}
      <rect x="22" y="80" width="45" height="30" rx="2" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}

/** House 6x9 — tall envelope with triangular flap, document behind with address block */
function House6x9Illustration() {
  return (
    <svg viewBox="0 0 170 190" className="w-[140px] h-[155px]">
      {/* Back document */}
      <rect x="50" y="5" width="105" height="140" rx="2" fill="#E8EAED" stroke="#C4C8CC" strokeWidth="1" />
      {/* Address block on document */}
      <rect x="65" y="45" width="55" height="18" rx="1" fill="none" stroke="#B0B5BC" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="65" y="70" width="68" height="18" rx="1" fill="none" stroke="#B0B5BC" strokeWidth="1" strokeDasharray="3 2" />

      {/* Front envelope body */}
      <rect x="8" y="35" width="125" height="150" rx="3" fill="white" stroke="#9CA3AF" strokeWidth="1.2" />
      {/* Triangular flap */}
      <polyline points="8,35 70,90 133,35" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4 3" />
    </svg>
  );
}

function EnvelopeIllustration({ stockId }: { stockId: string }) {
  switch (stockId) {
    case 'house-10-dw': return <House10Illustration />;
    case 'house-9x12': return <House9x12Illustration />;
    case 'house-6x9': return <House6x9Illustration />;
    default: return <House10Illustration />;
  }
}

export default function StepMailOptions() {
  const { draft, setPostageType, setReturnAddress, setPaperStock, setEnvelopeStock } = useCampaign();

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Postage Type + Return Address row */}
      <div className="mb-10 flex flex-col sm:flex-row gap-6 sm:gap-10">
        <div>
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
        <div className="flex-1">
          <h3 className="text-title-md font-medium text-text-primary mb-4">
            Return Address <span className="text-red-500">*</span>
          </h3>
          <Input
            placeholder="123 Main St, Springfield, IL 62704"
            value={draft.returnAddress}
            onChange={e => setReturnAddress(e.target.value)}
            error={
              draft.returnAddress.trim().length === 0 && draft.paperStockId && draft.envelopeStockId
                ? 'Return address is required to continue'
                : undefined
            }
            className="w-full"
          />
        </div>
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
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {envelopeStocks.map(stock => {
            const selected = draft.envelopeStockId === stock.id;
            return (
              <button
                key={stock.id}
                className={cn(
                  'min-w-[260px] sm:min-w-[280px] flex-1 rounded-[16px] cursor-pointer transition-all text-left overflow-hidden group',
                  selected
                    ? 'bg-[#242F42] shadow-lg ring-2 ring-[#242F42]'
                    : 'bg-white border border-border hover:ring-2 hover:ring-[#0EA5E9] hover:border-transparent',
                )}
                onClick={() => setEnvelopeStock(stock.id)}
              >
                {/* Illustration area */}
                <div className={cn(
                  'rounded-t-[16px] h-[180px] flex items-center justify-center transition-colors',
                  selected ? 'bg-white' : 'bg-[#F1F2F3] group-hover:bg-white',
                )}>
                  <EnvelopeIllustration stockId={stock.id} />
                </div>

                {/* Content area */}
                <div className="p-4">
                  <p className={cn(
                    'text-[14px] font-medium leading-tight',
                    selected ? 'text-white' : 'text-text-primary',
                  )}>
                    {stock.name}
                  </p>
                  <p className={cn(
                    'text-[16px] font-semibold mt-1',
                    selected ? 'text-white' : 'text-[#0EA5E9]',
                  )}>
                    $ {stock.pricePerUnit.toFixed(2)}
                  </p>
                  <p className={cn(
                    'text-[11px]',
                    selected ? 'text-white/60' : 'text-text-secondary',
                  )}>
                    Per unit price
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
