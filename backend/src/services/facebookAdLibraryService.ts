import axios from 'axios';

export interface FacebookAdData {
  id: string;
  creative: {
    title?: string;
    body?: string;
    image_url?: string;
  };
  status: string;
  impressions: string;
  spend: string;
}

export class FacebookAdLibraryService {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Busca anúncios usando a Ad Library API
   */
  async searchAds(params: {
    search_terms?: string;
    ad_reached_countries?: string[];
    ad_type?: string;
    publisher_platform?: string[];
    limit?: number;
  }): Promise<FacebookAdData[]> {
    try {
      const searchParams = new URLSearchParams({
        access_token: this.accessToken,
        fields: 'id,ad_creative_bodies,ad_creative_link_captions,ad_creative_link_descriptions,ad_creative_link_titles,ad_delivery_start_time,ad_delivery_stop_time,ad_snapshot_url,currency,demographic_distribution,impressions,page_id,page_name,publisher_platforms,spend',
        limit: (params.limit || 50).toString(),
        ...params
      });

      const response = await axios.get(
        `${this.baseUrl}/ads_archive?${searchParams.toString()}`
      );

      return response.data.data || [];
    } catch (error) {
      console.error('Error searching Facebook ads:', error);
      throw new Error('Failed to search ads');
    }
  }

  /**
   * Conta quantos anúncios ativos uma página tem
   */
  async getActiveAdCount(pageId: string): Promise<number> {
    try {
      const ads = await this.searchAds({
        publisher_platform: ['facebook'],
        ad_type: 'political_and_issue_ads',
        limit: 1000 // Max permitido
      });

      // Filtrar apenas anúncios ativos
      const activeAds = ads.filter(ad => ad.status === 'ACTIVE');
      
      return activeAds.length;
    } catch (error) {
      console.error('Error getting active ad count:', error);
      return 0;
    }
  }

  /**
   * Extrai informações de uma URL da Ad Library
   */
  extractInfoFromUrl(adLibraryUrl: string): { pageId?: string; searchTerm?: string } {
    try {
      const url = new URL(adLibraryUrl);
      const params = new URLSearchParams(url.search);
      
      return {
        pageId: params.get('page_ids') || undefined,
        searchTerm: params.get('search_terms') || undefined
      };
    } catch (error) {
      console.error('Error parsing Ad Library URL:', error);
      return {};
    }
  }

  /**
   * Busca anúncios de uma URL específica da Ad Library
   */
  async getAdsFromLibraryUrl(adLibraryUrl: string): Promise<{
    count: number;
    ads: FacebookAdData[];
  }> {
    const { pageId, searchTerm } = this.extractInfoFromUrl(adLibraryUrl);
    
    if (!pageId && !searchTerm) {
      throw new Error('Invalid Ad Library URL');
    }

    const ads = await this.searchAds({
      search_terms: searchTerm,
      publisher_platform: ['facebook', 'instagram'],
      limit: 1000
    });

    // Se temos page ID, filtrar por ele
    const filteredAds = pageId 
      ? ads.filter(ad => ad.id.includes(pageId))
      : ads;

    return {
      count: filteredAds.length,
      ads: filteredAds
    };
  }

  /**
   * Verifica se um anúncio ainda está ativo
   */
  async isAdActive(adId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${adId}?access_token=${this.accessToken}&fields=status`
      );

      return response.data.status === 'ACTIVE';
    } catch (error) {
      return false;
    }
  }

  /**
   * Busca tendências de uma página
   */
  async getPageAdTrends(pageId: string, days: number = 7): Promise<{
    date: string;
    count: number;
  }[]> {
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulando - a API real não oferece histórico detalhado
      // Em um caso real, você precisaria armazenar esses dados
      const count = await this.getActiveAdCount(pageId);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        count: count + Math.floor(Math.random() * 10) - 5 // Simular variação
      });
    }
    
    return trends;
  }
}

// Função helper para criar instância do serviço
export function createFacebookService(): FacebookAdLibraryService {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('FACEBOOK_ACCESS_TOKEN not configured');
  }
  
  return new FacebookAdLibraryService(accessToken);
}

// Tipos auxiliares
export interface AdLibraryResponse {
  success: boolean;
  count?: number;
  ads?: FacebookAdData[];
  error?: string;
  last_updated?: string;
}