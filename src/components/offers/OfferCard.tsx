import React, { useState } from 'react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExternalLink, TrendingUp, TrendingDown, Calendar, MoreVertical, Edit, Copy, Pause, Play, Trash2 } from 'lucide-react';
import { Offer, AdCount, AdPlatform } from '../../types';
import { Button } from '../ui/Button';

interface OfferCardProps {
  offer: Offer;
  adCounts: AdCount[];
  onViewDetails: (offerId: string) => void;
  onEdit?: (offer: Offer) => void;
  onDuplicate?: (offer: Offer) => void;
  onPause?: (offerId: string) => void;
  onResume?: (offerId: string) => void;
  onDelete?: (offerId: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ 
  offer, 
  adCounts, 
  onViewDetails,
  onEdit,
  onDuplicate,
  onPause,
  onResume,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    
    if (oldest === 0) return 0;
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
  
  // Check if offer is paused
  const isPaused = (offer as any).isPaused || false;
  
  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
      setShowActions(false);
    }
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow relative">
      <CardBody className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge variant={getPlatformColor(offer.platform)}>
            {getPlatformName(offer.platform)}
          </Badge>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar size={12} className="mr-1" />
              {new Date(offer.createdAt).toLocaleDateString()}
            </span>
            
            {/* Actions Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical size={16} />
              </Button>
              
              {showActions && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 w-48">
                  <div className="py-1">
                    {onEdit && (
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        onClick={() => handleAction(() => onEdit(offer))}
                        disabled={isLoading}
                      >
                        <Edit size={14} className="mr-2" />
                        Editar
                      </button>
                    )}
                    
                    {onDuplicate && (
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        onClick={() => handleAction(() => onDuplicate(offer))}
                        disabled={isLoading}
                      >
                        <Copy size={14} className="mr-2" />
                        Duplicar
                      </button>
                    )}
                    
                    {!isPaused && onPause && (
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        onClick={() => handleAction(() => onPause(offer.id))}
                        disabled={isLoading}
                      >
                        <Pause size={14} className="mr-2" />
                        Pausar
                      </button>
                    )}
                    
                    {isPaused && onResume && (
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        onClick={() => handleAction(() => onResume(offer.id))}
                        disabled={isLoading}
                      >
                        <Play size={14} className="mr-2" />
                        Retomar
                      </button>
                    )}
                    
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    
                    {onDelete && (
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"
                        onClick={() => handleAction(() => onDelete(offer.id))}
                        disabled={isLoading}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {offer.title}
          {isPaused && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              Pausado
            </span>
          )}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {offer.description}
        </p>
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Anúncios Ativos
          </span>
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            {latestCount?.count || 0}
          </span>
        </div>
        
        <div className="flex items-center">
          {trend > 0 ? (
            <>
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-500">+{trend}% em 4 dias</span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown size={16} className="text-red-500 mr-1" />
              <span className="text-sm text-red-500">{trend}% em 4 dias</span>
            </>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">Sem mudança</span>
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
            disabled={isLoading}
          >
            Ver Detalhes
          </Button>
        </div>
      </CardFooter>
      
      {/* Overlay when loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </Card>
  );
};

export default OfferCard;