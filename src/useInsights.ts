import { useMemo } from 'react';
import { Offer, AdCount, Insight } from '../types';
import { TrendingUp, Target, AlertTriangle, Brain } from 'lucide-react';
import { findMostActiveCompetitor, findUnderutilizedPlatform, calculateTrend } from '../utils/helpers';

export const useInsights = (offers: Offer[], adCounts: AdCount[]): Insight[] => {
  return useMemo(() => {
    const insights: Insight[] = [];
    
    // Insight 1: Competidor mais ativo
    const mostActive = findMostActiveCompetitor(offers, adCounts);
    if (mostActive && mostActive.growth > 20) {
      insights.push({
        id: 'most-active',
        icon: TrendingUp,
        title: `${mostActive.name} está muito ativo`,
        description: `+${mostActive.growth}% nos últimos 7 dias. Pode estar testando nova estratégia.`,
        action: {
          label: 'Ver detalhes',
          onClick: () => console.log('Navigate to offer details')
        }
      });
    }
    
    // Insight 2: Oportunidade de plataforma
    const underutilizedPlatform = findUnderutilizedPlatform(offers);
    if (underutilizedPlatform) {
      insights.push({
        id: 'platform-opportunity',
        icon: Target,
        title: `Oportunidade no ${underutilizedPlatform}`,
        description: 'Poucos competidores ativos nesta plataforma. Considere investir.',
        action: {
          label: 'Analisar',
          onClick: () => console.log('Analyze platform opportunity')
        }
      });
    }
    
    // Insight 3: Competidor parou de anunciar
    const stoppedCompetitors = offers.filter(offer => {
      const latestCount = adCounts
        .filter(count => count.offerId === offer.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return latestCount && latestCount.count === 0;
    });
    
    if (stoppedCompetitors.length > 0) {
      insights.push({
        id: 'stopped-competitors',
        icon: AlertTriangle,
        title: `${stoppedCompetitors.length} competidor(es) parou(param)`,
        description: 'Alguns competidores pararam de anunciar. Pode ser uma oportunidade.',
        action: {
          label: 'Ver lista',
          onClick: () => console.log('Show stopped competitors')
        }
      });
    }
    
    // Insight 4: Tendência geral do mercado
    const totalCurrentAds = offers.reduce((sum, offer) => {
      const latestCount = adCounts
        .filter(count => count.offerId === offer.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return sum + (latestCount?.count || 0);
    }, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const totalWeekAgoAds = offers.reduce((sum, offer) => {
      const weekAgoCount = adCounts
        .filter(count => 
          count.offerId === offer.id && 
          new Date(count.date) <= weekAgo
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return sum + (weekAgoCount?.count || 0);
    }, 0);
    
    const marketTrend = totalWeekAgoAds > 0 
      ? Math.round(((totalCurrentAds - totalWeekAgoAds) / totalWeekAgoAds) * 100)
      : 0;
    
    if (Math.abs(marketTrend) > 10) {
      insights.push({
        id: 'market-trend',
        icon: Brain,
        title: `Mercado ${marketTrend > 0 ? 'aquecendo' : 'esfriando'}`,
        description: `Volume total de anúncios ${marketTrend > 0 ? 'aumentou' : 'diminuiu'} ${Math.abs(marketTrend)}% na semana.`,
        action: {
          label: 'Ver análise',
          onClick: () => console.log('Show market analysis')
        }
      });
    }
    
    return insights;
  }, [offers, adCounts]);
};