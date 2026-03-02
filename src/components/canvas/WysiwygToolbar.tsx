import { useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Undo2, Redo2,
} from 'lucide-react';
import { cn } from '../../utils';
import { mappableColumns } from '../../data/mockData';

const variableOptions = mappableColumns.filter(c => c !== 'CHOOSE');

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

export default function WysiwygToolbar({ top, left }: WysiwygToolbarProps) {
  // Continuously track the cursor range inside the contentEditable
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    const onSelChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      // Only save if the selection is inside a contentEditable
      const node = range.startContainer;
      const el = node instanceof HTMLElement ? node : node.parentElement;
      if (el?.closest('[contenteditable="true"]')) {
        savedRange.current = range.cloneRange();
      }
    };
    document.addEventListener('selectionchange', onSelChange);
    return () => document.removeEventListener('selectionchange', onSelChange);
  }, []);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  /** Run a command from a select, then refocus the contentEditable */
  const execFromSelect = (cmd: string, value: string) => {
    const editable = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
    if (editable) editable.focus();
    requestAnimationFrame(() => {
      document.execCommand(cmd, false, value);
    });
  };

  /** Restore saved selection and insert a variable tag */
  const insertVariable = (varName: string) => {
    const editable = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
    if (!editable) return;
    editable.focus();

    requestAnimationFrame(() => {
      // Restore the saved cursor position
      const sel = window.getSelection();
      if (sel && savedRange.current) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current);
      }
      document.execCommand('insertHTML', false,
        `<span style="background:#fef3c7;color:#92400e;border-radius:3px;padding:0 3px;font-weight:500" contenteditable="false">{{${varName}}}</span>\u200B`
      );
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

      {/* Insert Variable */}
      <div className="w-[110px] shrink-0">
        <select
          value=""
          onChange={e => {
            if (e.target.value) {
              insertVariable(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full appearance-none rounded-[6px] border border-amber-300 bg-amber-50 px-2 py-1 pr-6 text-[11px] h-7 text-amber-800 font-medium outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="">+ Variable</option>
          {variableOptions.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Undo/Redo */}
      <ToolBtn icon={Undo2} label="Undo" onClick={() => exec('undo')} />
      <ToolBtn icon={Redo2} label="Redo" onClick={() => exec('redo')} />
    </div>
  );
}
