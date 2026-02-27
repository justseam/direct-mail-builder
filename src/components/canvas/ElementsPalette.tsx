import {
  Heading, Type, ImageIcon, MousePointer2, Puzzle,
  Code, Share2, Map, QrCode, Video, Minus, Table, Braces,
} from 'lucide-react';
import type { ElementType } from '../../types';

interface ElementsPaletteProps {
  onAdd: (type: ElementType) => void;
}

const categories = [
  {
    label: 'Build',
    items: [
      { type: 'heading' as ElementType, label: 'Heading', icon: Heading },
      { type: 'text' as ElementType, label: 'Text', icon: Type },
      { type: 'image' as ElementType, label: 'Image', icon: ImageIcon },
      { type: 'button' as ElementType, label: 'Button', icon: MousePointer2 },
      { type: 'logo' as ElementType, label: 'Logo', icon: Puzzle },
      { type: 'divider' as ElementType, label: 'Divider', icon: Minus },
      { type: 'table' as ElementType, label: 'Table', icon: Table },
      { type: 'html' as ElementType, label: 'HTML', icon: Code },
    ],
  },
  {
    label: 'Track',
    items: [
      { type: 'qrcode' as ElementType, label: 'QR Code', icon: QrCode },
      { type: 'map' as ElementType, label: 'Map', icon: Map },
      { type: 'video' as ElementType, label: 'Video', icon: Video },
    ],
  },
  {
    label: 'Personalize',
    items: [
      { type: 'variable' as ElementType, label: 'Variable', icon: Braces },
      { type: 'social' as ElementType, label: 'Social', icon: Share2 },
    ],
  },
];

export default function ElementsPalette({ onAdd }: ElementsPaletteProps) {
  return (
    <div className="p-3 space-y-4">
      {categories.map(cat => (
        <div key={cat.label}>
          <h3 className="text-label-md font-semibold text-text-primary mb-2 px-1">{cat.label}</h3>
          <div className="grid grid-cols-3 gap-1">
            {cat.items.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => onAdd(type)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-[8px] cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-5 h-5 text-text-secondary" />
                <span className="text-[11px] text-text-secondary font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
