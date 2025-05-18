import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { offersApi, adCountsApi, syncApi } from '../services/api';
import { Offer, AdCount } from '../types';

// Query keys
export const QUERY_KEYS = {
  offers: ['offers'] as const,
  offer: (id: string) => ['offers', id] as const,
  adCounts: ['adCounts'] as const,
  adCountsByOffer: (offerId: string) => ['adCounts', 'offer', offerId] as const,
  syncStatus: ['sync', 'status'] as const,
};

// Offers hooks
export function useOffers() {
  return useQuery({
    queryKey: QUERY_KEYS.offers,
    queryFn: offersApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.offer(id),
    queryFn: () => offersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: offersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Offer> }) =>
      offersApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offer(data.id) });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: offersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers });
    },
  });
}

export function usePauseOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: offersApi.pause,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offer(data.id) });
    },
  });
}

export function useResumeOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: offersApi.resume,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offer(data.id) });
    },
  });
}

// Ad Counts hooks
export function useAdCounts() {
  return useQuery({
    queryKey: QUERY_KEYS.adCounts,
    queryFn: adCountsApi.getAll,
  });
}

export function useAdCountsByOffer(offerId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.adCountsByOffer(offerId),
    queryFn: () => adCountsApi.getByOfferId(offerId),
    enabled: !!offerId,
  });
}

export function useCreateAdCount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adCountsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adCounts });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.adCountsByOffer(data.offerId) 
      });
    },
  });
}

// Sync hooks
export function useSyncStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.syncStatus,
    queryFn: syncApi.getStatus,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

export function useSyncOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: syncApi.syncOffer,
    onSuccess: (data, offerId) => {
      if (data.success) {
        queryClient.invalidateQueries({ 
          queryKey: QUERY_KEYS.adCountsByOffer(offerId) 
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adCounts });
      }
    },
  });
}

export function useSyncAll() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: syncApi.syncAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adCounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offers });
    },
  });
}

// Combined hook for offers with their ad counts
export function useOffersWithCounts() {
  const offersQuery = useOffers();
  const adCountsQuery = useAdCounts();
  
  const offersWithCounts = React.useMemo(() => {
    if (!offersQuery.data || !adCountsQuery.data) return [];
    
    return offersQuery.data.map(offer => {
      const offerAdCounts = adCountsQuery.data.filter(
        count => count.offerId === offer.id
      );
      
      const latestCount = offerAdCounts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return {
        ...offer,
        adCounts: offerAdCounts,
        latestCount: latestCount?.count || 0,
        lastUpdated: latestCount?.date,
      };
    });
  }, [offersQuery.data, adCountsQuery.data]);
  
  return {
    data: offersWithCounts,
    isLoading: offersQuery.isLoading || adCountsQuery.isLoading,
    error: offersQuery.error || adCountsQuery.error,
    refetch: () => {
      offersQuery.refetch();
      adCountsQuery.refetch();
    },
  };
}

export default {
  useOffers,
  useOffer,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  usePauseOffer,
  useResumeOffer,
  useAdCounts,
  useAdCountsByOffer,
  useCreateAdCount,
  useSyncStatus,
  useSyncOffer,
  useSyncAll,
  useOffersWithCounts,
};