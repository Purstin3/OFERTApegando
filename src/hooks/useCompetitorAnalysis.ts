import { useState, useEffect } from 'react';
import { CompetitorData } from '../types';

export const useCompetitorAnalysis = () => {
  const [competitorData, setCompetitorData] = useState<CompetitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitorData = async () => {
      try {
        // Simulated API call - replace with actual API endpoint
        const response = await fetch('/api/competitor-data');
        const data = await response.json();
        setCompetitorData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch competitor data');
        setLoading(false);
      }
    };

    fetchCompetitorData();
  }, []);

  return { competitorData, loading, error };
};