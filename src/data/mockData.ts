import { Offer, AdCount, TimelineEvent, DashboardWidget } from '../types';

export const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Summer Promotion',
    description: 'Seasonal promotion with product discounts',
    platform: 'facebook',
    adLibraryUrl: 'https://www.facebook.com/ads/library/',
    createdAt: '2025-03-01T10:00:00.000Z',
    updatedAt: '2025-03-01T10:00:00.000Z',
    isPaused: false
  },
  {
    id: '2',
    title: 'Winter Collection',
    description: 'New winter products launch campaign',
    platform: 'instagram',
    adLibraryUrl: 'https://www.facebook.com/ads/library/',
    createdAt: '2025-02-15T10:00:00.000Z',
    updatedAt: '2025-02-15T10:00:00.000Z',
    isPaused: true
  },
  {
    id: '3',
    title: 'Spring Sale',
    description: 'Special spring discounts on selected items',
    platform: 'google',
    adLibraryUrl: 'https://ads.google.com/aw/campaigns',
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z',
    isPaused: false
  },
  {
    id: '4',
    title: 'Back to School',
    description: 'Back to school promotion targeting students',
    platform: 'tiktok',
    adLibraryUrl: 'https://ads.tiktok.com/business/creativecenter/',
    createdAt: '2025-02-28T10:00:00.000Z',
    updatedAt: '2025-02-28T10:00:00.000Z',
    isPaused: false
  }
];

