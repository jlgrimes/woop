"use client";

import { useEffect, useState, useCallback } from "react";

interface KeyboardShortcutsProps {
  children: React.ReactNode;
  onPaste: (text: string) => void;
}

const shortcuts = [
  { key: "V", description: "Paste & add woop" },
];

export function KeyboardShortcuts({ children, onPaste }: KeyboardShortcutsProps) {
  const [modifierHeld, setModifierHeld] = useState(false);

  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Track modifier being held (but not if just pressed for a shortcut)
      if ((e.key === "Control" || e.key === "Meta") && !modifierHeld) {
        setModifierHeld(true);
      }

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
    [modifierHeld, onPaste]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") {
      setModifierHeld(false);
    }
  }, []);

  // Also hide on blur (user switches window)
  const handleBlur = useCallback(() => {
    setModifierHeld(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  return (
    <>
      {/* Command overlay */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-transform duration-150 ${
          modifierHeld ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-b-lg shadow-lg flex gap-6 text-sm font-mono">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <kbd className="bg-zinc-700 dark:bg-zinc-300 px-1.5 py-0.5 rounded text-xs">
                {s.key}
              </kbd>
              <span className="text-zinc-400 dark:text-zinc-600">{s.description}</span>
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  );
}
