import { CheckCircle2 } from 'lucide-react';
import type { CampaignStatus } from '../../types';
import { cn } from '../../utils';

const dotColors: Record<CampaignStatus, string> = {
  draft: 'bg-status-draft',
  launching: 'bg-status-active',
  completed: 'bg-status-completed',
  archived: 'bg-status-inactive',
};

export default function StatusDot({ status }: { status: CampaignStatus }) {
  if (status === 'completed') {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-status-completed" />
        <span className="text-body-md capitalize">{status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn('w-2 h-2 rounded-full', dotColors[status])} />
      <span className="text-body-md capitalize">{status}</span>
    </div>
  );
}
