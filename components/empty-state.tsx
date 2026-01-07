'use client';

import { motion } from 'motion/react';
import { Clipboard } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      className="text-sm space-y-6 text-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mx-auto w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Clipboard className="size-9 text-muted-foreground/60" />
      </motion.div>

      <div className="space-y-2">
        <motion.h2
          className="text-lg font-semibold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to woop
        </motion.h2>
        <motion.p
          className="text-muted-foreground max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your cross-device clipboard, instantly synced and securely encrypted.
        </motion.p>
      </div>

      <motion.p
        className="text-xs text-muted-foreground/70"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Type below or press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Ctrl+V</kbd> to get started
      </motion.p>
    </motion.div>
  );
}
