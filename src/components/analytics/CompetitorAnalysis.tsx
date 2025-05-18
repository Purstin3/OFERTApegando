import React from 'react';
import OverviewCards from '../components/dashboard/OverviewCards';
import AdTrendsChart from '../components/dashboard/AdTrendsChart';
import PlatformDistribution from '../components/dashboard/PlatformDistribution';
import RecentActivity from '../components/dashboard/RecentActivity';
import InsightsPanel from '../components/dashboard/InsightsPanel';
import AlertsPanel from '../components/dashboard/AlertsPanel';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <OverviewCards />
      
      {/* Alertas e Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsPanel />
        <InsightsPanel />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdTrendsChart />
        <div className="grid grid-cols-1 gap-6">
          <PlatformDistribution />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;