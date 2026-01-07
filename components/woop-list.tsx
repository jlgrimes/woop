'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Woop } from './woop';
import { staggerContainer, woopItemVariants } from '@/lib/animations';
import type { WoopItem } from '@/lib/types';

interface WoopListProps {
  woops: WoopItem[];
}

export function WoopList({ woops }: WoopListProps) {
  return (
    <motion.div
      className="flex flex-col gap-2"
      role="list"
      aria-label="Clipboard items"
      aria-live="polite"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence mode="popLayout">
        {woops.map((woop) => (
          <motion.div
            key={woop.encryptedValue}
            variants={woopItemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
          >
            <Woop
              woop={woop.text}
              encryptedValue={woop.encryptedValue}
              expiresAt={woop.expiresAt}
              file={woop.file}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
