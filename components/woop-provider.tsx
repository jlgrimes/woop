'use client';

import { createContext, useContext, useState } from 'react';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import type { ExpirationMinutes } from './expiration-selector';

interface WoopContextValue {
  addWoop: (text: string, expirationMinutes?: number) => Promise<void>;
  expirationMinutes: ExpirationMinutes;
  setExpirationMinutes: (minutes: ExpirationMinutes) => void;
}

const WoopContext = createContext<WoopContextValue | null>(null);

export function useWoop() {
  const context = useContext(WoopContext);
  if (!context) {
    throw new Error('useWoop must be used within a WoopProvider');
  }
  return context;
}

interface WoopProviderProps {
  children: React.ReactNode;
  addWoop: (text: string, expirationMinutes?: number) => Promise<void>;
}

export function WoopProvider({ children, addWoop }: WoopProviderProps) {
  const [expirationMinutes, setExpirationMinutes] = useState<ExpirationMinutes>(10);

  const handleAddWoop = async (text: string, expMinutes?: number) => {
    await addWoop(text, expMinutes ?? expirationMinutes);
  };

  return (
    <WoopContext.Provider value={{ addWoop: handleAddWoop, expirationMinutes, setExpirationMinutes }}>
      <KeyboardShortcuts onPaste={text => handleAddWoop(text)}>
        {children}
      </KeyboardShortcuts>
    </WoopContext.Provider>
  );
}
