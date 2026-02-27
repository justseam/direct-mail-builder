import { type ReactNode } from 'react';
import { X, Undo2, Redo2, ChevronRight, Check, Pencil } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils';

interface WizardShellProps {
  title: string;
  onTitleChange?: (title: string) => void;
  steps: string[];
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onSaveDraft?: () => void;
  showUndo?: boolean;
  statsBar?: ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: ReactNode;
}

export default function WizardShell({
  title,
  onTitleChange,
  steps,
  currentStep,
  onBack,
  onNext,
  onClose,
  onSaveDraft,
  showUndo,
  statsBar,
  nextLabel,
  nextDisabled,
  children,
}: WizardShellProps) {
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="h-screen flex flex-col bg-page-bg">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0">
        {onTitleChange ? (
          <div className="flex items-center gap-1.5 group shrink-0">
            <input
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              className="text-body-md font-medium text-text-primary bg-transparent border-none outline-none focus:ring-0 w-40 hover:bg-gray-50 rounded px-1 -ml-1 transition-colors"
            />
            <Pencil className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <h1 className="text-title-md font-medium text-text-primary">{title}</h1>
        )}

        {/* Breadcrumb steps */}
        <nav className="flex items-center gap-1 ml-4">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              {i > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-300" />}
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'w-5 h-5 rounded-full text-[11px] font-medium flex items-center justify-center shrink-0',
                    i < currentStep && 'bg-status-completed text-white',
                    i === currentStep && 'bg-primary text-white',
                    i > currentStep && 'bg-gray-200 text-text-secondary',
                  )}
                >
                  {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span
                  className={cn(
                    'text-body-sm',
                    i === currentStep ? 'text-primary font-medium' : 'text-text-secondary',
                    i < currentStep && 'text-status-completed',
                  )}
                >
                  {step}
                </span>
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-1" />

        {statsBar}

        {showUndo && (
          <div className="flex items-center gap-1 ml-4">
            <button className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary">
              <Undo2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary">
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-text-secondary ml-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-0 relative">
        <div className="absolute inset-0">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-border px-6 py-3 flex items-center justify-between shrink-0">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>

        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i === currentStep ? 'bg-primary' : i < currentStep ? 'bg-status-completed' : 'bg-gray-300',
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <Button variant="secondary" onClick={onSaveDraft}>
              Save as a Draft
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel || (isLast ? 'Finish' : 'Next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
