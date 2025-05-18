import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import OffersPage from './pages/OffersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotesPage from './pages/NotesPage';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'offers':
        return <OffersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'notes':
        return <NotesPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <Layout onPageChange={setCurrentPage} currentPage={currentPage}>
          {renderPage()}
        </Layout>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;