export const mockAdCounts: AdCount[] = [
  // Summer Promotion (ID: 1)
  { id: '1', offerId: '1', date: '2025-05-01T00:00:00.000Z', count: 24 },
  { id: '2', offerId: '1', date: '2025-05-02T00:00:00.000Z', count: 28 },
  { id: '3', offerId: '1', date: '2025-05-03T00:00:00.000Z', count: 32 },
  { id: '4', offerId: '1', date: '2025-05-04T00:00:00.000Z', count: 35 },
  { id: '5', offerId: '1', date: '2025-05-05T00:00:00.000Z', count: 31 },
  { id: '6', offerId: '1', date: '2025-05-06T00:00:00.000Z', count: 38 },
  { id: '7', offerId: '1', date: '2025-05-07T00:00:00.000Z', count: 42 },
  { id: '8', offerId: '1', date: '2025-05-08T00:00:00.000Z', count: 39 },
  { id: '9', offerId: '1', date: '2025-05-09T00:00:00.000Z', count: 45 },
  { id: '10', offerId: '1', date: '2025-05-10T00:00:00.000Z', count: 48 },
  
  // Winter Collection (ID: 2) - Pausada
  { id: '11', offerId: '2', date: '2025-05-01T00:00:00.000Z', count: 15 },
  { id: '12', offerId: '2', date: '2025-05-02T00:00:00.000Z', count: 18 },
  { id: '13', offerId: '2', date: '2025-05-03T00:00:00.000Z', count: 14 },
  { id: '14', offerId: '2', date: '2025-05-04T00:00:00.000Z', count: 12 },
  { id: '15', offerId: '2', date: '2025-05-05T00:00:00.000Z', count: 10 },
  { id: '16', offerId: '2', date: '2025-05-06T00:00:00.000Z', count: 8 },
  { id: '17', offerId: '2', date: '2025-05-07T00:00:00.000Z', count: 5 },
  { id: '18', offerId: '2', date: '2025-05-08T00:00:00.000Z', count: 0 },
  
  // Spring Sale (ID: 3)
  { id: '19', offerId: '3', date: '2025-05-01T00:00:00.000Z', count: 42 },
  { id: '20', offerId: '3', date: '2025-05-02T00:00:00.000Z', count: 45 },
  { id: '21', offerId: '3', date: '2025-05-03T00:00:00.000Z', count: 48 },
  { id: '22', offerId: '3', date: '2025-05-04T00:00:00.000Z', count: 52 },
  { id: '23', offerId: '3', date: '2025-05-05T00:00:00.000Z', count: 55 },
  { id: '24', offerId: '3', date: '2025-05-06T00:00:00.000Z', count: 58 },
  { id: '25', offerId: '3', date: '2025-05-07T00:00:00.000Z', count: 62 },
  { id: '26', offerId: '3', date: '2025-05-08T00:00:00.000Z', count: 59 },
  { id: '27', offerId: '3', date: '2025-05-09T00:00:00.000Z', count: 65 },
  { id: '28', offerId: '3', date: '2025-05-10T00:00:00.000Z', count: 68 },
  
  // Back to School (ID: 4)
  { id: '29', offerId: '4', date: '2025-05-01T00:00:00.000Z', count: 30 },
  { id: '30', offerId: '4', date: '2025-05-02T00:00:00.000Z', count: 32 },
  { id: '31', offerId: '4', date: '2025-05-03T00:00:00.000Z', count: 28 },
  { id: '32', offerId: '4', date: '2025-05-04T00:00:00.000Z', count: 25 },
  { id: '33', offerId: '4', date: '2025-05-05T00:00:00.000Z', count: 27 },
  { id: '34', offerId: '4', date: '2025-05-06T00:00:00.000Z', count: 35 },
  { id: '35', offerId: '4', date: '2025-05-07T00:00:00.000Z', count: 38 },
  { id: '36', offerId: '4', date: '2025-05-08T00:00:00.000Z', count: 40 },
  { id: '37', offerId: '4', date: '2025-05-09T00:00:00.000Z', count: 42 },
  { id: '38', offerId: '4', date: '2025-05-10T00:00:00.000Z', count: 45, notes: 'Campanha otimizada' }
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    offerId: '1',
    date: '2025-05-01T10:00:00.000Z',
    title: 'Campanha Lançada',
    description: 'Lançamento inicial com 24 anúncios ativos',
    type: 'info'
  },
  {
    id: '2',
    offerId: '1',
    date: '2025-05-05T10:00:00.000Z',
    title: 'Otimização de Campanha',
    description: 'Ajustes de segmentação e orçamento',
    type: 'success'
  },
  {
    id: '3',
    offerId: '1',
    date: '2025-05-10T14:30:00.000Z',
    title: 'Pico de Performance',
    description: 'Aumento significativo para 48 anúncios ativos',
    type: 'success'
  },
  {
    id: '4',
    offerId: '2',
    date: '2025-05-02T10:00:00.000Z',
    title: 'Escalamento da Campanha',
    description: 'Aumento de orçamento e novas variações de criativo',
    type: 'info'
  },
  {
    id: '5',
    offerId: '2',
    date: '2025-05-07T10:00:00.000Z',
    title: 'Campanha Pausada',
    description: 'Pausada devido à baixa performance e ROI negativo',
    type: 'warning'
  },
  {
    id: '6',
    offerId: '3',
    date: '2025-05-01T10:00:00.000Z',
    title: 'Início da Promoção',
    description: 'Lançamento da campanha de Spring Sale',
    type: 'info'
  },
  {
    id: '7',
    offerId: '3',
    date: '2025-05-08T10:00:00.000Z',
    title: 'Crescimento Exponencial',
    description: 'Crescimento superior a 60% em uma semana',
    type: 'success'
  },
  {
    id: '8',
    offerId: '4',
    date: '2025-05-01T10:00:00.000Z',
    title: 'Campanha Back to School',
    description: 'Início da campanha focada em estudantes',
    type: 'info'
  },
  {
    id: '9',
    offerId: '4',
    date: '2025-05-06T10:00:00.000Z',
    title: 'Mudança de Segmentação',
    description: 'Ajuste de público-alvo para pais de estudantes',
    type: 'info'
  },
  {
    id: '10',
    offerId: '4',
    date: '2025-05-10T10:00:00.000Z',
    title: 'Otimização Final',
    description: 'Campanha otimizada com melhor performance',
    type: 'success'
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