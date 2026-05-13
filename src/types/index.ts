// Shared types for the Influencer Portfolio Site

// --- Generic Action Result ---

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// --- Enums / Union Types ---

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export type CollaborationType =
  | 'sponsored_post'
  | 'product_review'
  | 'brand_ambassador'
  | 'giveaway'
  | 'event_appearance'
  | 'other';

export type BudgetRange =
  | 'under_500'
  | '500_1000'
  | '1000_5000'
  | '5000_10000'
  | 'over_10000';

export type MediaType = 'image' | 'video';

// --- Collaboration Request ---

export interface CollaborationFormData {
  brandName: string;
  contactName: string;
  contactEmail: string;
  collaborationType: CollaborationType;
  budgetRange: BudgetRange;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CollaborationRequestSummary {
  id: string;
  brandName: string;
  contactEmail: string;
  collaborationType: CollaborationType;
  createdAt: Date;
  status: RequestStatus;
}

// --- Dashboard ---

export interface DashboardMetricsData {
  pendingRequests: number;
  totalRequests: number;
  acceptedCollaborations: number;
}

// --- Portfolio ---

export interface PortfolioItemWithBrand {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: MediaType;
  brand: string;
  category: string;
  active: boolean;
  sortOrder: number;
}

export interface CreatePortfolioItemData {
  title: string;
  mediaUrl: string;
  mediaType: MediaType;
  brand: string;
  category: string;
}

export interface UpdatePortfolioItemData {
  title?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  brand?: string;
  category?: string;
}

// --- Social Profiles ---

export interface CreateProfileData {
  platformName: string;
  handle: string;
  profileUrl: string;
  followerCount: number;
  bioExcerpt?: string;
  iconUrl?: string;
}

export interface UpdateProfileData {
  platformName?: string;
  handle?: string;
  profileUrl?: string;
  followerCount?: number;
  bioExcerpt?: string;
  iconUrl?: string;
}
