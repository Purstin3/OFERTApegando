import { Offer, AdCount, TimelineEvent, DashboardWidget } from '../types';

export const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Summer Promotion',
    description: 'Seasonal promotion with product discounts',
    platform: 'facebook',
    adLibraryUrl: 'https://www.facebook.com/ads/library/',
    createdAt: '2025-03-01T10:00:00.000Z',
    updatedAt: '2025-03-01T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'Winter Collection',
    description: 'New winter products launch campaign',
    platform: 'instagram',
    adLibraryUrl: 'https://www.facebook.com/ads/library/',
    createdAt: '2025-02-15T10:00:00.000Z',
    updatedAt: '2025-02-15T10:00:00.000Z'
  },
  {
    id: '3',
    title: 'Spring Sale',
    description: 'Special spring discounts on selected items',
    platform: 'google',
    adLibraryUrl: 'https://ads.google.com/aw/campaigns',
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z'
  },
  {
    id: '4',
    title: 'Back to School',
    description: 'Back to school promotion targeting students',
    platform: 'tiktok',
    adLibraryUrl: 'https://ads.tiktok.com/business/creativecenter/',
    createdAt: '2025-02-28T10:00:00.000Z',
    updatedAt: '2025-02-28T10:00:00.000Z'
  }
];

export const mockAdCounts: AdCount[] = [
  { id: '1', offerId: '1', date: '2025-04-01T00:00:00.000Z', count: 24 },
  { id: '2', offerId: '1', date: '2025-04-02T00:00:00.000Z', count: 28 },
  { id: '3', offerId: '1', date: '2025-04-03T00:00:00.000Z', count: 32 },
  { id: '4', offerId: '1', date: '2025-04-04T00:00:00.000Z', count: 35 },
  
  { id: '5', offerId: '2', date: '2025-04-01T00:00:00.000Z', count: 15 },
  { id: '6', offerId: '2', date: '2025-04-02T00:00:00.000Z', count: 18 },
  { id: '7', offerId: '2', date: '2025-04-03T00:00:00.000Z', count: 14 },
  { id: '8', offerId: '2', date: '2025-04-04T00:00:00.000Z', count: 12 },
  
  { id: '9', offerId: '3', date: '2025-04-01T00:00:00.000Z', count: 42 },
  { id: '10', offerId: '3', date: '2025-04-02T00:00:00.000Z', count: 45 },
  { id: '11', offerId: '3', date: '2025-04-03T00:00:00.000Z', count: 48 },
  { id: '12', offerId: '3', date: '2025-04-04T00:00:00.000Z', count: 52 },
  
  { id: '13', offerId: '4', date: '2025-04-01T00:00:00.000Z', count: 30 },
  { id: '14', offerId: '4', date: '2025-04-02T00:00:00.000Z', count: 32 },
  { id: '15', offerId: '4', date: '2025-04-03T00:00:00.000Z', count: 28 },
  { id: '16', offerId: '4', date: '2025-04-04T00:00:00.000Z', count: 25 }
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    offerId: '1',
    date: '2025-04-01T10:00:00.000Z',
    title: 'Campaign Launch',
    description: 'Initial campaign launch with 24 active ads',
    type: 'info'
  },
  {
    id: '2',
    offerId: '1',
    date: '2025-04-03T10:00:00.000Z',
    title: 'Campaign Boost',
    description: 'Added 8 new ad variations',
    type: 'success'
  },
  {
    id: '3',
    offerId: '2',
    date: '2025-04-02T10:00:00.000Z',
    title: 'Ad Scaling',
    description: 'Increased budget and added 3 new ads',
    type: 'info'
  },
  {
    id: '4',
    offerId: '3',
    date: '2025-04-04T10:00:00.000Z',
    title: 'Performance Spike',
    description: 'Significant increase in active ads and performance',
    type: 'success'
  },
  {
    id: '5',
    offerId: '4',
    date: '2025-04-03T10:00:00.000Z',
    title: 'Budget Reduction',
    description: 'Decreased ad spend and paused some ads',
    type: 'warning'
  }
];

export const mockDashboardWidgets: DashboardWidget[] = [
  {
    id: '1',
    type: 'trend',
    title: 'Ad Trends (Last 7 Days)',
    size: 'large'
  },
  {
    id: '2',
    type: 'comparison',
    title: 'Platform Comparison',
    size: 'medium'
  },
  {
    id: '3',
    type: 'platforms',
    title: 'Active Platforms',
    size: 'small'
  },
  {
    id: '4',
    type: 'timeline',
    title: 'Recent Events',
    size: 'medium'
  },
  {
    id: '5',
    type: 'topOffers',
    title: 'Top Performing Offers',
    size: 'small'
  }
];