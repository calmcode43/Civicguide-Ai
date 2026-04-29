/**
 * Polls the backend health endpoint on mount.
 * Used to show a degraded-mode warning if the backend is unreachable.
 */
import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { AxiosResponse } from 'axios';

interface BackendHealth {
  isReachable: boolean;
  ragReady: boolean;
  isChecking: boolean;
}

export function useApiHealth(): BackendHealth {
  const [state, setState] = useState<BackendHealth>({
    isReachable: true,
    ragReady: false,
    isChecking: true,
  });

  useEffect(() => {
    apiClient
      .get('/api/health')
      .then((res: AxiosResponse) => {
        setState({
          isReachable: true,
          ragReady: res.data?.data?.rag_ready ?? false,
          isChecking: false,
        });
      })
      .catch(() => {
        setState({ isReachable: false, ragReady: false, isChecking: false });
      });
  }, []);

  return state;
}
