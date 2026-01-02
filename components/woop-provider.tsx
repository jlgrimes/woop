'use client';

import { createContext, useContext } from 'react';
import { KeyboardShortcuts } from './keyboard-shortcuts';

interface WoopContextValue {
  addWoop: (text: string, selfDestructing?: boolean) => Promise<void>;
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
  addWoop: (text: string, selfDestructing?: boolean) => Promise<void>;
}

export function WoopProvider({ children, addWoop }: WoopProviderProps) {
  return (
    <WoopContext.Provider value={{ addWoop }}>
      <KeyboardShortcuts onPaste={text => addWoop(text, false)}>
        {children}
      </KeyboardShortcuts>
    </WoopContext.Provider>
  );
}
