import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import type { ApiResponse, BackendHealthPayload } from '@/types';

interface BackendHealth {
  isReachable: boolean;
  geminiReady: boolean;
  translateReady: boolean;
  firestoreMode: 'firestore' | 'memory';
  isChecking: boolean;
}

export function useApiHealth(): BackendHealth {
  const [state, setState] = useState<BackendHealth>({
    isReachable: true,
    geminiReady: false,
    translateReady: false,
    firestoreMode: 'memory',
    isChecking: true,
  });

  useEffect(() => {
    apiClient
      .get<ApiResponse<BackendHealthPayload>>('/api/health')
      .then((response) => {
        setState({
          isReachable: response.data.data.backend_ready,
          geminiReady: response.data.data.gemini_ready,
          translateReady: response.data.data.translate_ready,
          firestoreMode: response.data.data.firestore_mode,
          isChecking: false,
        });
      })
      .catch(() => {
        setState({
          isReachable: false,
          geminiReady: false,
          translateReady: false,
          firestoreMode: 'memory',
          isChecking: false,
        });
      });
  }, []);

  return state;
}
