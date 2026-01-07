"use client";

import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { PlusIcon, PlusIconHandle } from './ui/plus';
import { Spinner } from './ui/spinner';
import { useWoop } from './woop-provider';

export function AddButton() {
  const iconRef = useRef<PlusIconHandle>(null);
  const { isLoading } = useWoop();

  return (
    <Button
      type='submit'
      disabled={isLoading}
      aria-label={isLoading ? 'Adding woop...' : 'Add woop'}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <AnimatePresence mode='wait' initial={false}>
        {isLoading ? (
          <motion.div
            key='spinner'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Spinner />
          </motion.div>
        ) : (
          <motion.div
            key='plus'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <PlusIcon ref={iconRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
