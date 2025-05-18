import { AdCount, Offer } from '../types';

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateTrend = (counts: AdCount[], days: number = 7): number => {
  if (counts.length < 2) return 0;
  
  const sortedCounts = counts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days);
  
  if (sortedCounts.length < 2) return 0;
  
  const newest = sortedCounts[0].count;
  const oldest = sortedCounts[sortedCounts.length - 1].count;
  
  if (oldest === 0) return newest > 0 ? 100 : 0;
  
  return Math.round(((newest - oldest) / oldest) * 100);
};

export const getAverageCount = (counts: AdCount[], days: number = 7): number => {
  if (counts.length === 0) return 0;
  
  const recentCounts = counts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days);
  
  const total = recentCounts.reduce((sum, count) => sum + count.count, 0);
  return Math.round(total / recentCounts.length);
};

export const findMostActiveCompetitor = (offers: Offer[], adCounts: AdCount[]) => {
  const competitorGrowth = offers.map(offer => {
    const offerCounts = adCounts.filter(count => count.offerId === offer.id);
    const growth = calculateTrend(offerCounts, 7);
    
    return {
      id: offer.id,
      name: offer.title,
      growth,
      platform: offer.platform
    };
  });
  
  return competitorGrowth
    .filter(comp => comp.growth > 0)
    .sort((a, b) => b.growth - a.growth)[0];
};

export const findUnderutilizedPlatform = (offers: Offer[]): string | null => {
  const platformCounts = offers.reduce((acc, offer) => {
    acc[offer.platform] = (acc[offer.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedPlatforms = Object.entries(platformCounts)
    .sort((a, b) => a[1] - b[1]);
  
  return sortedPlatforms.length > 0 ? sortedPlatforms[0][0] : null;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};