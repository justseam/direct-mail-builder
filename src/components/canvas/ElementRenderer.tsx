import { useCallback, useRef, useMemo } from 'react';
import {
  Heading, Type, ImageIcon, MousePointer2, Puzzle,
  Code, Share2, Map, QrCode, Video, Minus, Table, Braces,
} from 'lucide-react';
import { useCampaign } from '../../stores/CampaignStore';
import { cn } from '../../utils';
import type { CanvasElement } from '../../types';

interface ElementRendererProps {
  element: CanvasElement;
  pageId: string;
  zoom: number;
  selected: boolean;
  onSelect: () => void;
}

const iconMap: Record<string, typeof Heading> = {
  heading: Heading,
  text: Type,
  image: ImageIcon,
  button: MousePointer2,
  logo: Puzzle,
  html: Code,
  social: Share2,
  map: Map,
  qrcode: QrCode,
  video: Video,
  divider: Minus,
  table: Table,
  variable: Braces,
};

export default function ElementRenderer({ element, pageId, zoom, selected, onSelect }: ElementRendererProps) {
  const { updateElement } = useCampaign();
  const dragRef = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);

  const scale = zoom / 100;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elX: element.x,
      elY: element.y,
    };

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = (ev.clientX - dragRef.current.startX) / scale;
      const dy = (ev.clientY - dragRef.current.startY) / scale;
      updateElement(pageId, element.id, {
        x: dragRef.current.elX + dx,
        y: dragRef.current.elY + dy,
      });
    };

    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [element.x, element.y, element.id, pageId, scale, updateElement, onSelect]);

  const handleResize = useCallback((e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = element.width;
    const startH = element.height;
    const startElX = element.x;
    const startElY = element.y;

    const handleMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      const updates: Partial<CanvasElement> = {};

      if (corner.includes('r')) updates.width = Math.max(40, startW + dx);
      if (corner.includes('b')) updates.height = Math.max(20, startH + dy);
      if (corner.includes('l')) {
        updates.width = Math.max(40, startW - dx);
        updates.x = startElX + dx;
      }
      if (corner.includes('t')) {
        updates.height = Math.max(20, startH - dy);
        updates.y = startElY + dy;
      }

      updateElement(pageId, element.id, updates);
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [element, pageId, scale, updateElement]);

  // Stable QR pattern (seeded from element id)
  const qrPattern = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < element.id.length; i++) {
      hash = ((hash << 5) - hash) + element.id.charCodeAt(i);
      hash |= 0;
    }
    return Array.from({ length: 25 }, (_, i) => {
      const v = ((hash * (i + 1) * 2654435761) >>> 0) % 100;
      return v > 40;
    });
  }, [element.id]);

  const Icon = iconMap[element.type] || Type;

  return (
    <div
      className={cn(
        'absolute group',
        selected ? 'ring-2 ring-accent' : 'hover:ring-1 hover:ring-primary/30',
      )}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Element content */}
      <div className="w-full h-full overflow-hidden">
        {element.type === 'heading' && (
          <div className="flex items-center h-full px-2">
            <span className="text-xl font-bold text-text-primary">{element.content}</span>
          </div>
        )}
        {element.type === 'text' && (
          <div className="p-2 text-body-sm text-text-primary">{element.content}</div>
        )}
        {element.type === 'image' && (
          <div className="w-full h-full bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span className="text-[11px] text-gray-400 mt-1">Drop Image</span>
          </div>
        )}
        {element.type === 'button' && (
          <div className="w-full h-full flex items-center justify-center bg-primary rounded-[8px] text-white text-body-md font-medium">
            {element.content}
          </div>
        )}
        {element.type === 'qrcode' && (
          <div className="w-full h-full bg-white border border-gray-200 flex items-center justify-center">
            <div className="grid grid-cols-5 gap-0.5 w-3/4 h-3/4">
              {qrPattern.map((filled, i) => (
                <div key={i} className={cn('aspect-square', filled ? 'bg-gray-900' : 'bg-white')} />
              ))}
            </div>
          </div>
        )}
        {element.type === 'divider' && (
          <div className="w-full h-full flex items-center">
            <div className="w-full border-t-2 border-gray-300" />
          </div>
        )}
        {element.type === 'logo' && (
          <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
            <Puzzle className="w-6 h-6 text-gray-400" />
          </div>
        )}
        {element.type === 'variable' && (
          <div className="w-full h-full bg-amber-50 border border-dashed border-amber-300 flex items-center justify-center gap-1.5 px-2">
            <Braces className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-body-sm text-amber-700 font-medium truncate">{element.content || 'variable'}</span>
          </div>
        )}
        {!['heading', 'text', 'image', 'button', 'qrcode', 'divider', 'logo', 'variable'].includes(element.type) && (
          <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center">
            <Icon className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400 mt-1 capitalize">{element.type}</span>
          </div>
        )}
      </div>

      {/* Resize handles */}
      {selected && (
        <>
          {['tl', 'tr', 'bl', 'br'].map(corner => (
            <div
              key={corner}
              className="absolute w-3 h-3 bg-accent border-2 border-white rounded-full z-10"
              style={{
                top: corner.includes('t') ? -6 : undefined,
                bottom: corner.includes('b') ? -6 : undefined,
                left: corner.includes('l') ? -6 : undefined,
                right: corner.includes('r') ? -6 : undefined,
                cursor: corner === 'tl' || corner === 'br' ? 'nwse-resize' : 'nesw-resize',
              }}
              onMouseDown={e => handleResize(e, corner.split('').map(c => ({ t: 't', b: 'b', l: 'l', r: 'r' }[c])).join(''))}
            />
          ))}
          {/* Edge handles */}
          <div className="absolute top-1/2 -left-1.5 w-3 h-6 bg-accent/30 rounded cursor-ew-resize -translate-y-1/2"
            onMouseDown={e => handleResize(e, 'l')} />
          <div className="absolute top-1/2 -right-1.5 w-3 h-6 bg-accent/30 rounded cursor-ew-resize -translate-y-1/2"
            onMouseDown={e => handleResize(e, 'r')} />
          <div className="absolute -top-1.5 left-1/2 w-6 h-3 bg-accent/30 rounded cursor-ns-resize -translate-x-1/2"
            onMouseDown={e => handleResize(e, 't')} />
          <div className="absolute -bottom-1.5 left-1/2 w-6 h-3 bg-accent/30 rounded cursor-ns-resize -translate-x-1/2"
            onMouseDown={e => handleResize(e, 'b')} />
        </>
      )}
    </div>
  );
}
