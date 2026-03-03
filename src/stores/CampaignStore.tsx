import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { Campaign, CampaignDraft, CanvasPage, CanvasElement, FormatType, PostageType, AudienceList } from '../types';
import { v4Id } from '../utils';
import { audienceLists as defaultAudienceLists, campaigns as defaultCampaigns } from '../data/mockData';

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
  returnAddress: '',
  paperStockId: null,
  envelopeStockId: null,
  pages: [defaultPage],
};

const MAX_UNDO = 50;

interface CampaignStoreValue {
  draft: CampaignDraft;
  audiences: AudienceList[];
  campaignList: Campaign[];
  addAudienceList: (list: AudienceList) => void;
  saveCampaign: () => void;
  setName: (name: string) => void;
  setAudience: (id: string) => void;
  setFormatType: (type: FormatType) => void;
  setPaperSize: (id: string) => void;
  setPostageType: (type: PostageType) => void;
  setReturnAddress: (addr: string) => void;
  setPaperStock: (id: string) => void;
  setEnvelopeStock: (id: string) => void;
  addPage: () => void;
  removePage: (id: string) => void;
  addElement: (pageId: string, element: CanvasElement) => void;
  updateElement: (pageId: string, elementId: string, updates: Partial<CanvasElement>) => void;
  removeElement: (pageId: string, elementId: string) => void;
  loadDraft: (draft: CampaignDraft) => void;
  resetDraft: () => void;
  undo: () => void;
  canUndo: boolean;
}

const CampaignContext = createContext<CampaignStoreValue | null>(null);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CampaignDraft>({ ...defaultDraft, pages: [{ ...defaultPage }] });
  const [audiences, setAudiences] = useState<AudienceList[]>([...defaultAudienceLists]);
  const [campaignList, setCampaignList] = useState<Campaign[]>([...defaultCampaigns]);
  const undoStack = useRef<CampaignDraft[]>([]);

  const addAudienceList = useCallback((list: AudienceList) => {
    setAudiences(prev => [...prev, list]);
  }, []);

  const saveCampaign = useCallback(() => {
    const audience = audiences.find(a => a.id === draft.audienceId);
    const audienceCount = audience?.audienceCount || 0;
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: draft.name,
      status: 'active',
      postageType: draft.postageType === 'first-class' ? 'First Class' : 'Marketing',
      audience: audience?.name || 'Unknown',
      postageCost: audienceCount * 0.55,
      printingCost: audienceCount * 0.35,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaignList(prev => [newCampaign, ...prev]);
  }, [draft, audiences]);

  /** Push current state to undo stack before mutating */
  const pushUndo = useCallback(() => {
    undoStack.current = [...undoStack.current.slice(-(MAX_UNDO - 1)), draft];
  }, [draft]);

  const setName = (name: string) => setDraft(d => ({ ...d, name }));
  const setAudience = (id: string) => setDraft(d => ({ ...d, audienceId: id }));
  const setFormatType = (type: FormatType) => setDraft(d => ({ ...d, formatType: type }));
  const setPaperSize = (id: string) => setDraft(d => ({ ...d, paperSizeId: id }));
  const setPostageType = (type: PostageType) => setDraft(d => ({ ...d, postageType: type }));
  const setReturnAddress = (addr: string) => setDraft(d => ({ ...d, returnAddress: addr }));
  const setPaperStock = (id: string) => setDraft(d => ({ ...d, paperStockId: id }));
  const setEnvelopeStock = (id: string) => setDraft(d => ({ ...d, envelopeStockId: id }));

  const addPage = () => {
    pushUndo();
    setDraft(d => {
      const num = d.pages.length + 1;
      return { ...d, pages: [...d.pages, { id: v4Id(), label: `Page ${num}`, elements: [] }] };
    });
  };

  const removePage = (id: string) => {
    pushUndo();
    setDraft(d => ({ ...d, pages: d.pages.filter(p => p.id !== id) }));
  };

  const addElement = (pageId: string, element: CanvasElement) => {
    pushUndo();
    setDraft(d => ({
      ...d,
      pages: d.pages.map(p =>
        p.id === pageId ? { ...p, elements: [...p.elements, element] } : p
      ),
    }));
  };

  const updateElement = (pageId: string, elementId: string, updates: Partial<CanvasElement>) => {
    // Don't push undo for every drag pixel — only for significant changes
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
    pushUndo();
    setDraft(d => ({
      ...d,
      pages: d.pages.map(p =>
        p.id === pageId ? { ...p, elements: p.elements.filter(el => el.id !== elementId) } : p
      ),
    }));
  };

  const loadDraft = (d: CampaignDraft) => {
    undoStack.current = [];
    setDraft(d);
  };

  const resetDraft = () => {
    undoStack.current = [];
    setDraft({ ...defaultDraft, pages: [{ ...defaultPage, id: v4Id() }] });
  };

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop()!;
    setDraft(prev);
  }, []);

  return (
    <CampaignContext.Provider value={{
      draft, audiences, campaignList, addAudienceList, saveCampaign,
      setName, setAudience, setFormatType, setPaperSize,
      setPostageType, setReturnAddress, setPaperStock, setEnvelopeStock,
      addPage, removePage, addElement, updateElement, removeElement,
      loadDraft, resetDraft, undo, canUndo: undoStack.current.length > 0,
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
