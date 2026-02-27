import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Undo2, Redo2,
} from 'lucide-react';
import Select from '../ui/Select';
import { cn } from '../../utils';

interface WysiwygToolbarProps {
  /** Pixel position relative to the canvas scroll container */
  top: number;
  left: number;
  width: number;
}

function ToolBtn({ icon: Icon, label, active, onClick }: {
  icon: typeof Bold;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      title={label}
      className={cn(
        'p-1.5 rounded hover:bg-gray-100 cursor-pointer transition-colors',
        active ? 'bg-primary/10 text-primary' : 'text-text-secondary',
      )}
      onMouseDown={e => { e.preventDefault(); onClick?.(); }}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function WysiwygToolbar({ top, left, width }: WysiwygToolbarProps) {
  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  return (
    <div
      className="absolute z-50 bg-white rounded-[10px] border border-border shadow-xl px-2 py-1.5 flex items-center gap-0.5"
      style={{ top: top - 48, left: Math.max(0, left - 40), whiteSpace: 'nowrap' }}
      onMouseDown={e => e.preventDefault()}
    >
      {/* Font family */}
      <div className="w-[100px] shrink-0">
        <Select
          options={[
            { value: 'Helvetica', label: 'Helvetica' },
            { value: 'Arial', label: 'Arial' },
            { value: 'Georgia', label: 'Georgia' },
            { value: 'Times New Roman', label: 'Times' },
            { value: 'Courier New', label: 'Courier' },
          ]}
          value="Helvetica"
          onChange={e => exec('fontName', e.target.value)}
          className="text-[11px] h-7"
        />
      </div>

      {/* Font size */}
      <div className="w-[60px] shrink-0">
        <Select
          options={[
            { value: '1', label: '10' },
            { value: '2', label: '12' },
            { value: '3', label: '14' },
            { value: '4', label: '18' },
            { value: '5', label: '24' },
            { value: '6', label: '32' },
            { value: '7', label: '48' },
          ]}
          value="3"
          onChange={e => exec('fontSize', e.target.value)}
          className="text-[11px] h-7"
        />
      </div>

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Text style */}
      <ToolBtn icon={Bold} label="Bold" onClick={() => exec('bold')} />
      <ToolBtn icon={Italic} label="Italic" onClick={() => exec('italic')} />
      <ToolBtn icon={Underline} label="Underline" onClick={() => exec('underline')} />

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Alignment */}
      <ToolBtn icon={AlignLeft} label="Align Left" onClick={() => exec('justifyLeft')} />
      <ToolBtn icon={AlignCenter} label="Align Center" onClick={() => exec('justifyCenter')} />
      <ToolBtn icon={AlignRight} label="Align Right" onClick={() => exec('justifyRight')} />

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Lists */}
      <ToolBtn icon={List} label="Bullet List" onClick={() => exec('insertUnorderedList')} />
      <ToolBtn icon={ListOrdered} label="Numbered List" onClick={() => exec('insertOrderedList')} />

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Undo/Redo */}
      <ToolBtn icon={Undo2} label="Undo" onClick={() => exec('undo')} />
      <ToolBtn icon={Redo2} label="Redo" onClick={() => exec('redo')} />
    </div>
  );
}
