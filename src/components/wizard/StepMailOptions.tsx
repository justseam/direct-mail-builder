import { Check } from 'lucide-react';
import SegmentedButton from '../ui/SegmentedButton';
import Card from '../ui/Card';
import { useCampaign } from '../../stores/CampaignStore';
import { paperStocks, envelopeStocks } from '../../data/mockData';

export default function StepMailOptions() {
  const { draft, setPostageType, setPaperStock, setEnvelopeStock } = useCampaign();

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      {/* Postage Type */}
      <div className="mb-10">
        <h3 className="text-title-md font-medium text-text-primary mb-1">Postage Type</h3>
        <p className="text-body-sm text-text-secondary mb-4">Select your postage rate class</p>
        <SegmentedButton
          options={[
            { value: 'first-class', label: 'First Class' },
            { value: 'marketing', label: 'Marketing Postage Rate' },
          ]}
          value={draft.postageType}
          onChange={v => setPostageType(v as 'first-class' | 'marketing')}
        />
      </div>

      {/* Paper Stock */}
      <div className="mb-10">
        <h3 className="text-title-md font-medium text-text-primary mb-1">Paper Stock</h3>
        <p className="text-body-sm text-text-secondary mb-4">Choose the paper stock for your mail piece</p>
        <div className="grid grid-cols-3 gap-4">
          {paperStocks.map(stock => {
            const selected = draft.paperStockId === stock.id;
            return (
              <Card
                key={stock.id}
                selected={selected}
                className="cursor-pointer hover:shadow-sm transition-all relative"
                onClick={() => setPaperStock(stock.id)}
              >
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <h4 className="text-title-sm font-medium mb-2">{stock.name}</h4>
                <div className="space-y-1 text-body-sm text-text-secondary">
                  <p>Weight: {stock.weight}</p>
                  <p>Finish: {stock.finish}</p>
                  <p className="font-medium text-text-primary">${stock.pricePerUnit.toFixed(2)}/unit</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Envelope Stock */}
      <div>
        <h3 className="text-title-md font-medium text-text-primary mb-1">Envelope Stock</h3>
        <p className="text-body-sm text-text-secondary mb-4">Choose the envelope for your mail piece</p>
        <div className="grid grid-cols-2 gap-4">
          {envelopeStocks.map(stock => {
            const selected = draft.envelopeStockId === stock.id;
            return (
              <Card
                key={stock.id}
                selected={selected}
                className="cursor-pointer hover:shadow-sm transition-all relative"
                onClick={() => setEnvelopeStock(stock.id)}
              >
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <h4 className="text-title-sm font-medium mb-2">{stock.name}</h4>
                <div className="space-y-1 text-body-sm text-text-secondary">
                  <p>Size: {stock.size}</p>
                  <p>Finish: {stock.finish}</p>
                  <p className="font-medium text-text-primary">${stock.pricePerUnit.toFixed(2)}/unit</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
