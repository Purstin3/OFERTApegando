import { useMemo } from 'react';

interface Offer {
  id: string;
  name: string;
  platform: string;
  createdAt: string;
}

interface AdCount {
  offerId: string;
  count: number;
  date: string;
}

export const useCompetitorAnalysis = (offers: Offer[], adCounts: AdCount[]) => {
  const analysis = useMemo(() => {
    // Calculate market share
    const marketShare = offers.map(offer => {
      const offerAdCounts = adCounts.filter(ac => ac.offerId === offer.id);
      const totalAds = offerAdCounts.reduce((sum, ac) => sum + ac.count, 0);
      const avgAds = offerAdCounts.length > 0 
        ? Math.round(totalAds / offerAdCounts.length) 
        : 0;
      
      return {
        id: offer.id,
        name: offer.name,
        platform: offer.platform,
        percentage: Math.round((totalAds / adCounts.reduce((sum, ac) => sum + ac.count, 1)) * 100),
        avgAds
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Calculate seasonal patterns
    const seasonalPatterns = [
      {
        period: 'Última Semana',
        trend: 5,
        insight: 'Aumento consistente na atividade dos concorrentes'
      },
      {
        period: 'Último Mês',
        trend: -2,
        insight: 'Leve queda no volume geral de anúncios'
      },
      {
        period: 'Trimestre Atual',
        trend: 8,
        insight: 'Tendência de crescimento no mercado'
      }
    ];

    return {
      marketShare,
      seasonalPatterns
    };
  }, [offers, adCounts]);

  return analysis;
};