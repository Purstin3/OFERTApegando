import React from 'react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExternalLink, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Offer, AdCount, AdPlatform } from '../../types';
import { Button } from '../ui/Button';

interface OfferCardProps {
  offer: Offer;
  adCounts: AdCount[];
  onViewDetails: (offerId: string) => void;
}
// Adicionar handlers reais:
const handlePause = (offerId: string) => {
  // Lógica para pausar monitoring
};

const handleEdit = (offerId: string) => {
  // Abrir modal de edição
};

const handleDuplicate = (offerId: string) => {
  // Duplicar oferta
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, adCounts, onViewDetails }) => {
  // Get the most recent ad count
  const latestCount = adCounts
    .filter(count => count.offerId === offer.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  // Calculate 4-day trend
  const calculateTrend = () => {
    const relevantCounts = adCounts
      .filter(count => count.offerId === offer.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
    
    if (relevantCounts.length < 2) return 0;
    
    const newest = relevantCounts[0].count;
    const oldest = relevantCounts[relevantCounts.length - 1].count;
    
    if (oldest === 0) return 0; // Avoid division by zero
    return Math.round(((newest - oldest) / oldest) * 100);
  };
  
  const trend = calculateTrend();
  
  // Platform badge colors
  const getPlatformColor = (platform: AdPlatform) => {
    const colors: Record<AdPlatform, string> = {
      facebook: 'primary',
      instagram: 'secondary',
      google: 'danger',
      youtube: 'danger',
      tiktok: 'default',
      linkedin: 'primary',
      twitter: 'info',
      snapchat: 'warning',
      pinterest: 'danger',
      other: 'default'
    };
    return colors[platform] || 'default';
  };
  
  // Platform display names
  const getPlatformName = (platform: AdPlatform) => {
    const names: Record<AdPlatform, string> = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      google: 'Google',
      youtube: 'YouTube',
      tiktok: 'TikTok',
      linkedin: 'LinkedIn',
      twitter: 'Twitter',
      snapchat: 'Snapchat',
      pinterest: 'Pinterest',
      other: 'Other'
    };
    return names[platform] || platform;
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardBody className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge variant={getPlatformColor(offer.platform)}>
            {getPlatformName(offer.platform)}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar size={12} className="mr-1" />
            {new Date(offer.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {offer.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {offer.description}
        </p>
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Ads
          </span>
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            {latestCount?.count || 0}
          </span>
        </div>
        
        <div className="flex items-center">
          {trend > 0 ? (
            <>
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-500">+{trend}% in 4 days</span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown size={16} className="text-red-500 mr-1" />
              <span className="text-sm text-red-500">{trend}% in 4 days</span>
            </>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">No change</span>
          )}
        </div>
      </CardBody>
      
      <CardFooter className="border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center w-full">
          <a 
            href={offer.adLibraryUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 text-sm flex items-center hover:underline"
          >
            Ad Library <ExternalLink size={14} className="ml-1" />
          </a>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(offer.id)}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;