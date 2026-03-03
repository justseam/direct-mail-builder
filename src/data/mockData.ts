import type { Campaign, AudienceList, PaperSize, PaperStock, EnvelopeStock } from '../types';

export const campaigns: Campaign[] = [
  { id: '1', name: 'Summer Sale Postcard', status: 'active', postageType: 'First Class', audience: 'VIP Customers', postageCost: 1250.00, printingCost: 875.00, createdAt: '2026-01-15' },
  { id: '2', name: 'Holiday Greeting Letter', status: 'completed', postageType: 'Marketing', audience: 'All Members', postageCost: 3420.00, printingCost: 2150.00, createdAt: '2025-12-01' },
  { id: '3', name: 'New Account Welcome Kit', status: 'active', postageType: 'First Class', audience: 'New Accounts Q1', postageCost: 890.00, printingCost: 645.00, createdAt: '2026-02-01' },
  { id: '4', name: 'Product Launch Announcement', status: 'draft', postageType: 'Marketing', audience: 'Prospect List A', postageCost: 0, printingCost: 0, createdAt: '2026-02-20' },
  { id: '5', name: 'Annual Statement Insert', status: 'scheduled', postageType: 'First Class', audience: 'All Members', postageCost: 5200.00, printingCost: 3800.00, createdAt: '2026-02-10' },
  { id: '6', name: 'Referral Program Mailer', status: 'running', postageType: 'Marketing', audience: 'Active Referrers', postageCost: 2100.00, printingCost: 1450.00, createdAt: '2026-01-28' },
  { id: '7', name: 'Branch Opening Invite', status: 'draft', postageType: 'First Class', audience: 'Local Residents', postageCost: 0, printingCost: 0, createdAt: '2026-02-25' },
  { id: '8', name: 'Rate Change Notification', status: 'completed', postageType: 'First Class', audience: 'Loan Holders', postageCost: 4100.00, printingCost: 2900.00, createdAt: '2025-11-15' },
  { id: '9', name: 'Spring Campaign Postcard', status: 'active', postageType: 'Marketing', audience: 'Dormant Accounts', postageCost: 1800.00, printingCost: 1200.00, createdAt: '2026-02-14' },
  { id: '10', name: 'Membership Renewal Notice', status: 'scheduled', postageType: 'First Class', audience: 'Expiring Members', postageCost: 3350.00, printingCost: 2400.00, createdAt: '2026-02-18' },
  { id: '11', name: 'Event Invitation - Gala', status: 'draft', postageType: 'First Class', audience: 'Top Tier Members', postageCost: 0, printingCost: 0, createdAt: '2026-02-22' },
  { id: '12', name: 'Cross-Sell Auto Loans', status: 'active', postageType: 'Marketing', audience: 'Checking Only', postageCost: 2750.00, printingCost: 1900.00, createdAt: '2026-01-05' },
  { id: '13', name: 'Fraud Alert Reminder', status: 'completed', postageType: 'First Class', audience: 'All Members', postageCost: 6100.00, printingCost: 4200.00, createdAt: '2025-10-20' },
  { id: '14', name: 'Mobile App Promo', status: 'running', postageType: 'Marketing', audience: 'Non-Digital Users', postageCost: 1650.00, printingCost: 1100.00, createdAt: '2026-02-05' },
  { id: '15', name: 'Year-End Tax Docs', status: 'inactive', postageType: 'First Class', audience: 'Investment Accts', postageCost: 3900.00, printingCost: 2800.00, createdAt: '2025-12-15' },
];

export const audienceLists: AudienceList[] = [
  { id: '1', name: 'VIP Customers', audienceCount: 2450, createdOn: '2026-01-10', activeCampaigns: 2 },
  { id: '2', name: 'All Members', audienceCount: 15820, createdOn: '2025-11-01', activeCampaigns: 3 },
  { id: '3', name: 'New Accounts Q1', audienceCount: 890, createdOn: '2026-01-15', activeCampaigns: 1 },
  { id: '4', name: 'Prospect List A', audienceCount: 5200, createdOn: '2025-12-20', activeCampaigns: 1 },
  { id: '5', name: 'Dormant Accounts', audienceCount: 3100, createdOn: '2026-02-01', activeCampaigns: 1 },
];

