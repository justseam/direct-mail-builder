import { useCallback, useRef, useMemo, useEffect, useState } from 'react';
import {
  Type, ImageIcon,
  QrCode, Minus, Table, Braces,
} from 'lucide-react';
import { useCampaign } from '../../stores/CampaignStore';
import { cn } from '../../utils';
import type { CanvasElement } from '../../types';

interface ElementRendererProps {
  element: CanvasElement;
  pageId: string;
  zoom: number;
  selected: boolean;
  editing: boolean;
  onSelect: () => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

const iconMap: Record<string, typeof Type> = {
  text: Type,
  image: ImageIcon,
  qrcode: QrCode,
  divider: Minus,
  table: Table,
  variable: Braces,
};

/** Interactive table sub-component with add row/column handles */
function TableElement({ element, pageId }: { element: CanvasElement; pageId: string }) {
  const { updateElement } = useCampaign();
  // Derive grid dimensions directly from element.content — default 3x3
  const parsed = (element.content || '3,3').split(',').map(Number);
  const rows = parsed[0] || 3;
  const cols = parsed[1] || 3;

  const addRow = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(pageId, element.id, { content: `${rows + 1},${cols}` });
  };
  const addCol = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(pageId, element.id, { content: `${rows},${cols + 1}` });
  };

  return (
    <div className="w-full h-full flex flex-col relative" onMouseDown={e => e.stopPropagation()}>
      <div className="flex-1 overflow-hidden">
        <table className="w-full h-full border-collapse">
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }, (_, c) => (
                  <td
                    key={c}
                    className="border border-gray-300 text-[10px] text-gray-500 text-center p-1"
                    contentEditable
                    suppressContentEditableWarning
                    onMouseDown={e => e.stopPropagation()}
                  >
                    {r === 0 ? `Col ${c + 1}` : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add row handle */}
      <button
        onClick={addRow}
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-6 h-5 bg-primary text-white rounded-b text-[11px] font-bold flex items-center justify-center cursor-pointer hover:bg-primary/80 z-10"
        title="Add row"
      >+</button>
      {/* Add col handle */}
      <button
        onClick={addCol}
        className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-6 bg-primary text-white rounded-r text-[11px] font-bold flex items-center justify-center cursor-pointer hover:bg-primary/80 z-10"
        title="Add column"
      >+</button>
    </div>
  );
}

export default function ElementRenderer({ element, pageId, zoom, selected, editing, onSelect, onStartEdit, onStopEdit }: ElementRendererProps) {
  const { updateElement } = useCampaign();
  const dragRef = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);
  const editRef = useRef<HTMLDivElement>(null);

  const scale = zoom / 100;
  const isTextType = element.type === 'text';

  // Track latest content during editing so it's always saved
  const latestContentRef = useRef(element.content || '');

  // When entering edit mode, focus the contentEditable div and set content
  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.innerHTML = element.content || '';
      latestContentRef.current = element.content || '';
      editRef.current.focus();
      const sel = window.getSelection();
      if (sel) {
        sel.selectAllChildren(editRef.current);
        sel.collapseToEnd();
      }
    }
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save content when editing transitions from true to false
  const wasEditingRef = useRef(false);
  useEffect(() => {
    if (wasEditingRef.current && !editing) {
      updateElement(pageId, element.id, { content: latestContentRef.current });
    }
    wasEditingRef.current = editing;
  }); // runs every render to catch editing transition

  const handleInput = useCallback(() => {
    if (editRef.current) {
      latestContentRef.current = editRef.current.innerHTML;
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (editing) return; // don't drag while editing
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
  }, [element.x, element.y, element.id, pageId, scale, updateElement, onSelect, editing]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!isTextType) return;
    e.stopPropagation();
    onStartEdit();
  }, [isTextType, onStartEdit]);

  const handleBlur = useCallback((e?: React.FocusEvent) => {
    if (!editing) return;
    // Don't exit edit mode if focus moved to the WYSIWYG toolbar
    const related = (e?.relatedTarget ?? document.activeElement) as HTMLElement | null;
    if (related?.closest('.wysiwyg-toolbar')) return;
    // Delay slightly so variable insertion via requestAnimationFrame can complete
    setTimeout(() => {
      const active = document.activeElement as HTMLElement | null;
      if (active?.closest('.wysiwyg-toolbar')) return;
      if (editRef.current) {
        updateElement(pageId, element.id, { content: editRef.current.innerHTML });
      }
      onStopEdit();
    }, 50);
  }, [editing, pageId, element.id, updateElement, onStopEdit]);

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
        editing ? 'ring-2 ring-primary' : selected ? 'ring-2 ring-accent' : 'hover:ring-1 hover:ring-primary/30',
      )}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: editing ? 'text' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Element content */}
      <div className="w-full h-full overflow-hidden">
        {element.type === 'text' && !editing && (
          <div className="p-2 text-body-sm text-text-primary" dangerouslySetInnerHTML={{ __html: element.content || '' }} />
        )}

        {/* Inline editing mode for text/heading */}
        {isTextType && editing && (
          <div
            ref={editRef}
            contentEditable
            suppressContentEditableWarning
            className="w-full h-full outline-none p-2 text-body-sm text-text-primary"
            onBlur={handleBlur}
            onInput={handleInput}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                e.preventDefault();
                handleBlur();
              }
              e.stopPropagation();
            }}
            onMouseDown={e => e.stopPropagation()}
          />
        )}

        {element.type === 'image' && (
          <div className="w-full h-full bg-[#E8EDF2] overflow-hidden relative">
            {/* Landscape placeholder illustration */}
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              {/* Sky gradient */}
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8D4E8" />
                  <stop offset="100%" stopColor="#D6E6F2" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" fill="url(#sky)" />
              {/* Hills */}
              <path d="M0 220 Q100 150 200 200 Q300 170 400 210 L400 300 L0 300Z" fill="#8BAA7E" />
              <path d="M0 250 Q150 190 250 230 Q350 200 400 240 L400 300 L0 300Z" fill="#6D9460" />
              {/* Sun */}
              <circle cx="320" cy="80" r="30" fill="#F2D98B" opacity="0.9" />
              {/* Cloud */}
              <g opacity="0.6">
                <ellipse cx="120" cy="70" rx="35" ry="15" fill="white" />
                <ellipse cx="145" cy="65" rx="25" ry="12" fill="white" />
                <ellipse cx="100" cy="68" rx="20" ry="10" fill="white" />
              </g>
              {/* Camera icon overlay */}
              <g transform="translate(175, 125)" opacity="0.35">
                <rect x="0" y="10" width="50" height="35" rx="5" fill="white" />
                <rect x="17" y="4" width="16" height="8" rx="2" fill="white" />
                <circle cx="25" cy="27" r="10" fill="none" stroke="#999" strokeWidth="2" />
              </g>
            </svg>
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
        {element.type === 'variable' && (
          <div className="w-full h-full bg-amber-50 border border-dashed border-amber-300 flex items-center justify-center gap-1.5 px-2">
            <Braces className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-body-sm text-amber-700 font-medium truncate">{element.content || 'variable'}</span>
          </div>
        )}
        {element.type === 'table' && (
          <TableElement element={element} pageId={pageId} />
        )}
        {!['text', 'image', 'qrcode', 'divider', 'variable', 'table'].includes(element.type) && (
          <div className="w-full h-full bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center">
            <Icon className="w-6 h-6 text-gray-400" />
            <span className="text-[11px] text-gray-400 mt-1 capitalize">{element.type}</span>
          </div>
        )}
      </div>

      {/* Resize handles — hide while editing */}
      {selected && !editing && (
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
