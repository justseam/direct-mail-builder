import { Plus, X, FileText } from 'lucide-react';
import { useCampaign } from '../../stores/CampaignStore';
import { cn } from '../../utils';
import type { CanvasPage } from '../../types';

interface PagesPanelProps {
  pages: CanvasPage[];
  activePageId: string;
  onSelectPage: (id: string) => void;
}

export default function PagesPanel({ pages, activePageId, onSelectPage }: PagesPanelProps) {
  const { addPage, removePage } = useCampaign();

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-label-md font-semibold text-text-primary">Pages</h3>
        <button
          onClick={addPage}
          className="p-1 hover:bg-gray-100 rounded cursor-pointer text-text-secondary"
          title="Add page"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {pages.map(page => (
          <div
            key={page.id}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-[8px] cursor-pointer transition-colors group',
              page.id === activePageId ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-text-secondary',
            )}
            onClick={() => onSelectPage(page.id)}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="text-body-sm font-medium flex-1">{page.label}</span>
            {pages.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); removePage(page.id); }}
                className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
