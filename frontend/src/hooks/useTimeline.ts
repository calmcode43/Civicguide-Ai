import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { type ElectionPhase } from '../types';

/**
 * useTimeline
 * Custom hook to fetch the complete election process timeline.
 * Returns phases, loading state, and mapped errors.
 */
export function useTimeline() {
  const [phases, setPhases] = useState<ElectionPhase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/timeline');
      // Backend returns { status: 'success', data: { phases: [...] } }
      setPhases(response.data.data.phases);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return { 
    phases, 
    isLoading, 
    error, 
    refetch: fetchTimeline 
  };
}
