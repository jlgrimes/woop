'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Woop } from './woop';
import { staggerContainer, woopItemVariants } from '@/lib/animations';

interface WoopItem {
  kind: 'text' | 'image' | 'file';
  text: string;
  encryptedValue: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentSize?: number;
  expiresAt?: number;
}

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
              kind={woop.kind}
              text={woop.text}
              attachmentUrl={woop.attachmentUrl}
              attachmentName={woop.attachmentName}
              attachmentMimeType={woop.attachmentMimeType}
              attachmentSize={woop.attachmentSize}
              expiresAt={woop.expiresAt}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
