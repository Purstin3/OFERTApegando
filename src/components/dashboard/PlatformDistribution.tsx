import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { useData } from '../../context/DataContext';

const PlatformDistribution: React.FC = () => {
  const { offers } = useData();
  
  // Count offers by platform
  const platformCounts = offers.reduce((acc, offer) => {
    acc[offer.platform] = (acc[offer.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort platforms by count
  const sortedPlatforms = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([platform, count]) => ({ platform, count }));
  
  // Map platform names to display names and colors
  const platformInfo: Record<string, { name: string, color: string }> = {
    facebook: { name: 'Facebook', color: 'bg-blue-500' },
    instagram: { name: 'Instagram', color: 'bg-pink-500' },
    google: { name: 'Google', color: 'bg-red-500' },
    youtube: { name: 'YouTube', color: 'bg-red-600' },
    tiktok: { name: 'TikTok', color: 'bg-black' },
    linkedin: { name: 'LinkedIn', color: 'bg-blue-700' },
    twitter: { name: 'Twitter', color: 'bg-blue-400' },
    snapchat: { name: 'Snapchat', color: 'bg-yellow-400' },
    pinterest: { name: 'Pinterest', color: 'bg-red-700' },
    other: { name: 'Other', color: 'bg-gray-500' }
  };
  
  // Calculate total for percentages
  const total = Object.values(platformCounts).reduce((sum, count) => sum + count, 0);
  
  return (
    <Card>
      <CardHeader 
        title="Platform Distribution" 
        subtitle="Offers by platform" 
      />
      <CardBody>
        <div className="space-y-4">
          {sortedPlatforms.map(({ platform, count }) => {
            const info = platformInfo[platform] || { name: platform, color: 'bg-gray-500' };
            const percentage = Math.round((count / total) * 100);
            
            return (
              <div key={platform} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {info.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`${info.color} h-2 rounded-full`} 
                    style={{ width: `${percentage}%` }} 
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default PlatformDistribution;