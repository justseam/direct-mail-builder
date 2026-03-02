import ElementRenderer from './ElementRenderer';
import type { CanvasPage as CanvasPageType } from '../../types';

interface CanvasPageProps {
  page: CanvasPageType;
  pageWidth: number;
  pageHeight: number;
  isFirstPage: boolean;
  envelopeType: string;
  zoom: number;
  showFoldLines: boolean;
  showPostage: boolean;
  selectedElementId: string | null;
  editingElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onStartEdit: (id: string) => void;
  onStopEdit: () => void;
}

export default function CanvasPage({
  page,
  pageWidth,
  pageHeight,
  isFirstPage,
  envelopeType,
  zoom,
  showFoldLines,
  showPostage,
  selectedElementId,
  editingElementId,
  onSelectElement,
  onStartEdit,
  onStopEdit,
}: CanvasPageProps) {
  const scale = zoom / 100;
  const MARGIN = Math.round(pageWidth * 0.059); // ~0.5" at 96 DPI

  const isPostcard = envelopeType === 'None';

  return (
    <div
      className="relative bg-white shadow-lg origin-top-left"
      style={{
        width: pageWidth,
        height: pageHeight,
        transform: `scale(${scale})`,
      }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onSelectElement(null);
      }}
    >
      {/* Margin guides */}
      <div
        className="absolute border border-dashed border-gray-300 pointer-events-none"
        style={{ top: MARGIN, left: MARGIN, right: MARGIN, bottom: MARGIN }}
      />

      {/* Fold lines — shown on all pages for envelope types that fold */}
      {showFoldLines && envelopeType === 'House 10' && (
        <>
          <div className="absolute left-0 right-0 border-t border-dashed border-blue-300 pointer-events-none" style={{ top: Math.round(pageHeight / 3) }}>
            <span className="absolute -top-3 left-4 text-[10px] text-blue-400 bg-white px-1">Fold Line</span>
          </div>
          <div className="absolute left-0 right-0 border-t border-dashed border-blue-300 pointer-events-none" style={{ top: Math.round((pageHeight / 3) * 2) }}>
            <span className="absolute -top-3 left-4 text-[10px] text-blue-400 bg-white px-1">Fold Line</span>
          </div>
        </>
      )}
      {showFoldLines && envelopeType === '6x9' && (
        <div className="absolute left-0 right-0 border-t border-dashed border-blue-300 pointer-events-none" style={{ top: Math.round(pageHeight / 2) }}>
          <span className="absolute -top-3 left-4 text-[10px] text-blue-400 bg-white px-1">Fold Line</span>
        </div>
      )}

      {/* Protected zones — only on Page 1 */}
      {showPostage && isFirstPage && (
        <>
          {/* Logo placeholder */}
          <div
            className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center pointer-events-none"
            style={{ top: MARGIN, left: MARGIN, width: 140, height: 60 }}
          >
            <span className="text-[10px] text-red-400 font-medium uppercase">Logo Zone</span>
          </div>

          {/* Postage area */}
          <div
            className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center pointer-events-none"
            style={{ top: MARGIN, right: MARGIN, width: 100, height: 60 }}
          >
            <span className="text-[10px] text-red-400 font-medium uppercase">Postage</span>
          </div>

          {/* Address block — position depends on envelope type */}
          {isPostcard ? (
            /* Postcard: address on right half, vertically centered */
            <div
              className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex flex-col items-center justify-center pointer-events-none"
              style={{ top: Math.round(pageHeight / 2 - 60), right: MARGIN + 20, width: 250, height: 120 }}
            >
              <span className="text-[10px] text-red-400 font-medium uppercase mb-1">Address Block</span>
              <div className="w-40 h-3 bg-red-200/50 rounded-sm mb-1" />
              <div className="w-32 h-3 bg-red-200/50 rounded-sm mb-1" />
              <div className="w-36 h-3 bg-red-200/50 rounded-sm" />
            </div>
          ) : (
            /* Letters (House 10, 6x9, 9x12): address in upper portion */
            <div
              className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex flex-col items-center justify-center pointer-events-none"
              style={{ top: MARGIN + 70, left: MARGIN + 40, width: 300, height: 120 }}
            >
              <span className="text-[10px] text-red-400 font-medium uppercase mb-1">Address Block</span>
              <div className="w-48 h-3 bg-red-200/50 rounded-sm mb-1" />
              <div className="w-40 h-3 bg-red-200/50 rounded-sm mb-1" />
              <div className="w-44 h-3 bg-red-200/50 rounded-sm" />
            </div>
          )}

          {/* Barcode area — below address block */}
          {isPostcard ? (
            <div
              className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center pointer-events-none"
              style={{ top: Math.round(pageHeight / 2 + 70), right: MARGIN + 20, width: 250, height: 40 }}
            >
              <span className="text-[10px] text-red-400 font-medium uppercase">Barcode Area</span>
            </div>
          ) : (
            <div
              className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center pointer-events-none"
              style={{ top: MARGIN + 200, left: MARGIN + 40, width: 300, height: 40 }}
            >
              <span className="text-[10px] text-red-400 font-medium uppercase">Barcode Area</span>
            </div>
          )}
        </>
      )}

      {/* Elements */}
      {page.elements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          pageId={page.id}
          zoom={zoom}
          selected={element.id === selectedElementId}
          editing={element.id === editingElementId}
          onSelect={() => onSelectElement(element.id)}
          onStartEdit={() => onStartEdit(element.id)}
          onStopEdit={onStopEdit}
        />
      ))}
    </div>
  );
}
