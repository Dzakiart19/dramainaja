import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlatformConfig, PlatformId } from '../types';
import { PLATFORMS, getPlatformById } from '../config/platforms';

interface PlatformContextType {
  currentPlatform: PlatformConfig;
  setPlatform: (id: PlatformId) => void;
  platforms: typeof PLATFORMS;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const STORAGE_KEY = 'dramain_platform';

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlatform, setCurrentPlatform] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as PlatformId | null;
    return saved ? getPlatformById(saved) : PLATFORMS.radreel;
  });

  const setPlatform = (id: PlatformId) => {
    const platform = getPlatformById(id);
    setCurrentPlatform(platform);
    localStorage.setItem(STORAGE_KEY, id);
  };

  useEffect(() => {
    // Update CSS custom property for dynamic theming
    document.documentElement.style.setProperty('--accent', currentPlatform.color.replace('hsl(', '').replace(')', ''));
  }, [currentPlatform]);

  return (
    <PlatformContext.Provider value={{ currentPlatform, setPlatform, platforms: PLATFORMS }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