export const paperSizes: PaperSize[] = [
  { id: 'letter-10', name: '8.5 x 11 Letter in House 10', width: '8.5"', height: '11"', maxPages: 7, envelope: 'House 10' },
  { id: 'letter-6x9', name: '8.5 x 11 Letter in 6x9', width: '8.5"', height: '11"', maxPages: 5, envelope: '6x9' },
  { id: 'letter-9x12', name: '8.5 x 11 Letter in 9x12', width: '8.5"', height: '11"', maxPages: 10, envelope: '9x12' },
  { id: 'legal-10', name: '8.5 x 14 Legal in House 10', width: '8.5"', height: '14"', maxPages: 5, envelope: 'House 10' },
  { id: 'postcard-6x9', name: '6 x 9 Postcard', width: '6"', height: '9"', maxPages: 2, envelope: 'None' },
  { id: 'postcard-6x4', name: '6 x 4 Postcard', width: '6"', height: '4"', maxPages: 2, envelope: 'None' },
];

export const paperStocks: PaperStock[] = [
  { id: 'stock-20-85x11', name: '20# paper (8.5x11)', description: '20 lbs, both side matte, weight 0.165', weightValue: '0.165', sheetCount: 2000, pricePerUnit: 0.020 },
  { id: 'stock-24-85x11', name: '24# paper (8.5x11)', description: '24 lbs, both side matte, weight 0.195', weightValue: '0.195', sheetCount: 2000, pricePerUnit: 0.023 },
  { id: 'stock-28-85x11', name: '28# paper (8.5x11)', description: '28 lbs, both side matte, weight 0.220', weightValue: '0.220', sheetCount: 1500, pricePerUnit: 0.028 },
];

export const envelopeStocks: EnvelopeStock[] = [
  { id: 'house-6x9', name: 'House 6x9 envelope', pricePerUnit: 0.01, shape: 'tall' },
  { id: 'house-9x12', name: 'House 9x12 envelope', pricePerUnit: 0.01, shape: 'tall' },
  { id: 'house-10-dw', name: 'House 10 Double Window envelope', pricePerUnit: 0.01, shape: 'wide' },
];

export const sampleCSVHeaders = ['FIRST_NAME', 'LAST_NAME', 'ADDRESS_1', 'ADDRESS_2', 'CITY', 'STATE', 'ZIP', 'EMAIL'];

export const sampleCSVData = [
  ['John', 'Smith', '123 Main St', 'Apt 4B', 'Springfield', 'IL', '62704', 'john@example.com'],
  ['Jane', 'Doe', '456 Oak Ave', '', '', 'OR', '97201', 'jane@example.com'],
  ['Bob', 'Johnson', '789 Pine Rd', 'Suite 100', 'Austin', 'TX', '78701', 'bob@example.com'],
  ['Alice', 'Williams', '321 Elm St', '', '', 'CO', '80202', 'alice@example.com'],
  ['Charlie', 'Brown', '654 Maple Dr', 'Unit 12', 'Seattle', 'WA', '98101', 'charlie@example.com'],
];

/** Convert a paper-size ID to pixel dimensions at 96 DPI */
export function getPageDimensions(paperSizeId: string | null): { width: number; height: number } {
  const size = paperSizeId ? paperSizes.find(s => s.id === paperSizeId) : null;
  if (!size) return { width: 816, height: 1056 }; // 8.5×11 fallback
  const w = parseFloat(size.width.replace('"', ''));
  const h = parseFloat(size.height.replace('"', ''));
  return { width: Math.round(w * 96), height: Math.round(h * 96) };
}

export const mappableColumns = [
  'CHOOSE',
  'FIRST_NAME',
  'LAST_NAME',
  'ADDRESS_1',
  'ADDRESS_2',
  'CITY',
  'STATE',
  'ZIP',
  'EMAIL',
  'PHONE',
  'ACCOUNT_NUMBER',
  'CUSTOM_1',
  'CUSTOM_2',
];
