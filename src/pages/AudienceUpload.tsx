import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import WizardShell from '../components/wizard/WizardShell';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { sampleCSVHeaders, sampleCSVData, mappableColumns } from '../data/mockData';
import { useCampaign } from '../stores/CampaignStore';
import { cn } from '../utils';

const steps = ['Upload', 'Mapping', 'Review', 'Status'];

export default function AudienceUpload() {
  const navigate = useNavigate();
  const { addAudienceList } = useCampaign();
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [listName, setListName] = useState('');
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    sampleCSVHeaders.forEach(h => { m[h] = h; });
    return m;
  });
  const [dragOver, setDragOver] = useState(false);

  // Upload status state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  const previewErrorRows = [2, 4]; // rows with errors in preview sample
  const totalRecords = 3247;
  const errorCount = 12;
  const successRecords = totalRecords - errorCount;

  const simulateUpload = useCallback(() => {
    setFileName('audience_list_export.csv');
    setListName('Imported Audience');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  }, [simulateUpload]);

  // Simulate upload progress when entering the status step
  useEffect(() => {
    if (step !== 3) return;
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
          addAudienceList({
            id: `uploaded-${Date.now()}`,
            name: listName || 'Imported Audience',
            audienceCount: successRecords,
            createdOn: new Date().toISOString().split('T')[0],
            activeCampaigns: 0,
          });
        }, 400);
      }
      setUploadProgress(Math.min(100, Math.round(progress)));
    }, 300);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <WizardShell
      title="Upload Audience List"
      steps={steps}
      currentStep={step}
      onBack={() => {
        if (step === 3) return; // no back during upload
        if (step > 0) setStep(s => s - 1);
        else navigate('/audiences');
      }}
      onNext={() => {
        if (step === 0 && !fileName) {
          simulateUpload();
          return;
        }
        if (step < steps.length - 1) setStep(s => s + 1);
        else navigate('/audiences');
      }}
      onClose={() => navigate('/audiences')}
      nextLabel={step === 2 ? 'Upload' : step === 3 ? 'Done' : 'Next'}
      nextDisabled={(step === 0 && !fileName) || (step === 3 && !uploadDone)}
      backDisabled={step === 3}
    >
      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
        {/* Step 1: Upload */}
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-headline-sm font-bold mb-2">Upload CSV File</h2>
            <p className="text-body-md text-text-secondary mb-8">
              Upload your audience list as a CSV file
            </p>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={simulateUpload}
              className={cn(
                'border-2 border-dashed rounded-[12px] p-12 cursor-pointer transition-colors',
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
        {step === 1 && (
          <div>
            <h2 className="text-headline-sm font-bold mb-2">Map Columns</h2>
            <div className="flex items-center gap-6 mb-6">
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
        {step === 2 && (
          <div>
            <h2 className="text-headline-sm font-bold mb-2">Review & Confirm</h2>

            <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[12px]">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-body-md font-medium text-amber-800">
                  {errorCount} records have errors
                </p>
                <p className="text-body-sm text-amber-700">
                  These records will be skipped during import. Review the highlighted rows below.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-border overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-label-md font-semibold text-table-header uppercase">Row</th>
                    {sampleCSVHeaders.map(h => (
                      <th key={h} className="px-4 py-3 text-left text-label-md font-semibold text-table-header uppercase text-[11px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleCSVData.map((row, i) => {
                    const hasError = previewErrorRows.includes(i);
                    return (
                      <tr
                        key={i}
                        className={cn(
                          'border-b border-border last:border-b-0',
                          hasError && 'bg-red-50',
                        )}
                      >
                        <td className="px-4 py-2 text-body-sm">
                          {hasError && <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline mr-1" />}
                          {i + 1}
                        </td>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-body-sm">{cell || '-'}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <p className="text-body-md text-text-secondary">
                <strong>{successRecords}</strong> of {totalRecords} records will be imported
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Upload Status */}
        {step === 3 && (
          <div className="text-center py-8">
            {!uploadDone ? (
              <>
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-6 animate-spin" />
                <h2 className="text-headline-sm font-bold mb-2">Uploading Audience List</h2>
                <p className="text-body-md text-text-secondary mb-8">
                  Importing records from <strong>{fileName}</strong>...
                </p>

                {/* Progress bar */}
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
                <CheckCircle2 className="w-14 h-14 text-status-completed mx-auto mb-6" />
                <h2 className="text-headline-sm font-bold mb-2">Upload Complete</h2>
                <p className="text-body-md text-text-secondary mb-8">
                  Your audience list <strong>{listName}</strong> has been processed.
                </p>

                {/* Result cards */}
                <div className="flex items-center justify-center gap-4 max-w-md mx-auto mb-8">
                  <div className="flex-1 bg-green-50 border border-green-200 rounded-[12px] p-5">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">{successRecords}</p>
                    <p className="text-body-sm text-green-600 font-medium">Successful</p>
                  </div>
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-[12px] p-5">
                    <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                    <p className="text-body-sm text-red-500 font-medium">Failed</p>
                  </div>
                </div>

                {/* Error details */}
                {errorCount > 0 && (
                  <div className="max-w-md mx-auto text-left bg-amber-50 border border-amber-200 rounded-[12px] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-body-sm font-medium text-amber-800">
                        {errorCount} records skipped due to missing required fields
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </WizardShell>
  );
}
