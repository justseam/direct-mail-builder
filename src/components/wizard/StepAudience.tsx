import { useState, useCallback } from 'react';
import { Upload, ListPlus, Check, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import Button from '../ui/Button';
import Dialog from '../ui/Dialog';
import Input from '../ui/Input';
import { useCampaign } from '../../stores/CampaignStore';
import { audienceLists } from '../../data/mockData';
import { cn, formatNumber } from '../../utils';

export default function StepAudience() {
  const { draft, setAudience } = useCampaign();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploaded' | 'done'>('idle');
  const [uploadName, setUploadName] = useState('');

  const simulateUpload = useCallback(() => {
    setUploadState('uploaded');
    setUploadName('Imported Audience List');
  }, []);

  const handleConfirmUpload = useCallback(() => {
    // Simulate accepting the uploaded list — assign a mock audience
    // In a real app this would create the audience and return an ID
    setAudience('5'); // Use "Dormant Accounts" as the mock imported list
    setUploadState('done');
    setTimeout(() => {
      setUploadDialogOpen(false);
      setUploadState('idle');
      setUploadName('');
    }, 600);
  }, [setAudience]);

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
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Button
            variant="primary"
            size="lg"
            icon={<Upload className="w-5 h-5" />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload New List
          </Button>

          <span className="text-body-md text-text-secondary font-medium">OR</span>

          <Button
            variant="primary"
            size="lg"
            icon={<ListPlus className="w-5 h-5" />}
            onClick={() => setDialogOpen(true)}
          >
            Add Existing List
          </Button>
        </div>
      )}

      {/* Existing list picker dialog */}
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

      {/* Upload new list dialog — stays in the wizard */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => { setUploadDialogOpen(false); setUploadState('idle'); setUploadName(''); }}
        title="Upload Audience List"
      >
        {uploadState === 'done' ? (
          <div className="flex flex-col items-center py-6">
            <CheckCircle2 className="w-12 h-12 text-status-completed mb-3" />
            <p className="text-title-md font-medium">List Added</p>
            <p className="text-body-sm text-text-secondary mt-1">Your audience list has been imported.</p>
          </div>
        ) : uploadState === 'uploaded' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-[8px]">
              <FileSpreadsheet className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <p className="text-body-md font-medium text-green-800">audience_list_export.csv</p>
                <p className="text-body-sm text-green-600">5 records found</p>
              </div>
            </div>

            <Input
              label="List Name"
              value={uploadName}
              onChange={e => setUploadName(e.target.value)}
              placeholder="Name your audience list"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => { setUploadState('idle'); setUploadName(''); }}>
                Back
              </Button>
              <Button size="sm" onClick={handleConfirmUpload} disabled={!uploadName.trim()}>
                Confirm & Add List
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onClick={simulateUpload}
              className="border-2 border-dashed border-border rounded-[12px] p-10 cursor-pointer hover:border-primary/40 transition-colors text-center"
            >
              <Upload className="w-10 h-10 text-text-secondary mx-auto mb-3" />
              <p className="text-body-md font-medium">Drag and drop your CSV here</p>
              <p className="text-body-sm text-text-secondary mt-1">or click to browse</p>
            </div>

            <p className="text-body-sm text-text-secondary text-center">
              Upload a CSV file with columns for name, address, city, state, and zip code.
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
