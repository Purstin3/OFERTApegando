import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentNav, setCurrentNav] = useState('dashboard');
  
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
      <Sidebar onNavChange={setCurrentNav} currentNav={currentNav} />
      
      <div className="flex-1 flex flex-col ml-64">
        <Header title={pageTitles[currentNav]} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;