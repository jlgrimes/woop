'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';
import { Button } from './ui/button';

export function ShortcutHints() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has seen hints before
    const hasSeen = localStorage.getItem('shortcut-hints-seen');
    if (!hasSeen) {
      // Show hints after a short delay on first visit
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen for ? key to show hints
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setVisible(true);
        setDismissed(false);
      }
      if (e.key === 'Escape') {
        setVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('shortcut-hints-seen', 'true');
  };

  if (dismissed && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className='fixed bottom-24 right-6 glass rounded-xl p-4 text-sm max-w-xs z-40'
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className='flex items-start justify-between gap-2 mb-3'>
            <div className='flex items-center gap-2'>
              <Keyboard className='size-4 text-muted-foreground' />
              <h3 className='font-medium'>Keyboard Shortcuts</h3>
            </div>
            <Button
              variant='ghost'
              size='icon-sm'
              onClick={handleDismiss}
              aria-label='Dismiss'
              className='-mr-2 -mt-1'
            >
              <X className='size-4' />
            </Button>
          </div>
          <ul className='space-y-2 text-muted-foreground'>
            <li className='flex items-center justify-between gap-4'>
              <span>Quick paste</span>
              <kbd className='px-1.5 py-0.5 rounded bg-muted text-xs font-mono'>Ctrl+V</kbd>
            </li>
            <li className='flex items-center justify-between gap-4'>
              <span>Copy selected</span>
              <kbd className='px-1.5 py-0.5 rounded bg-muted text-xs font-mono'>Enter</kbd>
            </li>
            <li className='flex items-center justify-between gap-4'>
              <span>Navigate</span>
              <kbd className='px-1.5 py-0.5 rounded bg-muted text-xs font-mono'>Arrow keys</kbd>
            </li>
            <li className='flex items-center justify-between gap-4'>
              <span>Show shortcuts</span>
              <kbd className='px-1.5 py-0.5 rounded bg-muted text-xs font-mono'>?</kbd>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
