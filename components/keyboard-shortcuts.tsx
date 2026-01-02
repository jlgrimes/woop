"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcutsProps {
  children: React.ReactNode;
  onPaste: (text: string) => void;
}

export function KeyboardShortcuts({ children, onPaste }: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Handle Ctrl/Cmd + V
      if (isMod && e.key === "v") {
        // Don't intercept if focused on an input/textarea
        const active = document.activeElement;
        if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") {
          return;
        }

        e.preventDefault();
        try {
          const text = await navigator.clipboard.readText();
          if (text) {
            onPaste(text);
          }
        } catch {
          // Clipboard access denied
        }
      }
    },
    [onPaste]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return <>{children}</>;
}
