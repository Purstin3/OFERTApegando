import React, { createContext, useContext, useState, useEffect } from 'react';
import { Offer, AdCount, TimelineEvent, DashboardWidget, Filter, Alert, ImportRecord } from '../types';
import { mockOffers, mockAdCounts, mockTimelineEvents, mockDashboardWidgets } from '../data/mockData';

interface DataContextType {
  // Dados existentes
  offers: Offer[];
  adCounts: AdCount[];
  timelineEvents: TimelineEvent[];
  dashboardWidgets: DashboardWidget[];
  
  // Novos estados
  filters: Filter;
  alerts: Alert[];
  importHistory: ImportRecord[];
  isLoading: boolean;
  lastSync: string | null;
  
  // Métodos existentes
  addOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOffer: (offer: Offer) => void;
  deleteOffer: (id: string) => void;
  addAdCount: (adCount: Omit<AdCount, 'id'>) => void;
  updateAdCount: (adCount: AdCount) => void;
  deleteAdCount: (id: string) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (event: TimelineEvent) => void;
  deleteTimelineEvent: (id: string) => void;
  
  // Novos métodos
  setFilters: (filters: Partial<Filter>) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlerts: () => void;
  addImportRecord: (record: Omit<ImportRecord, 'id'>) => void;
  setLoading: (loading: boolean) => void;
  syncOffers: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados existentes
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [adCounts, setAdCounts] = useState<AdCount[]>(mockAdCounts);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(mockDashboardWidgets);

  // Novos estados
  const [filters, setFiltersState] = useState<Filter>({
    dateRange: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
    platforms: [],
    minAdCount: 0,
    sortBy: 'name'
  });
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [importHistory, setImportHistory] = useState<ImportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Load data from localStorage if available
  useEffect(() => {
    const storedOffers = localStorage.getItem('offers');
    const storedAdCounts = localStorage.getItem('adCounts');
    const storedTimelineEvents = localStorage.getItem('timelineEvents');
    const storedAlerts = localStorage.getItem('alerts');
    const storedImportHistory = localStorage.getItem('importHistory');
    const storedLastSync = localStorage.getItem('lastSync');

    if (storedOffers) setOffers(JSON.parse(storedOffers));
    if (storedAdCounts) setAdCounts(JSON.parse(storedAdCounts));
    if (storedTimelineEvents) setTimelineEvents(JSON.parse(storedTimelineEvents));
    if (storedAlerts) setAlerts(JSON.parse(storedAlerts));
    if (storedImportHistory) setImportHistory(JSON.parse(storedImportHistory));
    if (storedLastSync) setLastSync(storedLastSync);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('offers', JSON.stringify(offers));
    localStorage.setItem('adCounts', JSON.stringify(adCounts));
    localStorage.setItem('timelineEvents', JSON.stringify(timelineEvents));
    localStorage.setItem('alerts', JSON.stringify(alerts));
    localStorage.setItem('importHistory', JSON.stringify(importHistory));
    if (lastSync) localStorage.setItem('lastSync', lastSync);
  }, [offers, adCounts, timelineEvents, alerts, importHistory, lastSync]);

  // Métodos existentes (manter todos os existentes)
  const addOffer = (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newOffer: Offer = {
      ...offerData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const updateOffer = (offer: Offer) => {
    setOffers(prev => prev.map(o => o.id === offer.id ? { ...offer, updatedAt: new Date().toISOString() } : o));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    setAdCounts(prev => prev.filter(ac => ac.offerId !== id));
    setTimelineEvents(prev => prev.filter(te => te.offerId !== id));
  };

  const addAdCount = (adCountData: Omit<AdCount, 'id'>) => {
    const newAdCount: AdCount = {
      ...adCountData,
      id: Date.now().toString()
    };
    setAdCounts(prev => [...prev, newAdCount]);
  };

  const updateAdCount = (adCount: AdCount) => {
    setAdCounts(prev => prev.map(ac => ac.id === adCount.id ? adCount : ac));
  };

  const deleteAdCount = (id: string) => {
    setAdCounts(prev => prev.filter(ac => ac.id !== id));
  };

  const addTimelineEvent = (eventData: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: Date.now().toString()
    };
    setTimelineEvents(prev => [...prev, newEvent]);
  };

  const updateTimelineEvent = (event: TimelineEvent) => {
    setTimelineEvents(prev => prev.map(te => te.id === event.id ? event : te));
  };

  const deleteTimelineEvent = (id: string) => {
    setTimelineEvents(prev => prev.filter(te => te.id !== id));
  };

  // Novos métodos
  const setFilters = (newFilters: Partial<Filter>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const addAlert = (alertData: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString()
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const addImportRecord = (recordData: Omit<ImportRecord, 'id'>) => {
    const newRecord: ImportRecord = {
      ...recordData,
      id: Date.now().toString()
    };
    setImportHistory(prev => [...prev, newRecord]);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

   const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    offers: false,
    adCounts: false,
    sync: false,
    delete: false
  });

  const syncOffers = async () => {
    setLoading(true);
    try {
      // Simular sync - aqui você implementaria a lógica real
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSync(new Date().toISOString());
      
      addAlert({
        offerId: 'system',
        type: 'sync_complete',
        severity: 'low',
        message: 'Sincronização concluída com sucesso',
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    } catch (error) {
      addAlert({
        offerId: 'system',
        type: 'sync_error',
        severity: 'high',
        message: 'Erro na sincronização: ' + error.message,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{
      // Estados existentes
      offers,
      adCounts,
      timelineEvents,
      dashboardWidgets,
      
      // Novos estados
      filters,
      alerts,
      importHistory,
      isLoading,
      lastSync,
      
      // Métodos existentes
      addOffer,
      updateOffer,
      deleteOffer,
      addAdCount,
      updateAdCount,
      deleteAdCount,
      addTimelineEvent,
      updateTimelineEvent,
      deleteTimelineEvent,
      
      // Novos métodos
      setFilters,
      addAlert,
      acknowledgeAlert,
      clearAlerts,
      addImportRecord,
      setLoading,
      syncOffers
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

