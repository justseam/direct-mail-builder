import { X, Trash2, Info } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useCampaign } from '../../stores/CampaignStore';
import type { CanvasElement } from '../../types';

interface PropertiesPanelProps {
  element: CanvasElement;
  pageId: string;
  onClose: () => void;
}

export default function PropertiesPanel({ element, pageId, onClose }: PropertiesPanelProps) {
  const { updateElement, removeElement } = useCampaign();

  const update = (updates: Partial<CanvasElement>) => {
    updateElement(pageId, element.id, updates);
  };

  const isText = element.type === 'text';
  const isImage = element.type === 'image';

  return (
    <div className="w-64 bg-white border-l border-border flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-label-md font-semibold text-text-primary capitalize">
          {element.type} Properties
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Position */}
        <div>
          <h4 className="text-label-sm font-semibold text-text-secondary uppercase mb-2">Position</h4>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="X"
              type="number"
              value={Math.round(element.x)}
              onChange={e => update({ x: +e.target.value })}
            />
            <Input
              label="Y"
              type="number"
              value={Math.round(element.y)}
              onChange={e => update({ y: +e.target.value })}
            />
            <Input
              label="W"
              type="number"
              value={Math.round(element.width)}
              onChange={e => update({ width: +e.target.value })}
            />
            <Input
              label="H"
              type="number"
              value={Math.round(element.height)}
              onChange={e => update({ height: +e.target.value })}
            />
          </div>
        </div>

        {/* Text hint — editing is inline via WYSIWYG toolbar */}
        {isText && (
          <div>
            <p className="text-body-sm text-text-secondary">
              Double-click the element to edit text inline.
            </p>
          </div>
        )}

        {/* Image properties */}
        {isImage && (
          <div>
            <h4 className="text-label-sm font-semibold text-text-secondary uppercase mb-2">Image</h4>
            <Button variant="secondary" size="sm" className="w-full mb-3">
              Upload Image
            </Button>
            <div className="rounded-[8px] bg-amber-50 border border-amber-200 p-2.5 mb-3">
              <div className="flex gap-2">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-800 leading-relaxed">
                  <p>Images are inserted at their full resolution. Enlarging beyond the original size may degrade print quality.</p>
                  <p className="mt-1">Images above 300 DPI will be automatically scaled down to 300 DPI.</p>
                </div>
              </div>
            </div>
            <Select
              label="Fit"
              options={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
                { value: 'fill', label: 'Fill' },
              ]}
              value="cover"
            />
            <div className="mt-2">
              <Input label="Alt Text" placeholder="Describe the image..." />
            </div>
          </div>
        )}

        {/* QR Code properties */}
        {element.type === 'qrcode' && (
          <div>
            <h4 className="text-label-sm font-semibold text-text-secondary uppercase mb-2">QR Code</h4>
            <Input
              label="URL"
              value={element.content || ''}
              onChange={e => update({ content: e.target.value })}
            />
          </div>
        )}

        {/* Table properties */}
        {element.type === 'table' && (() => {
          const parsed = (element.content || '3,3').split(',').map(Number);
          const rows = parsed[0] || 3;
          const cols = parsed[1] || 3;
          return (
            <div>
              <h4 className="text-label-sm font-semibold text-text-secondary uppercase mb-2">Table</h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Rows"
                  type="number"
                  value={rows}
                  onChange={e => {
                    const r = Math.max(1, Math.min(20, +e.target.value));
                    update({ content: `${r},${cols}` });
                  }}
                />
                <Input
                  label="Columns"
                  type="number"
                  value={cols}
                  onChange={e => {
                    const c = Math.max(1, Math.min(20, +e.target.value));
                    update({ content: `${rows},${c}` });
                  }}
                />
              </div>
            </div>
          );
        })()}

      </div>

      {/* Delete */}
      <div className="p-4 border-t border-border">
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 className="w-4 h-4" />}
          className="w-full"
          onClick={() => {
            removeElement(pageId, element.id);
            onClose();
          }}
        >
          Delete Element
        </Button>
      </div>
    </div>
  );
}
