import React, { createContext, useContext, useState, useEffect } from 'react';
import { Offer, AdCount, TimelineEvent, DashboardWidget } from '../types';
import { mockOffers, mockAdCounts, mockTimelineEvents, mockDashboardWidgets } from '../data/mockData';

interface DataContextType {
  offers: Offer[];
  adCounts: AdCount[];
  timelineEvents: TimelineEvent[];
  dashboardWidgets: DashboardWidget[];
  addOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOffer: (offer: Offer) => void;
  deleteOffer: (id: string) => void;
  addAdCount: (adCount: Omit<AdCount, 'id'>) => void;
  updateAdCount: (adCount: AdCount) => void;
  deleteAdCount: (id: string) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (event: TimelineEvent) => void;
  deleteTimelineEvent: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [adCounts, setAdCounts] = useState<AdCount[]>(mockAdCounts);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(mockDashboardWidgets);

  // Load data from localStorage if available
  useEffect(() => {
    const storedOffers = localStorage.getItem('offers');
    const storedAdCounts = localStorage.getItem('adCounts');
    const storedTimelineEvents = localStorage.getItem('timelineEvents');

    if (storedOffers) setOffers(JSON.parse(storedOffers));
    if (storedAdCounts) setAdCounts(JSON.parse(storedAdCounts));
    if (storedTimelineEvents) setTimelineEvents(JSON.parse(storedTimelineEvents));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('offers', JSON.stringify(offers));
    localStorage.setItem('adCounts', JSON.stringify(adCounts));
    localStorage.setItem('timelineEvents', JSON.stringify(timelineEvents));
  }, [offers, adCounts, timelineEvents]);

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

  return (
    <DataContext.Provider value={{
      offers,
      adCounts,
      timelineEvents,
      dashboardWidgets,
      addOffer,
      updateOffer,
      deleteOffer,
      addAdCount,
      updateAdCount,
      deleteAdCount,
      addTimelineEvent,
      updateTimelineEvent,
      deleteTimelineEvent
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