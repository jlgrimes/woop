'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Item, ItemContent, ItemActions } from './ui/item';
import { Copy, Check, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { iconSwap } from '@/lib/animations';
import { triggerConfetti } from '@/lib/confetti';
import { ExpirationBadge } from './expiration-badge';

interface WoopProps {
  kind: 'text' | 'image' | 'file';
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentSize?: number;
  expiresAt?: number;
}

function formatFileSize(size?: number) {
  if (!size || Number.isNaN(size)) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function Woop({
  kind,
  text,
  attachmentUrl,
  attachmentName,
  attachmentMimeType,
  attachmentSize,
  expiresAt,
}: WoopProps) {
  const [copied, setCopied] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isImage = kind === 'image';
  const hasAttachment = kind === 'image' || kind === 'file';
  const copyPayload = hasAttachment && attachmentUrl ? attachmentUrl : text;

  const onCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(copyPayload);
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
          // Find all items in the list and navigate to the next one
          const allItems = document.querySelectorAll('[data-slot="item"]');
          const currentIndex = Array.from(allItems).indexOf(e.currentTarget);
          const nextItem = allItems[currentIndex + 1] as HTMLElement;
          nextItem?.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          // Find all items in the list and navigate to the previous one
          const allItems = document.querySelectorAll('[data-slot="item"]');
          const currentIndex = Array.from(allItems).indexOf(e.currentTarget);
          const prevItem = allItems[currentIndex - 1] as HTMLElement;
          prevItem?.focus();
        }
      }}
      variant='outline'
      size='sm'
      tabIndex={0}
    >
      <ItemContent className='space-y-2 w-full'>
        <p className='whitespace-pre-wrap'>{text}</p>
        {hasAttachment && attachmentUrl && (
          isImage ? (
            <img
              src={attachmentUrl}
              alt={attachmentName || 'Shared image'}
              className='max-h-64 max-w-full rounded-md border border-border/80 bg-muted'
            />
          ) : (
            <a
              href={attachmentUrl}
              target='_blank'
              rel='noreferrer'
              className='text-xs text-muted-foreground underline underline-offset-2 break-all'
            >
              {attachmentName || 'Download attachment'}
            </a>
          )
        )}
        {hasAttachment && (attachmentName || attachmentMimeType || attachmentSize !== undefined) && (
          <p className='text-xs text-muted-foreground'>
            {attachmentName ? attachmentName : 'Attachment'}
            {attachmentMimeType ? ` • ${attachmentMimeType}` : ''}
            {attachmentSize ? ` • ${formatFileSize(attachmentSize)}` : ''}
          </p>
        )}
      </ItemContent>
      <ItemActions className='gap-2'>
        {expiresAt && <ExpirationBadge expiresAt={expiresAt} />}
        {hasAttachment && attachmentUrl && (
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
            <Button
              asChild
              variant='ghost'
              size='icon-sm'
              aria-label={isImage ? 'Open image' : 'Download attachment'}
            >
              <a
                href={attachmentUrl}
                target='_blank'
                rel='noreferrer'
                download={isImage ? undefined : attachmentName}
              >
                {isImage ? <ImageIcon className='size-4' /> : <FileText className='size-4' />}
              </a>
            </Button>
          </motion.div>
        )}
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
