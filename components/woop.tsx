'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Item, ItemContent, ItemActions } from './ui/item';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { iconSwap } from '@/lib/animations';
import { triggerConfetti } from '@/lib/confetti';
import { ExpirationBadge } from './expiration-badge';

interface WoopProps {
  woop: string;
  encryptedValue: string;
  expiresAt?: number;
}

export function Woop({ woop, expiresAt }: WoopProps) {
  const [copied, setCopied] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const onCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(woop);
      setCopied(true);
      toast({ title: 'Copied to clipboard', variant: 'success', duration: 2000 });
      // Trigger confetti from button position
      if (e) {
        triggerConfetti({ x: e.clientX, y: e.clientY });
      }
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  return (
    <Item
      ref={itemRef}
      role='listitem'
      className='pointer-events-auto'
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onCopy();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = e.currentTarget.nextElementSibling as HTMLElement;
          next?.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = e.currentTarget.previousElementSibling as HTMLElement;
          prev?.focus();
        }
      }}
      variant='outline'
      size='sm'
      tabIndex={0}
    >
      <ItemContent className='whitespace-pre-wrap'>{woop}</ItemContent>
      <ItemActions className='gap-2'>
        {expiresAt && <ExpirationBadge expiresAt={expiresAt} />}
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
          <Button
            variant='ghost'
            size='icon-sm'
            onClick={onCopy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            className={copied ? 'text-green-600 dark:text-green-400' : ''}
          >
            <AnimatePresence mode='wait' initial={false}>
              {copied ? (
                <motion.div key='check' variants={iconSwap} initial='initial' animate='animate' exit='exit'>
                  <Check className='size-4' />
                </motion.div>
              ) : (
                <motion.div key='copy' variants={iconSwap} initial='initial' animate='animate' exit='exit'>
                  <Copy className='size-4' />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </ItemActions>
    </Item>
  );
}
