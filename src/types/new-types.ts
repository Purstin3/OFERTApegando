export interface ImportRecord {
  id: string;
  timestamp: string;
  source: 'manual' | 'api' | 'csv';
  itemsImported: number;
  errors: string[];
}

export interface SyncResult {
  success: boolean;
  newCount?: number;
  creatives?: Creative[];
  lastSync?: string;
  error?: string;
}

export interface Creative {
  id: string;
  offerId: string;
  imageUrl?: string;
  headline: string;
  description: string;
  platform: string;
  score: number;
  detectedAt: string;
}

export interface Anomaly {
  type: 'sudden_increase' | 'sudden_decrease' | 'competitor_stopped';
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface AlertRule {
  name: string;
  condition: (offer: Offer, newCount: number) => Promise<boolean>;
  type: string;
  severity: 'low' | 'medium' | 'high';
  getMessage: (offer: Offer, count: number) => Promise<string>;
}

export interface Alert {
  id: string;
  offerId: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Filter {
  dateRange: [Date, Date];
  platforms: AdPlatform[];
  minAdCount: number;
  sortBy: 'name' | 'adCount' | 'trend' | 'lastUpdated';
}

export interface Insight {
  id: string;
  icon: React.ComponentType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Report {
  period: 'daily' | 'weekly' | 'monthly';
  generatedAt: string;
  summary: {
    totalOffers: number;
    totalAds: number;
    avgDailyAds: number;
    platforms: number;
  };
  topPerformers: any[];
  insights: string[];
  charts: {
    dailyTrend: any[];
    platformDistribution: any[];
  };
}

export interface Column<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface ScheduledJob {
  name: string;
  interval: string;
  execute: () => Promise<void>;
  lastRun?: Date;
  successCount?: number;
  failureCount?: number;
}

export interface Annotation {
  id: string;
  content: string;
  author: {
    name: string;
    id: string;
  };
  createdAt: string;
  type: 'insight' | 'observation' | 'strategy';
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline';
}

// Importar no arquivo types principal