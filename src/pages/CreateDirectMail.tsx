import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Printer, Stamp } from 'lucide-react';
import WizardShell from '../components/wizard/WizardShell';
import StepAudience from '../components/wizard/StepAudience';
import StepSize from '../components/wizard/StepSize';
import StepMailOptions from '../components/wizard/StepMailOptions';
import StepDesign from '../components/wizard/StepDesign';
import StepSummary from '../components/wizard/StepSummary';
import { useCampaign } from '../stores/CampaignStore';
import { campaigns, getPageDimensions } from '../data/mockData';
import { formatCurrency, formatNumber, v4Id } from '../utils';
import type { CampaignDraft, CanvasElement } from '../types';

const steps = ['Audience', 'Size', 'Mail Options', 'Design', 'Summary'];

/** Build placeholder canvas elements for an existing campaign — scales to page dimensions */
function buildPlaceholderElements(pageWidth = 816, pageHeight = 1056): CanvasElement[] {
  const margin = Math.round(pageWidth * 0.059);
  const contentLeft = margin + 150; // clear of logo zone
  const contentWidth = pageWidth - contentLeft - margin;
  const qrX = pageWidth - margin - 100;
  // Scale vertical positions proportionally to page height
  const vScale = pageHeight / 1056;

  return [
    {
      id: v4Id(),
      type: 'text',
      x: contentLeft,
      y: Math.round(80 * vScale),
      width: contentWidth,
      height: 44,
      content: '<strong style="font-size:20px">Important Update for You</strong>',
    },
    {
      id: v4Id(),
      type: 'divider',
      x: contentLeft,
      y: Math.round(132 * vScale),
      width: contentWidth,
      height: 2,
      content: '',
    },
    {
      id: v4Id(),
      type: 'text',
      x: contentLeft,
      y: Math.round(155 * vScale),
      width: contentWidth,
      height: 100,
      content: 'Dear Valued Customer,\n\nWe are excited to share some important updates about your account. Please review the details below and contact us if you have any questions.',
    },
    {
      id: v4Id(),
      type: 'image',
      x: Math.round(contentLeft + (contentWidth - 260) / 2),
      y: Math.round(275 * vScale),
      width: 260,
      height: 180,
      content: '',
    },
    {
      id: v4Id(),
      type: 'text',
      x: contentLeft,
      y: Math.round(475 * vScale),
      width: contentWidth,
      height: 80,
      content: 'Take advantage of this limited-time offer before it expires. Visit our website or contact your local branch to learn more about how we can help you reach your financial goals.',
    },
    {
      id: v4Id(),
      type: 'divider',
      x: contentLeft,
      y: Math.round(575 * vScale),
      width: contentWidth,
      height: 2,
      content: '',
    },
    {
      id: v4Id(),
      type: 'text',
      x: contentLeft,
      y: Math.round(595 * vScale),
      width: contentWidth,
      height: 60,
      content: 'Sincerely,\nThe Product Team',
    },
    {
      id: v4Id(),
      type: 'variable',
      x: contentLeft,
      y: Math.round(675 * vScale),
      width: 180,
      height: 32,
      content: 'first_name',
    },
    {
      id: v4Id(),
      type: 'qrcode',
      x: qrX,
      y: Math.round(580 * vScale),
      width: 100,
      height: 100,
      content: 'https://example.com',
    },
  ];
}

