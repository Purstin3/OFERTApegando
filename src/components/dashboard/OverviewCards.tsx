import React from 'react';
import { Card, CardBody } from '../ui/Card';
import { TrendingUp as Trending, TrendingDown, TrendingUp, Users, Activity, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';

const OverviewCards: React.FC = () => {
  const { offers, adCounts } = useData();
  
  // Calculate total active ads (most recent count for each offer)
  const totalActiveAds = (() => {
    const offerLatestCounts = offers.map(offer => {
      const offerCounts = adCounts.filter(count => count.offerId === offer.id);
      return offerCounts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]?.count || 0;
    });
    
    return offerLatestCounts.reduce((sum, count) => sum + count, 0);
  })();
  
  // Calculate 7-day trend percentage
  const adTrend = (() => {
    // Get dates 7 days ago and today
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // Filter counts in the date range
    const recentCounts = adCounts.filter(count => {
      const countDate = new Date(count.date);
      return countDate >= sevenDaysAgo && countDate <= today;
    });
    
    if (recentCounts.length === 0) return 0;
    
    // Group by day and get total for each day
    const dayTotals = recentCounts.reduce((acc, count) => {
      const dateKey = new Date(count.date).toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + count.count;
      return acc;
    }, {} as Record<string, number>);
    
    // Get oldest and newest day totals
    const days = Object.keys(dayTotals).sort();
    if (days.length < 2) return 0;
    
    const oldestTotal = dayTotals[days[0]] || 0;
    const newestTotal = dayTotals[days[days.length - 1]] || 0;
    
    // Calculate percentage change
    if (oldestTotal === 0) return 100; // Avoid division by zero
    return Math.round(((newestTotal - oldestTotal) / oldestTotal) * 100);
  })();
  
  // Determine trend icon and color
  const getTrendDisplay = (trend: number) => {
    if (trend > 0) {
      return { 
        icon: <TrendingUp size={20} className="text-green-500" />,
        color: 'text-green-500'
      };
    } else if (trend < 0) {
      return { 
        icon: <TrendingDown size={20} className="text-red-500" />,
        color: 'text-red-500'
      };
    } else {
      return { 
        icon: <Trending size={20} className="text-gray-500" />,
        color: 'text-gray-500'
      };
    }
  };
  
  const trendDisplay = getTrendDisplay(adTrend);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="transform transition-transform hover:scale-105">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Ads</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{totalActiveAds}</h3>
              <div className="flex items-center mt-1">
                {trendDisplay.icon}
                <span className={`text-sm ml-1 ${trendDisplay.color}`}>
                  {Math.abs(adTrend)}% {adTrend >= 0 ? 'increase' : 'decrease'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Tag size={24} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="transform transition-transform hover:scale-105">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monitored Offers</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{offers.length}</h3>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Across {new Set(offers.map(o => o.platform)).size} platforms</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Activity size={24} className="text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="transform transition-transform hover:scale-105">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Platforms</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{new Set(offers.map(o => o.platform)).size}</h3>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Facebook, Instagram, Google...</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Activity size={24} className="text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="transform transition-transform hover:scale-105">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data Points</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{adCounts.length}</h3>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
              <Users size={24} className="text-indigo-600 dark:text-indigo-300" />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OverviewCards;