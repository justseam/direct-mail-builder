import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Undo2, Redo2,
} from 'lucide-react';
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

  /** Run a command from a select, then refocus the contentEditable */
  const execFromSelect = (cmd: string, value: string) => {
    // Find the active contentEditable and restore focus before executing
    const editable = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
    if (editable) editable.focus();
    // Small delay to let focus settle, then execute
    requestAnimationFrame(() => {
      document.execCommand(cmd, false, value);
    });
  };

  return (
    <div
      className="wysiwyg-toolbar absolute z-50 bg-white rounded-[10px] border border-border shadow-xl px-2 py-1.5 flex items-center gap-0.5"
      style={{ top: top - 48, left: Math.max(0, left - 40), whiteSpace: 'nowrap' }}
      onMouseDown={e => {
        // Prevent blur on the contentEditable, but allow selects to work
        if ((e.target as HTMLElement).tagName !== 'SELECT' && !(e.target as HTMLElement).closest('select')) {
          e.preventDefault();
        }
      }}
    >
      {/* Font family */}
      <div className="w-[100px] shrink-0">
        <select
          defaultValue="Helvetica"
          onChange={e => execFromSelect('fontName', e.target.value)}
          className="w-full appearance-none rounded-[6px] border border-border bg-white px-2 py-1 pr-6 text-[11px] h-7 text-text-primary outline-none focus:border-primary cursor-pointer"
        >
          <option value="Helvetica">Helvetica</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
        </select>
      </div>

      {/* Font size */}
      <div className="w-[60px] shrink-0">
        <select
          defaultValue="3"
          onChange={e => execFromSelect('fontSize', e.target.value)}
          className="w-full appearance-none rounded-[6px] border border-border bg-white px-2 py-1 pr-6 text-[11px] h-7 text-text-primary outline-none focus:border-primary cursor-pointer"
        >
          <option value="1">10</option>
          <option value="2">12</option>
          <option value="3">14</option>
          <option value="4">18</option>
          <option value="5">24</option>
          <option value="6">32</option>
          <option value="7">48</option>
        </select>
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
