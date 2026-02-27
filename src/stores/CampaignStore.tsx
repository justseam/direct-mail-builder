import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CampaignDraft, CanvasPage, CanvasElement, FormatType, PostageType } from '../types';
import { v4Id } from '../utils';

const defaultPage: CanvasPage = {
  id: '1',
  label: 'Page 1',
  elements: [],
};

const defaultDraft: CampaignDraft = {
  name: 'Untitled Campaign',
  audienceId: null,
  formatType: 'simplex',
  paperSizeId: null,
  postageType: 'first-class',
  paperStockId: null,
  envelopeStockId: null,
  pages: [defaultPage],
};

interface CampaignStoreValue {
  draft: CampaignDraft;
  setName: (name: string) => void;
  setAudience: (id: string) => void;
  setFormatType: (type: FormatType) => void;
  setPaperSize: (id: string) => void;
  setPostageType: (type: PostageType) => void;
  setPaperStock: (id: string) => void;
  setEnvelopeStock: (id: string) => void;
  addPage: () => void;
  removePage: (id: string) => void;
  addElement: (pageId: string, element: CanvasElement) => void;
  updateElement: (pageId: string, elementId: string, updates: Partial<CanvasElement>) => void;
  removeElement: (pageId: string, elementId: string) => void;
  resetDraft: () => void;
}

const CampaignContext = createContext<CampaignStoreValue | null>(null);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CampaignDraft>({ ...defaultDraft, pages: [{ ...defaultPage }] });

  const setName = (name: string) => setDraft(d => ({ ...d, name }));
  const setAudience = (id: string) => setDraft(d => ({ ...d, audienceId: id }));
  const setFormatType = (type: FormatType) => setDraft(d => ({ ...d, formatType: type }));
  const setPaperSize = (id: string) => setDraft(d => ({ ...d, paperSizeId: id }));
  const setPostageType = (type: PostageType) => setDraft(d => ({ ...d, postageType: type }));
  const setPaperStock = (id: string) => setDraft(d => ({ ...d, paperStockId: id }));
  const setEnvelopeStock = (id: string) => setDraft(d => ({ ...d, envelopeStockId: id }));

  const addPage = () => {
    setDraft(d => {
      const num = d.pages.length + 1;
      return { ...d, pages: [...d.pages, { id: v4Id(), label: `Page ${num}`, elements: [] }] };
    });
  };

  const removePage = (id: string) => {
    setDraft(d => ({ ...d, pages: d.pages.filter(p => p.id !== id) }));
  };

  const addElement = (pageId: string, element: CanvasElement) => {
    setDraft(d => ({
      ...d,
      pages: d.pages.map(p =>
        p.id === pageId ? { ...p, elements: [...p.elements, element] } : p
      ),
    }));
  };

  const updateElement = (pageId: string, elementId: string, updates: Partial<CanvasElement>) => {
    setDraft(d => ({
      ...d,
      pages: d.pages.map(p =>
        p.id === pageId
          ? { ...p, elements: p.elements.map(el => el.id === elementId ? { ...el, ...updates } : el) }
          : p
      ),
    }));
  };

  const removeElement = (pageId: string, elementId: string) => {
    setDraft(d => ({
      ...d,
      pages: d.pages.map(p =>
        p.id === pageId ? { ...p, elements: p.elements.filter(el => el.id !== elementId) } : p
      ),
    }));
  };

  const resetDraft = () => setDraft({ ...defaultDraft, pages: [{ ...defaultPage, id: v4Id() }] });

  return (
    <CampaignContext.Provider value={{
      draft, setName, setAudience, setFormatType, setPaperSize,
      setPostageType, setPaperStock, setEnvelopeStock,
      addPage, removePage, addElement, updateElement, removeElement, resetDraft,
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaign must be inside CampaignProvider');
  return ctx;
}
