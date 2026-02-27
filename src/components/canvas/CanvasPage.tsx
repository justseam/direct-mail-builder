import ElementRenderer from './ElementRenderer';
import type { CanvasPage as CanvasPageType } from '../../types';

interface CanvasPageProps {
  page: CanvasPageType;
  zoom: number;
  showFoldLines: boolean;
  showPostage: boolean;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
}

// 8.5" x 11" at 96dpi = 816 x 1056px
const PAGE_W = 816;
const PAGE_H = 1056;
const MARGIN = 48; // ~0.5 inch margin

export default function CanvasPage({
  page,
  zoom,
  showFoldLines,
  showPostage,
  selectedElementId,
  onSelectElement,
}: CanvasPageProps) {
  const scale = zoom / 100;

  return (
    <div
      className="relative bg-white shadow-lg origin-top-left"
      style={{
        width: PAGE_W,
        height: PAGE_H,
        transform: `scale(${scale})`,
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onSelectElement(null);
      }}
    >
      {/* Margin guides */}
      <div
        className="absolute border border-dashed border-gray-300 pointer-events-none"
        style={{ top: MARGIN, left: MARGIN, right: MARGIN, bottom: MARGIN }}
      />

      {/* Fold lines */}
      {showFoldLines && (
        <>
          <div className="absolute left-0 right-0 border-t border-dashed border-blue-300 pointer-events-none" style={{ top: PAGE_H / 3 }}>
            <span className="absolute -top-3 left-4 text-[10px] text-blue-400 bg-white px-1">Fold Line</span>
          </div>
          <div className="absolute left-0 right-0 border-t border-dashed border-blue-300 pointer-events-none" style={{ top: (PAGE_H / 3) * 2 }}>
            <span className="absolute -top-3 left-4 text-[10px] text-blue-400 bg-white px-1">Fold Line</span>
          </div>
        </>
      )}

      {/* Protected zones — red/pink hatching style */}
      {showPostage && (
        <>
          {/* Logo placeholder */}
          <div
            className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center pointer-events-none"
            style={{ top: MARGIN, left: MARGIN, width: 140, height: 60 }}
          >
            <span className="text-[10px] text-red-400 font-medium uppercase">Logo Zone</span>
          </div>

          {/* Address block */}
          <div
            className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex flex-col items-center justify-center pointer-events-none"
            style={{ bottom: MARGIN + 60, left: MARGIN + 40, width: 300, height: 120 }}
          >
            <span className="text-[10px] text-red-400 font-medium uppercase mb-1">Address Block</span>
            <div className="w-48 h-3 bg-red-200/50 rounded-sm mb-1" />
            <div className="w-40 h-3 bg-red-200/50 rounded-sm mb-1" />
            <div className="w-44 h-3 bg-red-200/50 rounded-sm" />
          </div>

          {/* Barcode area */}
          <div
            className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center pointer-events-none"
            style={{ bottom: MARGIN, left: MARGIN + 40, width: 300, height: 40 }}
          >
            <span className="text-[10px] text-red-400 font-medium uppercase">Barcode Area</span>
          </div>

          {/* Postage area */}
          <div
            className="absolute border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-center pointer-events-none"
            style={{ top: MARGIN, right: MARGIN, width: 100, height: 60 }}
          >
            <span className="text-[10px] text-red-400 font-medium uppercase">Postage</span>
          </div>
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
          onSelect={() => onSelectElement(element.id)}
        />
      ))}
    </div>
  );
}
