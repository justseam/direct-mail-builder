import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useCampaign } from '../../stores/CampaignStore';
import { paperSizes, paperStocks, envelopeStocks, getPageDimensions } from '../../data/mockData';
import { formatCurrency, formatNumber } from '../../utils';
import CanvasPage from '../canvas/CanvasPage';

export default function StepSummary() {
  const { draft, audiences } = useCampaign();
  const [previewPage, setPreviewPage] = useState(0);

  const audience = audiences.find(a => a.id === draft.audienceId);
  const paperSize = paperSizes.find(p => p.id === draft.paperSizeId);
  const paper = paperStocks.find(p => p.id === draft.paperStockId);
  const envelope = envelopeStocks.find(e => e.id === draft.envelopeStockId);
  const audienceCount = audience?.audienceCount || 0;

  const { width: pageW, height: pageH } = getPageDimensions(draft.paperSizeId);
  const envelopeType = paperSize?.envelope || 'House 10';

  // Scale the page preview to fit within 400px wide
  const previewScale = 380 / pageW;
  const previewHeight = pageH * previewScale;

  const summaryItems = [
    { label: 'Internal Name', value: draft.name },
    { label: 'Return Address', value: draft.returnAddress || 'Not set' },
    { label: 'Format Type', value: draft.formatType.toUpperCase() },
    { label: 'Paper Size', value: paperSize ? `${paperSize.name} (${paperSize.width} x ${paperSize.height})` : 'Not selected' },
    { label: 'Postage Type', value: draft.postageType === 'first-class' ? 'First Class' : 'Marketing Rate' },
    { label: 'Paper Stock', value: paper?.name || 'Not selected' },
    { label: 'Envelope', value: envelope?.name || 'Not selected' },
    { label: 'Number of Pages', value: String(draft.pages.length) },
    { label: 'Approximate Audience', value: formatNumber(audienceCount) },
    { label: 'Approximate Postage Cost', value: formatCurrency(audienceCount * 0.55) },
    { label: 'Approximate Printing Cost', value: formatCurrency(audienceCount * 0.35) },
  ];

  return (
    <div className="flex h-full">
      {/* Left: Summary details */}
      <div className="w-1/2 p-8 overflow-y-auto border-r border-border">
        <h2 className="text-headline-sm font-bold text-text-primary mb-6">Campaign Summary</h2>

        <div className="space-y-4">
          {summaryItems.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start py-2 border-b border-border last:border-b-0">
              <span className="text-body-sm text-text-secondary">{label}</span>
              <span className="text-body-sm font-medium text-text-primary text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-[12px] flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-body-sm font-medium text-blue-800">Ready to launch?</p>
            <p className="text-body-sm text-blue-700 mt-1">
              Review your campaign details above. Once launched, the campaign will begin processing and mailing to your audience.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Preview — actual rendered pages */}
      <div className="w-1/2 p-8 bg-canvas-bg flex flex-col items-center overflow-y-auto">
        <h3 className="text-title-md font-medium text-text-primary mb-4">Mail Piece Preview</h3>

        <div className="flex-1 flex items-start justify-center w-full">
          {draft.pages[previewPage] ? (
            <div
              className="shadow-lg border border-border rounded-[4px] overflow-hidden origin-top-left"
              style={{ width: pageW * previewScale, height: previewHeight }}
            >
              <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: pageW, height: pageH }}>
                <CanvasPage
                  page={draft.pages[previewPage]}
                  pageWidth={pageW}
                  pageHeight={pageH}
                  isFirstPage={previewPage === 0}
                  envelopeType={envelopeType}
                  zoom={100}
                  showFoldLines={false}
                  showPostage={true}
                  selectedElementId={null}
                  editingElementId={null}
                  onSelectElement={() => {}}
                  onStartEdit={() => {}}
                  onStopEdit={() => {}}
                />
              </div>
            </div>
          ) : (
            <p className="text-body-md text-text-secondary">No pages</p>
          )}
        </div>

        {/* Page nav */}
        {draft.pages.length > 1 && (
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
              disabled={previewPage === 0}
              className="p-2 hover:bg-white rounded-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <span className="text-body-sm text-text-secondary">
              Page {previewPage + 1} of {draft.pages.length}
            </span>
            <button
              onClick={() => setPreviewPage(p => Math.min(draft.pages.length - 1, p + 1))}
              disabled={previewPage === draft.pages.length - 1}
              className="p-2 hover:bg-white rounded-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
