'use client';

import { createContext, useContext, useState } from 'react';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { useToast } from '@/hooks/use-toast';
import type { ExpirationMinutes } from './expiration-selector';

interface WoopContextValue {
  addWoop: (text: string, expirationMinutes?: number) => Promise<void>;
  addWoopFromFormData: (formData: FormData) => Promise<void>;
  expirationMinutes: ExpirationMinutes;
  setExpirationMinutes: (minutes: ExpirationMinutes) => void;
  isLoading: boolean;
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
  addWoopFromFormData: (formData: FormData) => Promise<void>;
}

export function WoopProvider({ children, addWoop, addWoopFromFormData }: WoopProviderProps) {
  const [expirationMinutes, setExpirationMinutes] = useState<ExpirationMinutes>(10);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddWoop = async (text: string, expMinutes?: number) => {
    setIsLoading(true);
    try {
      await addWoop(text, expMinutes ?? expirationMinutes);
      toast({ title: 'Woop added', variant: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to add woop', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWoopFromFormData = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addWoopFromFormData(formData);
      toast({ title: 'Woop added', variant: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to add woop', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WoopContext.Provider
      value={{
        addWoop: handleAddWoop,
        addWoopFromFormData: handleAddWoopFromFormData,
        expirationMinutes,
        setExpirationMinutes,
        isLoading,
      }}
    >
      <KeyboardShortcuts onPaste={text => handleAddWoop(text)}>
        {children}
      </KeyboardShortcuts>
    </WoopContext.Provider>
  );
}
