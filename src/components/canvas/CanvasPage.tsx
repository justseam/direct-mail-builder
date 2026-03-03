import { forwardRef } from 'react';
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

const CanvasPage = forwardRef<HTMLDivElement, CanvasPageProps>(function CanvasPage({
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
}, ref) {
  const scale = zoom / 100;
  const MARGIN = Math.round(pageWidth * 0.059); // ~0.5" at 96 DPI

  return (
    <div
      ref={ref}
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

      {/* Envelope windows — rendered ABOVE elements so content stays behind address zones */}
      {showPostage && isFirstPage && envelopeType === 'House 10' && (
        <>
          {/* Return address window — upper left */}
          <div
            className="absolute border-2 border-blue-300 bg-white flex flex-col items-center justify-center pointer-events-none z-30"
            style={{ top: MARGIN + 20, left: MARGIN + 30, width: 260, height: 70 }}
          >
            <span className="text-[10px] text-blue-400 font-medium uppercase mb-1">Return Address Window</span>
            <div className="w-36 h-2.5 bg-blue-200/60 rounded-sm mb-1" />
            <div className="w-28 h-2.5 bg-blue-200/60 rounded-sm" />
          </div>

          {/* Recipient address window — below return address */}
          <div
            className="absolute border-2 border-blue-300 bg-white flex flex-col items-center justify-center pointer-events-none z-30"
            style={{ top: MARGIN + 110, left: MARGIN + 30, width: 300, height: 100 }}
          >
            <span className="text-[10px] text-blue-400 font-medium uppercase mb-1">Address Window</span>
            <div className="w-44 h-2.5 bg-blue-200/60 rounded-sm mb-1" />
            <div className="w-36 h-2.5 bg-blue-200/60 rounded-sm mb-1" />
            <div className="w-40 h-2.5 bg-blue-200/60 rounded-sm" />
          </div>
        </>
      )}
    </div>
  );
});

export default CanvasPage;
