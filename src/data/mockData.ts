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
  { id: 'letter', name: 'Letter', width: '8.5"', height: '11"', maxPages: 6 },
  { id: 'legal', name: 'Legal', width: '8.5"', height: '14"', maxPages: 4 },
  { id: 'postcard-6x4', name: 'Postcard', width: '6"', height: '4"', maxPages: 2 },
  { id: 'postcard-6x9', name: 'Large Postcard', width: '6"', height: '9"', maxPages: 2 },
  { id: 'a4', name: 'A4', width: '8.27"', height: '11.69"', maxPages: 6 },
];

export const paperStocks: PaperStock[] = [
  { id: 'standard-20', name: '20lb Bond', weight: '20lb', finish: 'Smooth', pricePerUnit: 0.02 },
  { id: 'premium-24', name: '24lb Bond', weight: '24lb', finish: 'Smooth', pricePerUnit: 0.03 },
  { id: 'cardstock-80', name: '80lb Cardstock', weight: '80lb', finish: 'Matte', pricePerUnit: 0.05 },
  { id: 'gloss-100', name: '100lb Gloss', weight: '100lb', finish: 'Gloss', pricePerUnit: 0.07 },
  { id: 'linen-70', name: '70lb Linen', weight: '70lb', finish: 'Linen Texture', pricePerUnit: 0.06 },
];

export const envelopeStocks: EnvelopeStock[] = [
  { id: 'standard-10', name: '#10 Standard', size: '4.125" x 9.5"', finish: 'White Wove', pricePerUnit: 0.04 },
  { id: 'window-10', name: '#10 Window', size: '4.125" x 9.5"', finish: 'White Wove', pricePerUnit: 0.05 },
  { id: 'catalog-6x9', name: '6x9 Catalog', size: '6" x 9"', finish: 'White Wove', pricePerUnit: 0.06 },
  { id: 'booklet-9x12', name: '9x12 Booklet', size: '9" x 12"', finish: 'Kraft', pricePerUnit: 0.08 },
];

export const sampleCSVHeaders = ['FIRST_NAME', 'LAST_NAME', 'ADDRESS_1', 'ADDRESS_2', 'CITY', 'STATE', 'ZIP', 'EMAIL'];

export const sampleCSVData = [
  ['John', 'Smith', '123 Main St', 'Apt 4B', 'Springfield', 'IL', '62704', 'john@example.com'],
  ['Jane', 'Doe', '456 Oak Ave', '', 'Portland', 'OR', '97201', 'jane@example.com'],
  ['Bob', 'Johnson', '789 Pine Rd', 'Suite 100', 'Austin', 'TX', '78701', 'bob@example.com'],
  ['Alice', 'Williams', '321 Elm St', '', 'Denver', 'CO', '80202', 'alice@example.com'],
  ['Charlie', 'Brown', '654 Maple Dr', 'Unit 12', 'Seattle', 'WA', '98101', 'charlie@example.com'],
];

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
