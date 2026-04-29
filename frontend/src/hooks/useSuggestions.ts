import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';

/**
 * useSuggestions
 * Custom hook to fetch initial chat suggestions for the Assistant page.
 * Fails silently by returning an empty array to maintain clean UX.
 */
export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/suggestions')
      .then(res => {
        // Backend returns { data: { suggestions: [...] } }
        setSuggestions(res.data.data.suggestions || []);
      })
      .catch(() => {
        // Silent fail — do not show error UI for suggestions
        setSuggestions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { suggestions, isLoading };
}
