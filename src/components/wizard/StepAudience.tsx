import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ListPlus, Check } from 'lucide-react';
import Button from '../ui/Button';
import Dialog from '../ui/Dialog';
import { useCampaign } from '../../stores/CampaignStore';
import { audienceLists } from '../../data/mockData';
import { cn, formatNumber } from '../../utils';

export default function StepAudience() {
  const navigate = useNavigate();
  const { draft, setAudience } = useCampaign();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <h2 className="text-headline-sm font-bold text-text-primary mb-2">Select Audience</h2>
      <p className="text-body-md text-text-secondary mb-10">
        Choose an audience for your direct mail campaign
      </p>

      {draft.audienceId ? (
        <div className="bg-white rounded-[12px] border-2 border-status-completed p-6 text-center mb-6">
          <Check className="w-8 h-8 text-status-completed mx-auto mb-2" />
          <p className="text-title-md font-medium">
            {audienceLists.find(a => a.id === draft.audienceId)?.name}
          </p>
          <p className="text-body-sm text-text-secondary mt-1">
            {formatNumber(audienceLists.find(a => a.id === draft.audienceId)?.audienceCount || 0)} recipients
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => setAudience('')}
          >
            Change Audience
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <Button
            variant="accent"
            size="lg"
            icon={<Upload className="w-5 h-5" />}
            onClick={() => navigate('/audiences/upload')}
          >
            Upload New List
          </Button>

          <span className="text-body-md text-text-secondary font-medium">OR</span>

          <Button
            variant="accent"
            size="lg"
            icon={<ListPlus className="w-5 h-5" />}
            onClick={() => setDialogOpen(true)}
          >
            Add Existing List
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Select Audience List">
        <div className="flex flex-col gap-2 max-h-72 overflow-auto">
          {audienceLists.map(list => (
            <button
              key={list.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-[8px] border transition-colors cursor-pointer text-left',
                draft.audienceId === list.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-gray-50',
              )}
              onClick={() => {
                setAudience(list.id);
                setDialogOpen(false);
              }}
            >
              <div>
                <p className="text-body-md font-medium">{list.name}</p>
                <p className="text-body-sm text-text-secondary">
                  {formatNumber(list.audienceCount)} recipients
                </p>
              </div>
              {draft.audienceId === list.id && <Check className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