export default function CreateDirectMail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { draft, audiences, setName, loadDraft, resetDraft, saveCampaign } = useCampaign();
  const locState = location.state as { editId?: string; viewOnly?: boolean } | null;
  const editId = locState?.editId;
  const viewOnly = locState?.viewOnly ?? false;
  const initialized = useRef(false);

  // When editing an existing campaign, pre-populate the draft and jump to Design
  const [step, setStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (editId) {
      const campaign = campaigns.find(c => c.id === editId);
      if (!campaign) return;

      // Find the matching audience
      const audience = audiences.find(a => a.name === campaign.audience);

      const paperSizeId = 'letter-10';
      const { width: pw, height: ph } = getPageDimensions(paperSizeId);

      const editDraft: CampaignDraft = {
        name: campaign.name,
        audienceId: audience?.id || '1',
        formatType: 'simplex',
        paperSizeId,
        postageType: campaign.postageType === 'Marketing' ? 'marketing' : 'first-class',
        returnAddress: '123 Main St, Springfield, IL 62704',
        paperStockId: 'stock-20-85x11',
        envelopeStockId: 'house-10-dw',
        pages: [
          {
            id: v4Id(),
            label: 'Page 1',
            elements: buildPlaceholderElements(pw, ph),
          },
        ],
      };

      loadDraft(editDraft);
      setStep(3); // Jump directly to Design step
      setHighestStep(4);
    } else {
      resetDraft();
    }
  }, [editId, loadDraft, resetDraft]);

  const audienceCount = draft.audienceId
    ? audiences.find(a => a.id === draft.audienceId)?.audienceCount || 0
    : 0;

  // Step validation — disable Next when required selections are missing
  const isStepComplete = (s: number) => {
    switch (s) {
      case 0: return !!draft.audienceId;
      case 1: return !!draft.paperSizeId;
      case 2: return !!draft.paperStockId && !!draft.envelopeStockId && draft.returnAddress.trim().length > 0;
      default: return true;
    }
  };
  const nextDisabled = !isStepComplete(step);

  // Build a human-readable reason when Next is disabled
  const getDisabledReason = (): string | undefined => {
    if (!nextDisabled) return undefined;
    switch (step) {
      case 0: return 'Select an audience to continue';
      case 1: return 'Select a paper size to continue';
      case 2: {
        const missing: string[] = [];
        if (!draft.paperStockId) missing.push('paper stock');
        if (!draft.envelopeStockId) missing.push('envelope stock');
        if (draft.returnAddress.trim().length === 0) missing.push('return address');
        return `Enter ${missing.join(', ')} to continue`;
      }
      default: return undefined;
    }
  };
  const nextDisabledReason = getDisabledReason();

  const statsBar = (
    <div className="flex items-center gap-4 text-[12px] shrink-0">
      <div className="flex items-center gap-1 text-text-secondary">
        <Users className="w-3.5 h-3.5" />
        <span>{formatNumber(audienceCount)}</span>
      </div>
      <div className="flex items-center gap-1 text-text-secondary">
        <Printer className="w-3.5 h-3.5" />
        <span>{formatCurrency(audienceCount * 0.55)}</span>
      </div>
      <div className="flex items-center gap-1 text-text-secondary">
        <Stamp className="w-3.5 h-3.5" />
        <span>{formatCurrency(audienceCount * 0.35)}</span>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0: return <StepAudience />;
      case 1: return <StepSize />;
      case 2: return <StepMailOptions />;
      case 3: return <StepDesign />;
      case 4: return <StepSummary />;
      default: return null;
    }
  };

  return (
    <WizardShell
      title={draft.name}
      onTitleChange={viewOnly ? undefined : setName}
      steps={steps}
      currentStep={step}
      highestStep={highestStep}
      onStepClick={(s) => setStep(s)}
      onBack={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
      onNext={() => {
        if (step < steps.length - 1) {
          const next = step + 1;
          setStep(next);
          setHighestStep(h => Math.max(h, next));
        } else if (viewOnly) {
          navigate('/');
        } else {
          saveCampaign();
          navigate('/');
        }
      }}
      onClose={() => navigate('/')}
      onSaveDraft={viewOnly ? undefined : () => navigate('/')}
      showUndo={!viewOnly && step === 3}
      statsBar={statsBar}
      nextLabel={viewOnly && step === steps.length - 1 ? 'Close' : step === steps.length - 1 ? 'Launch Campaign' : 'Next'}
      nextDisabled={viewOnly ? false : nextDisabled}
      nextDisabledReason={viewOnly ? undefined : nextDisabledReason}
    >
      {renderStep()}
    </WizardShell>
  );
}
