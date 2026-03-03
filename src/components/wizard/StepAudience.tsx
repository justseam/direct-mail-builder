import { useState, useCallback, useEffect } from 'react';
import { Upload, ListPlus, Check, CheckCircle2, Download, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import Dialog from '../ui/Dialog';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useCampaign } from '../../stores/CampaignStore';
import { sampleCSVHeaders, sampleCSVData, mappableColumns } from '../../data/mockData';
import { cn, formatNumber } from '../../utils';

const uploadSteps = ['Upload', 'Mapping', 'Review', 'Status'];

export default function StepAudience() {
  const { draft, audiences, addAudienceList, setAudience } = useCampaign();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Upload wizard state
  const [uploadStep, setUploadStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [listName, setListName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    sampleCSVHeaders.forEach(h => { m[h] = h; });
    return m;
  });

  // Upload status state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  const errorRows = [2, 4];
  const totalRecords = sampleCSVData.length;
  const successRecords = totalRecords - errorRows.length;

  const simulateUpload = useCallback(() => {
    setFileName('audience_list_export.csv');
    setListName('Imported Audience');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  }, [simulateUpload]);

  const resetUpload = useCallback(() => {
    setUploadStep(0);
    setFileName('');
    setListName('');
    setDragOver(false);
    setUploadProgress(0);
    setUploadDone(false);
    setMappings(() => {
      const m: Record<string, string> = {};
      sampleCSVHeaders.forEach(h => { m[h] = h; });
      return m;
    });
  }, []);

  // Simulate upload progress when entering the status step
  useEffect(() => {
    if (!uploadDialogOpen || uploadStep !== 3) return;
    setUploadProgress(0);
    setUploadDone(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadDone(true);
          // Add the list to session audiences and select it
          const newId = `uploaded-${Date.now()}`;
          addAudienceList({
            id: newId,
            name: listName || 'Imported Audience',
            audienceCount: successRecords,
            createdOn: new Date().toISOString().split('T')[0],
            activeCampaigns: 0,
          });
          setAudience(newId);
        }, 400);
      }
      setUploadProgress(Math.min(100, Math.round(progress)));
    }, 300);

    return () => clearInterval(interval);
  }, [uploadDialogOpen, uploadStep, listName, successRecords, addAudienceList, setAudience]);

  const handleUploadNext = () => {
    if (uploadStep === 0 && !fileName) {
      simulateUpload();
      return;
    }
    if (uploadStep < uploadSteps.length - 1) setUploadStep(s => s + 1);
    else {
      // Done — close dialog
      setUploadDialogOpen(false);
      resetUpload();
    }
  };

  const handleUploadBack = () => {
    if (uploadStep === 3) return;
    if (uploadStep > 0) setUploadStep(s => s - 1);
  };

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
            {audiences.find(a => a.id === draft.audienceId)?.name}
          </p>
          <p className="text-body-sm text-text-secondary mt-1">
            {formatNumber(audiences.find(a => a.id === draft.audienceId)?.audienceCount || 0)} recipients
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
            onClick={() => { resetUpload(); setUploadDialogOpen(true); }}
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
          {audiences.map(list => (
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

      {/* Upload new list dialog — full multi-step flow */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => { setUploadDialogOpen(false); resetUpload(); }}
        title="Upload Audience List"
        wide
      >
        <div>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {uploadSteps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium',
                  i < uploadStep ? 'bg-status-completed text-white' :
                  i === uploadStep ? 'bg-primary text-white' :
                  'bg-gray-100 text-text-secondary',
                )}>
                  {i < uploadStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={cn(
                  'text-body-sm font-medium',
                  i === uploadStep ? 'text-text-primary' : 'text-text-secondary',
                )}>
                  {label}
                </span>
                {i < uploadSteps.length - 1 && (
                  <div className="w-8 h-px bg-border mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Upload */}
          {uploadStep === 0 && (
            <div className="text-center">
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={simulateUpload}
                className={cn(
                  'border-2 border-dashed rounded-[12px] p-10 cursor-pointer transition-colors',
                  dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                  fileName && 'border-status-completed bg-green-50',
                )}
              >
                {fileName ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-status-completed" />
                    <p className="text-body-md font-medium">{fileName}</p>
                    <p className="text-body-sm text-text-secondary">{totalRecords} records found</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-10 h-10 text-text-secondary" />
                    <p className="text-body-md font-medium">Drag and drop your CSV here</p>
                    <p className="text-body-sm text-text-secondary">or click to browse</p>
                  </div>
                )}
              </div>

              <button className="mt-4 inline-flex items-center gap-2 text-primary text-body-sm font-medium hover:underline cursor-pointer">
                <Download className="w-4 h-4" />
                Download Template CSV
              </button>
            </div>
          )}

          {/* Step 2: Mapping */}
          {uploadStep === 1 && (
            <div>
              <div className="flex items-center gap-6 mb-4">
                <Input
                  label="List Name"
                  value={listName}
                  onChange={e => setListName(e.target.value)}
                  className="w-72"
                />
                <div className="text-body-sm text-text-secondary mt-5">
                  <strong>{totalRecords}</strong> records found
                </div>
              </div>

              <div className="bg-white rounded-[12px] border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-label-md font-semibold text-table-header uppercase">CSV Column</th>
                      <th className="px-4 py-3 text-left text-label-md font-semibold text-table-header uppercase">Maps To</th>
                      <th className="px-4 py-3 text-left text-label-md font-semibold text-table-header uppercase">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleCSVHeaders.map((header, i) => (
                      <tr key={header} className="border-b border-border last:border-b-0">
                        <td className="px-4 py-2 text-body-md font-medium">{header}</td>
                        <td className="px-4 py-2">
                          <Select
                            options={mappableColumns.map(c => ({ value: c, label: c }))}
                            value={mappings[header] || 'CHOOSE'}
                            onChange={e => setMappings(m => ({ ...m, [header]: e.target.value }))}
                            className="w-48"
                          />
                        </td>
                        <td className="px-4 py-2 text-body-sm text-text-secondary">
                          {sampleCSVData[0]?.[i] || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {uploadStep === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-[12px]">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-body-md font-medium text-amber-800">
                    {errorRows.length} records have errors
                  </p>
                  <p className="text-body-sm text-amber-700">
                    These records will be skipped during import. Review the highlighted rows below.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[12px] border border-border overflow-x-auto max-h-64">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-3 py-2 text-left text-label-md font-semibold text-table-header uppercase">Row</th>
                      {sampleCSVHeaders.map(h => (
                        <th key={h} className="px-3 py-2 text-left text-label-md font-semibold text-table-header uppercase text-[11px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleCSVData.map((row, i) => {
                      const hasError = errorRows.includes(i);
                      return (
                        <tr
                          key={i}
                          className={cn(
                            'border-b border-border last:border-b-0',
                            hasError && 'bg-red-50',
                          )}
                        >
                          <td className="px-3 py-2 text-body-sm">
                            {hasError && <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline mr-1" />}
                            {i + 1}
                          </td>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 text-body-sm">{cell || '-'}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center">
                <p className="text-body-md text-text-secondary">
                  <strong>{successRecords}</strong> of {totalRecords} records will be imported
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Upload Status */}
          {uploadStep === 3 && (
            <div className="text-center py-4">
              {!uploadDone ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-title-md font-bold mb-2">Uploading Audience List</h3>
                  <p className="text-body-md text-text-secondary mb-6">
                    Importing records from <strong>{fileName}</strong>...
                  </p>

                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-sm text-text-secondary">Processing records...</span>
                      <span className="text-body-sm font-medium text-text-primary">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-14 h-14 text-status-completed mx-auto mb-4" />
                  <h3 className="text-title-md font-bold mb-2">Upload Complete</h3>
                  <p className="text-body-md text-text-secondary mb-6">
                    Your audience list <strong>{listName}</strong> has been processed.
                  </p>

                  <div className="flex items-center justify-center gap-4 max-w-md mx-auto mb-6">
                    <div className="flex-1 bg-green-50 border border-green-200 rounded-[12px] p-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-700">{successRecords}</p>
                      <p className="text-body-sm text-green-600 font-medium">Successful</p>
                    </div>
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-[12px] p-4">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">{errorRows.length}</p>
                      <p className="text-body-sm text-red-500 font-medium">Failed</p>
                    </div>
                  </div>

                  {errorRows.length > 0 && (
                    <div className="max-w-md mx-auto text-left bg-amber-50 border border-amber-200 rounded-[12px] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <p className="text-body-sm font-medium text-amber-800">
                          {errorRows.length} records skipped due to errors
                        </p>
                      </div>
                      <ul className="text-body-sm text-amber-700 space-y-1 ml-6 list-disc">
                        {errorRows.map(row => (
                          <li key={row}>
                            Row {row + 1}: Missing required field (CITY)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUploadBack}
              disabled={uploadStep === 0 || uploadStep === 3}
            >
              Back
            </Button>
            <Button
              size="sm"
              onClick={handleUploadNext}
              disabled={(uploadStep === 0 && !fileName) || (uploadStep === 3 && !uploadDone)}
            >
              {uploadStep === 2 ? 'Upload' : uploadStep === 3 ? 'Done' : 'Next'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
