import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import OffersPage from './pages/OffersPage';
import NotesPage from './pages/NotesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'offers':
        return <OffersPage />;
      case 'notes':
        return <NotesPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <Layout>
          {renderPage()}
        </Layout>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;