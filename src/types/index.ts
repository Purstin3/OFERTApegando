export interface Offer {
  id: string;
  title: string;
  description: string;
  platform: AdPlatform;
  adLibraryUrl: string;
  createdAt: string;
  updatedAt: string;
  isPaused?: boolean;
}

export interface AdCount {
  id: string;
  offerId: string;
  date: string;
  count: number;
  notes?: string;
}

export type AdPlatform = 
  | 'facebook'
  | 'instagram'
  | 'google'
  | 'youtube'
  | 'tiktok'
  | 'linkedin'
  | 'twitter'
  | 'snapchat'
  | 'pinterest'
  | 'other';

export interface TimelineEvent {
  id: string;
  offerId: string;
  date: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'trend' | 'comparison' | 'platforms' | 'timeline' | 'topOffers';
  title: string;
  size: 'small' | 'medium' | 'large';
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
}

export * from './new-types';