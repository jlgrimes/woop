'use client';

import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountdown } from '@/hooks/use-countdown';

interface ExpirationBadgeProps {
  expiresAt: number;
}

export function ExpirationBadge({ expiresAt }: ExpirationBadgeProps) {
  const { minutes, seconds, isExpiring, isUrgent, isExpired } = useCountdown(expiresAt);

  if (isExpired) return null;

  return (
    <motion.div
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors',
        isUrgent
          ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
          : isExpiring
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
            : 'bg-muted text-muted-foreground'
      )}
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
    >
      <Clock className='size-3' />
      <span className='tabular-nums'>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </motion.div>
  );
}
