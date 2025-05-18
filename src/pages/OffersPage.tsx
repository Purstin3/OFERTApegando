import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Grid, List, Plus, Search, SlidersHorizontal } from 'lucide-react';
import OfferCard from '../components/offers/OfferCard';
import AddOfferModal from '../components/offers/AddOfferModal';
import { useData } from '../context/DataContext';
import { AdPlatform } from '../types';
import { Grid, List, Plus, Search, SlidersHorizontal } from 'lucide-react';
import OfferCard from '../components/offers/OfferCard';
import AddOfferModal from '../components/offers/AddOfferModal';
import { Loading, SkeletonCard } from '../components/ui/Loading';
import { useData } from '../context/DataContext';
import { AdPlatform } from '../types';

const OffersPage: React.FC = () => {
  const { offers, adCounts, addOffer, addAdCount } = useData();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform | 'all'>('all');
  
  const handleAddOffer = (data: {
    title: string;
    description: string;
    platform: AdPlatform;
    adLibraryUrl: string;
    initialCount: number;
  }) => {
    // Add the offer
    addOffer({
      title: data.title,
      description: data.description,
      platform: data.platform,
      adLibraryUrl: data.adLibraryUrl
    });
    
    // If we have initial count data, add it as well
    if (data.initialCount > 0) {
      // Get the newly added offer
      const newOffer = offers[offers.length - 1];
      
      addAdCount({
        offerId: newOffer.id,
        date: new Date().toISOString(),
        count: data.initialCount
      });
    }
  };
  
  // Filter offers based on search and platform
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || offer.platform === selectedPlatform;
    
    return matchesSearch && matchesPlatform;
  });
  
  // View details handler (would navigate to details page in a real app)
  const handleViewDetails = (offerId: string) => {
    console.log(`View details for offer ${offerId}`);
    // In a real app, we would navigate to a details page
  };
  
  // Platform filter options
  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'google', label: 'Google' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Offers" 
          subtitle="Manage and track your competitors' offers"
          action={
            <Button 
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Offer
            </Button>
          }
        />
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 sm:max-w-md">
              <Input
                placeholder="Search offers..."
                icon={<Search size={18} />}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                className="rounded-md border border-gray-300 dark:border-gray-600 px-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value as AdPlatform | 'all')}
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                icon={<SlidersHorizontal size={16} />}
                className="px-2"
              >
                Filters
              </Button>
              
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                className="px-2"
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </Button>
              
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                className="px-2"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
          
          {filteredOffers.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map(offer => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    adCounts={adCounts.filter(count => count.offerId === offer.id)}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOffers.map(offer => {
                  const latestCount = adCounts
                    .filter(count => count.offerId === offer.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  
                  return (
                    <div 
                      key={offer.id} 
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{offer.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{offer.description}</p>
                        <div className="mt-2 flex items-center">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{offer.platform}</span>
                          <a 
                            href={offer.adLibraryUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Ad Library
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:w-32">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{latestCount?.count || 0}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Active Ads</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(offer.id)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No offers found matching your criteria</p>
              <Button 
                variant="primary" 
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Offer
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
      
      <AddOfferModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddOffer}
      />
    </div>
  );
};

export default OffersPage;