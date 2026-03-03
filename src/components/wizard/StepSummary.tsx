import { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Info, Download, Loader2 } from 'lucide-react';
import { useCampaign } from '../../stores/CampaignStore';
import { paperSizes, paperStocks, envelopeStocks, getPageDimensions } from '../../data/mockData';
import { formatCurrency, formatNumber } from '../../utils';
import CanvasPage from '../canvas/CanvasPage';
import Button from '../ui/Button';

export default function StepSummary() {
  const { draft, audiences } = useCampaign();
  const [previewPage, setPreviewPage] = useState(0);
  const [exporting, setExporting] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

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

  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');

      // Determine page orientation based on dimensions
      const isLandscape = pageW > pageH;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pageW, pageH],
      });

      for (let i = 0; i < draft.pages.length; i++) {
        if (i > 0) pdf.addPage([pageW, pageH], isLandscape ? 'landscape' : 'portrait');

        // Create a temporary container for rendering
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = `${pageW}px`;
        container.style.height = `${pageH}px`;
        document.body.appendChild(container);

        // Render the page into it using React DOM
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(container);
        await new Promise<void>(resolve => {
          root.render(
            <CanvasPage
              page={draft.pages[i]}
              pageWidth={pageW}
              pageHeight={pageH}
              isFirstPage={i === 0}
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
          );
          setTimeout(resolve, 200);
        });

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          width: pageW,
          height: pageH,
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH);

        root.unmount();
        document.body.removeChild(container);
      }

      pdf.save(`${draft.name || 'campaign'}-preview.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [draft, pageW, pageH, envelopeType]);

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
        <div className="flex items-center justify-between w-full mb-4">
          <h3 className="text-title-md font-medium text-text-primary">Mail Piece Preview</h3>
          <Button
            variant="secondary"
            size="sm"
            icon={exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            onClick={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>

        {/* Page nav */}
        {draft.pages.length > 1 && (
          <div className="flex items-center gap-4 mb-4">
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

        <div ref={previewContainerRef} className="flex-1 flex items-start justify-center w-full">
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
      </div>
    </div>
  );
}
