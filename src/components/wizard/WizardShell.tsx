import { type ReactNode } from 'react';
import { X, Undo2, Redo2, ChevronRight, Pencil } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils';

interface WizardShellProps {
  title: string;
  onTitleChange?: (title: string) => void;
  steps: string[];
  currentStep: number;
  highestStep?: number;
  onStepClick?: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onSaveDraft?: () => void;
  showUndo?: boolean;
  statsBar?: ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  children: ReactNode;
}

export default function WizardShell({
  title,
  onTitleChange,
  steps,
  currentStep,
  highestStep,
  onStepClick,
  onBack,
  onNext,
  onClose,
  onSaveDraft,
  showUndo,
  statsBar,
  nextLabel,
  nextDisabled,
  backDisabled,
  children,
}: WizardShellProps) {
  const maxReached = highestStep ?? currentStep;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="h-screen flex flex-col bg-page-bg">
      {/* Header — two rows */}
      <div className="bg-white border-b border-border shrink-0">
        {/* Row 1: Title + stats + undo/redo + close */}
        <div className="px-4 sm:px-6 pt-3 pb-1.5 flex items-center gap-3 min-w-0">
          {onTitleChange ? (
            <div className="flex items-center gap-1.5 group shrink-0">
              <input
                value={title}
                onChange={e => onTitleChange(e.target.value)}
                className="text-title-md font-bold text-text-primary bg-transparent border-none outline-none focus:ring-0 w-32 sm:w-48 hover:bg-gray-50 rounded px-1 -ml-1 transition-colors"
              />
              <Pencil className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            <h1 className="text-title-md font-bold text-text-primary shrink-0">{title}</h1>
          )}

          <div className="flex-1" />

          <div className="hidden sm:block">{statsBar}</div>

          {showUndo && (
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <button className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary">
                <Undo2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary">
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-text-secondary ml-1 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Row 2: Breadcrumb step nav */}
        <nav className="px-4 sm:px-6 pb-2.5 flex items-center gap-1 overflow-x-auto">
          {steps.map((step, i) => {
            const canClick = onStepClick && i <= maxReached && i !== currentStep;
            return (
              <div key={step} className="flex items-center shrink-0">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 mx-1 text-gray-300" />}
                <span
                  role={canClick ? 'button' : undefined}
                  tabIndex={canClick ? 0 : undefined}
                  onClick={canClick ? () => onStepClick(i) : undefined}
                  onKeyDown={canClick ? (e) => { if (e.key === 'Enter') onStepClick(i); } : undefined}
                  className={cn(
                    'text-body-sm px-2.5 py-0.5 rounded-full transition-colors',
                    i === currentStep && 'border border-primary text-primary font-semibold bg-primary/5',
                    i < currentStep && 'text-text-secondary',
                    i > currentStep && i <= maxReached && 'text-text-secondary',
                    i > maxReached && 'text-text-secondary/60',
                    canClick && 'cursor-pointer hover:bg-gray-100',
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-0 relative">
        <div className="absolute inset-0">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-border px-4 sm:px-6 py-3 flex items-center shrink-0">
        {/* Left: Back / avatar area */}
        <div className="flex items-center shrink-0">
          {currentStep > 0 && !backDisabled ? (
            <Button variant="secondary" size="sm" onClick={onBack}>
              Back
            </Button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[12px] font-semibold text-primary">U</span>
            </div>
          )}
        </div>

        {/* Center: Step indicator */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5">
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
          <span className="text-body-sm text-text-secondary">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Right: Save + Next */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onSaveDraft && (
            <span className="hidden sm:contents">
              <Button variant="secondary" size="sm" onClick={onSaveDraft}>
                Save as a Draft
              </Button>
            </span>
          )}
          <Button
            size="sm"
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
