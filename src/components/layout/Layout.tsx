import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onPageChange: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onPageChange, currentPage }) => {
  // Page title mapping
  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    offers: 'Ad Offers',
    analytics: 'Analytics',
    notes: 'Notes',
    profile: 'Profile',
    settings: 'Settings'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar onNavChange={onPageChange} currentNav={currentPage} />
      
      <div className="flex-1 flex flex-col ml-64">
        <Header title={pageTitles[currentPage]} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;