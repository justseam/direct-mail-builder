import { useState, useCallback, useRef } from 'react';
import ElementsPalette from './ElementsPalette';
import PagesPanel from './PagesPanel';
import CanvasPage from './CanvasPage';
import PropertiesPanel from './PropertiesPanel';
import { useCampaign } from '../../stores/CampaignStore';
import Switch from '../ui/Switch';
import type { ElementType, CanvasElement } from '../../types';
import { v4Id } from '../../utils';
import { PanelLeftClose, PanelLeftOpen, Minus, Plus, Maximize2 } from 'lucide-react';

export const PAGE_W = 816;
export const PAGE_H = 1056;

export function getElementDefaults(type: ElementType): Pick<CanvasElement, 'width' | 'height' | 'content'> {
  switch (type) {
    case 'heading': return { width: 300, height: 40, content: 'Heading Text' };
    case 'text': return { width: 250, height: 80, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' };
    case 'image': return { width: 200, height: 150, content: '' };
    case 'button': return { width: 160, height: 44, content: 'Click Here' };
    case 'logo': return { width: 120, height: 60, content: '' };
    case 'html': return { width: 300, height: 200, content: '<div>Custom HTML</div>' };
    case 'social': return { width: 200, height: 40, content: '' };
    case 'map': return { width: 250, height: 200, content: '' };
    case 'qrcode': return { width: 100, height: 100, content: 'https://example.com' };
    case 'video': return { width: 300, height: 200, content: '' };
    case 'divider': return { width: 300, height: 2, content: '' };
    case 'table': return { width: 300, height: 150, content: '' };
    case 'variable': return { width: 180, height: 32, content: 'first_name' };
    default: return { width: 200, height: 100, content: '' };
  }
}

export default function CanvasEditor() {
  const { draft, addElement } = useCampaign();
  const [activePageId, setActivePageId] = useState(draft.pages[0]?.id || '');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showFoldLines, setShowFoldLines] = useState(true);
  const [showPostage, setShowPostage] = useState(true);
  const [zoom, setZoom] = useState(70);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  const activePage = draft.pages.find(p => p.id === activePageId);
  const selectedElement = activePage?.elements.find(el => el.id === selectedElementId) || null;

  const addCountRef = useRef(0);

  const handleAddElement = useCallback((type: ElementType) => {
    if (!activePageId) return;
    const defaults = getElementDefaults(type);
    const offset = (addCountRef.current % 8) * 30;
    addCountRef.current += 1;
    const newElement: CanvasElement = {
      id: v4Id(),
      type,
      x: (PAGE_W - defaults.width) / 2 + offset,
      y: 120 + offset,
      ...defaults,
    };
    addElement(activePageId, newElement);
    setSelectedElementId(newElement.id);
  }, [activePageId, addElement]);

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      {leftSidebarOpen && (
        <div className="w-64 bg-white border-r border-border flex flex-col shrink-0 overflow-y-auto">
          <PagesPanel
            pages={draft.pages}
            activePageId={activePageId}
            onSelectPage={setActivePageId}
          />
          <div className="border-t border-border" />
          <ElementsPalette onAdd={handleAddElement} />
          <div className="border-t border-border" />
          {/* View settings */}
          <div className="p-3 space-y-3">
            <h3 className="text-label-md font-semibold text-text-primary px-1">View</h3>
            <Switch checked={showPostage} onChange={setShowPostage} label="Show Postage Zones" />
            <Switch checked={showFoldLines} onChange={setShowFoldLines} label="Show Fold Lines" />
          </div>
        </div>
      )}

      {/* Canvas area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canvas toolbar */}
        <div className="h-10 bg-white border-b border-border flex items-center px-3 gap-1 shrink-0">
          <button
            onClick={() => setLeftSidebarOpen(v => !v)}
            className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary"
            title={leftSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <div className="w-px h-5 bg-border mx-2" />
          <button
            onClick={() => setZoom(z => Math.max(30, z - 10))}
            className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-body-sm text-text-primary font-medium w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(150, z + 10))}
            className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(70)}
            className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary ml-1"
            title="Fit to view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas scroll area */}
        <div className="flex-1 bg-canvas-bg overflow-auto flex items-start justify-center p-8">
          {activePage && (
            <CanvasPage
              page={activePage}
              zoom={zoom}
              showFoldLines={showFoldLines}
              showPostage={showPostage}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar — Properties */}
      {selectedElement && (
        <PropertiesPanel
          element={selectedElement}
          pageId={activePageId}
          onClose={() => setSelectedElementId(null)}
        />
      )}
    </div>
  );
}
