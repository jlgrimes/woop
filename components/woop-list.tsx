'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Woop } from './woop';

interface WoopItem {
  text: string;
  encryptedValue: string;
  selfDestructing: boolean;
}

interface WoopListProps {
  woops: WoopItem[];
  removeWoop: (encryptedValue: string) => Promise<void>;
}

export function WoopList({ woops, removeWoop }: WoopListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2" role="list">
      <AnimatePresence mode="popLayout">
        {woops.map((woop, idx) => (
          <motion.div
            key={woop.encryptedValue}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{
              layout: { duration: 0.3 },
              opacity: { duration: 0.2 },
              y: { duration: 0.3, ease: 'easeOut' },
              x: { duration: 0.3, ease: 'easeIn' },
              scale: { duration: 0.2 },
            }}
            className="relative"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Sliding hover background */}
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-zinc-100 dark:bg-zinc-800/80 block rounded-lg -z-10"
                  layoutId="woopHoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.1 },
                  }}
                />
              )}
            </AnimatePresence>
            <Woop
              woop={woop.text}
              encryptedValue={woop.encryptedValue}
              selfDestructing={woop.selfDestructing}
              removeWoop={removeWoop}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
