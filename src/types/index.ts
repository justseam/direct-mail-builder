export type CampaignStatus = 'active' | 'draft' | 'inactive' | 'scheduled' | 'running' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  postageType: string;
  audience: string;
  postageCost: number;
  printingCost: number;
  createdAt: string;
}

export interface AudienceList {
  id: string;
  name: string;
  audienceCount: number;
  createdOn: string;
  activeCampaigns: number;
}

export interface PaperSize {
  id: string;
  name: string;
  width: string;
  height: string;
  maxPages: number;
}

export interface PaperStock {
  id: string;
  name: string;
  weight: string;
  finish: string;
  pricePerUnit: number;
}

export interface EnvelopeStock {
  id: string;
  name: string;
  size: string;
  finish: string;
  pricePerUnit: number;
}

export type FormatType = 'simplex' | 'duplex';
export type PostageType = 'first-class' | 'marketing';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, string>;
}

export type ElementType =
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'logo'
  | 'html'
  | 'social'
  | 'map'
  | 'qrcode'
  | 'video'
  | 'divider'
  | 'table'
  | 'variable';

export interface CanvasPage {
  id: string;
  label: string;
  elements: CanvasElement[];
}

export interface CampaignDraft {
  name: string;
  audienceId: string | null;
  formatType: FormatType;
  paperSizeId: string | null;
  postageType: PostageType;
  paperStockId: string | null;
  envelopeStockId: string | null;
  pages: CanvasPage[];
}

export interface AudienceUploadState {
  file: File | null;
  listName: string;
  columnMappings: Record<string, string>;
  previewData: string[][];
  headers: string[];
  errors: { row: number; message: string }[];
}
