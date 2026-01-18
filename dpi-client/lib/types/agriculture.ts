export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: SchemeCategory;
  benefitAmount: number;
  eligibilityCriteria: Record<string, string>;
  requiredDocuments: string[];
  startDate: string;
  endDate?: string;
  ministryName: string;
  officialLink?: string;
  isActive: boolean;
  totalBudget: number;
  utilizedBudget: number;
  createdAt: string;
}

export type SchemeCategory = 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment' | 'other';

export interface SchemeApplication {
  id: string;
  userId: string;
  schemeId: string;
  applicantName: string;
  applicantMobile: string;
  applicantAadhar: string;
  status: ApplicationStatus;
  formData: Record<string, string>;
  documentUrls: string[];
  scheme?: Scheme;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';

export interface Advisory {
  id: string;
  title: string;
  cropName: string;
  season: Season;
  category: AdvisoryCategory;
  state: string;
  district?: string;
  advisory: string;
  cropTypes: string[];
  publishedBy: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

export type Season = 'kharif' | 'rabi' | 'zaid' | 'all';
export type AdvisoryCategory = 'pest_control' | 'weather' | 'irrigation' | 'fertilizer' | 'harvesting' | 'sowing' | 'general';

export interface MarketPrice {
  id: string;
  commodity: string;
  category: CommodityCategory;
  mandi: string;
  state: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  unit: string;
  arrivalsTonnes: number;
}

export type CommodityCategory = 'cereals' | 'pulses' | 'oilseeds' | 'vegetables' | 'fruits' | 'spices' | 'fibers' | 'other';

export const SCHEME_CATEGORY_LABELS: Record<SchemeCategory, string> = {
  subsidy: 'Subsidy',
  loan: 'Loan',
  insurance: 'Insurance',
  training: 'Training',
  equipment: 'Equipment',
  other: 'Other',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
};

export const SEASON_LABELS: Record<Season, string> = {
  kharif: 'Kharif',
  rabi: 'Rabi',
  zaid: 'Zaid',
  all: 'All Seasons',
};

export const ADVISORY_CATEGORY_LABELS: Record<AdvisoryCategory, string> = {
  pest_control: 'Pest Control',
  weather: 'Weather',
  irrigation: 'Irrigation',
  fertilizer: 'Fertilizer',
  harvesting: 'Harvesting',
  sowing: 'Sowing',
  general: 'General',
};
