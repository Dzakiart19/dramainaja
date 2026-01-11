import { useMemo } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { PlatformAPI } from '../api/platform-api';

export const useApi = () => {
  const { currentPlatform } = usePlatform();
  
  const api = useMemo(() => {
    return new PlatformAPI(currentPlatform);
  }, [currentPlatform]);

  return api;
};
