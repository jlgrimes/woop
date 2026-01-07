'use client';

import { createContext, useContext, useState } from 'react';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { useToast } from '@/hooks/use-toast';
import type { ExpirationMinutes } from './expiration-selector';
import type { WoopFile } from '@/lib/types';

interface WoopContextValue {
  addWoop: (text: string, expirationMinutes?: number) => Promise<void>;
  addWoopWithFile: (file: File, text?: string) => Promise<void>;
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
  addWoop: (text: string, expirationMinutes?: number, file?: WoopFile) => Promise<void>;
}

export function WoopProvider({ children, addWoop }: WoopProviderProps) {
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

  const handleAddWoopWithFile = async (file: File, text?: string) => {
    setIsLoading(true);
    try {
      // Upload file to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const woopFile: WoopFile = await response.json();

      // Add woop with file reference
      await addWoop(text || file.name, expirationMinutes, woopFile);
      toast({ title: 'File wooped!', variant: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to upload file', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WoopContext.Provider value={{ addWoop: handleAddWoop, addWoopWithFile: handleAddWoopWithFile, expirationMinutes, setExpirationMinutes, isLoading }}>
      <KeyboardShortcuts onPaste={text => handleAddWoop(text)}>
        {children}
      </KeyboardShortcuts>
    </WoopContext.Provider>
  );
}
