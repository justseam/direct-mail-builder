import {
  Type, ImageIcon,
  QrCode, Minus, Table,
} from 'lucide-react';
import type { ElementType } from '../../types';

interface ElementsPaletteProps {
  onAdd: (type: ElementType) => void;
}

const items = [
  { type: 'text' as ElementType, label: 'Text', icon: Type },
  { type: 'image' as ElementType, label: 'Image', icon: ImageIcon },
  { type: 'divider' as ElementType, label: 'Divider', icon: Minus },
  { type: 'table' as ElementType, label: 'Table', icon: Table },
  { type: 'qrcode' as ElementType, label: 'QR Code', icon: QrCode },
];

export default function ElementsPalette({ onAdd }: ElementsPaletteProps) {
  return (
    <div className="p-3">
      <h3 className="text-label-md font-semibold text-text-primary mb-2 px-1">Components</h3>
      <div className="grid grid-cols-3 gap-1">
        {items.map(({ type, label, icon: Icon }) => (
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
  );
}
