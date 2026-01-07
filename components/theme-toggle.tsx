'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '@/hooks/use-theme';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    if (theme === 'system') return Monitor;
    return resolvedTheme === 'dark' ? Moon : Sun;
  };

  const Icon = getIcon();

  return (
    <Button
      variant='ghost'
      size='icon-sm'
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Icon className='size-4' />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
