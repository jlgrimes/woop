"use client";

import { KeyboardShortcuts } from "./keyboard-shortcuts";

interface WoopProviderProps {
  children: React.ReactNode;
  addWoop: (text: string) => Promise<void>;
}

export function WoopProvider({ children, addWoop }: WoopProviderProps) {
  return (
    <KeyboardShortcuts onPaste={addWoop}>
      {children}
    </KeyboardShortcuts>
  );
}
