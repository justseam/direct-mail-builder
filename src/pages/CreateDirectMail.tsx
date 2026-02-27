import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign } from 'lucide-react';
import WizardShell from '../components/wizard/WizardShell';
import StepAudience from '../components/wizard/StepAudience';
import StepSize from '../components/wizard/StepSize';
import StepMailOptions from '../components/wizard/StepMailOptions';
import StepDesign from '../components/wizard/StepDesign';
import StepSummary from '../components/wizard/StepSummary';
import { useCampaign } from '../stores/CampaignStore';
import { formatCurrency, formatNumber } from '../utils';

const steps = ['Audience', 'Size', 'Mail Options', 'Design', 'Summary'];

export default function CreateDirectMail() {
  const navigate = useNavigate();
  const { draft, setName } = useCampaign();
  const [step, setStep] = useState(0);

  const audienceCount = draft.audienceId ? 2450 : 0;

  const statsBar = (
    <div className="flex items-center gap-4 text-[12px] shrink-0">
      <div className="flex items-center gap-1 text-text-secondary">
        <Users className="w-3.5 h-3.5" />
        <span>{formatNumber(audienceCount)}</span>
      </div>
      <div className="flex items-center gap-1 text-text-secondary">
        <DollarSign className="w-3.5 h-3.5" />
        <span>{formatCurrency(audienceCount * 0.55)}</span>
      </div>
      <div className="flex items-center gap-1 text-text-secondary">
        <DollarSign className="w-3.5 h-3.5" />
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
      onTitleChange={setName}
      steps={steps}
      currentStep={step}
      onBack={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
      onNext={() => {
        if (step < steps.length - 1) setStep(s => s + 1);
        else navigate('/');
      }}
      onClose={() => navigate('/')}
      onSaveDraft={() => navigate('/')}
      showUndo={step === 3}
      statsBar={statsBar}
      nextLabel={step === steps.length - 1 ? 'Launch Campaign' : 'Next'}
    >
      {renderStep()}
    </WizardShell>
  );
}
