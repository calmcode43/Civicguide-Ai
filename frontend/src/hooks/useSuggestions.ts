import { useEffect, useState } from 'react';

import type { ApiResponse, StageContext, SuggestionsPayload } from '@/types';

import apiClient from '../lib/apiClient';

export function useSuggestions(persona: string, stageContext: StageContext) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get<ApiResponse<SuggestionsPayload>>('/api/suggestions', {
        params: { persona, language: 'en', stage_context: stageContext },
      })
      .then((response) => {
        setSuggestions(response.data.data.suggestions ?? []);
      })
      .catch(() => {
        setSuggestions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [persona, stageContext]);

  return { suggestions, isLoading };
}
