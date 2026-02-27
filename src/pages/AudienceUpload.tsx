import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import WizardShell from '../components/wizard/WizardShell';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { sampleCSVHeaders, sampleCSVData, mappableColumns } from '../data/mockData';
import { cn } from '../utils';

const steps = ['Upload', 'Mapping', 'Confirmation'];

export default function AudienceUpload() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [listName, setListName] = useState('');
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    sampleCSVHeaders.forEach(h => { m[h] = h; });
    return m;
  });
  const [dragOver, setDragOver] = useState(false);

  const simulateUpload = useCallback(() => {
    setFileName('audience_list_export.csv');
    setListName('Imported Audience');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  }, [simulateUpload]);

  const errorRows = [2, 4]; // simulate errors on rows 2 and 4

  return (
    <WizardShell
      title="Upload Audience List"
      steps={steps}
      currentStep={step}
      onBack={() => step > 0 ? setStep(s => s - 1) : navigate('/audiences')}
      onNext={() => {
        if (step === 0 && !fileName) {
          simulateUpload();
          return;
        }
        if (step < steps.length - 1) setStep(s => s + 1);
        else navigate('/audiences');
      }}
      onClose={() => navigate('/audiences')}
      nextLabel={step === steps.length - 1 ? 'Confirm and Upload' : 'Next'}
      nextDisabled={step === 0 && !fileName}
    >
      <div className="max-w-3xl mx-auto py-10 px-6">
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
                  <p className="text-body-sm text-text-secondary">5 records found</p>
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
                <strong>5</strong> records found
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

        {/* Step 3: Confirmation */}
        {step === 2 && (
          <div>
            <h2 className="text-headline-sm font-bold mb-2">Review & Confirm</h2>

            <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[12px]">
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
                    const hasError = errorRows.includes(i);
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
                <strong>{sampleCSVData.length - errorRows.length}</strong> of {sampleCSVData.length} records will be imported
              </p>
            </div>
          </div>
        )}
      </div>
    </WizardShell>
  );
}
