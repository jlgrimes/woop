'use client';

import { useState, useRef } from 'react';
import { Item, ItemContent, ItemActions } from './ui/item';
import { CornerDownLeft, Delete, ShieldAlert } from 'lucide-react';
import { AnimatedCheck } from './animated-check';
import { DisintegrationEffect } from './particle-explosion';

export function Woop({
  woop,
  encryptedValue,
  selfDestructing = false,
  removeWoop,
}: {
  woop: string;
  encryptedValue: string;
  selfDestructing?: boolean;
  removeWoop: (encryptedValue: string) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [disintegrating, setDisintegrating] = useState(false);
  const [disintegrateRect, setDisintegrateRect] = useState<DOMRect | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const onCopy = () => {
    navigator.clipboard.writeText(woop);
    setCopied(true);

    if (selfDestructing && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setDisintegrateRect(rect);
      setDisintegrating(true);
      // Hide original immediately
      itemRef.current.style.opacity = '0';
    } else {
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDisintegrationComplete = () => {
    const next = itemRef.current?.nextElementSibling as HTMLElement;
    const prev = itemRef.current?.previousElementSibling as HTMLElement;
    removeWoop(encryptedValue);
    (next ?? prev)?.focus();
  };

  const onDelete = () => {
    const next = itemRef.current?.nextElementSibling as HTMLElement;
    const prev = itemRef.current?.previousElementSibling as HTMLElement;
    setDeleting(true);
    removeWoop(encryptedValue);
    (next ?? prev)?.focus();
  };

  // Generate blur dots for self-destructing woops
  const blurredContent = selfDestructing
    ? woop.replace(/./g, '•')
    : woop;

  return (
    <>
      {disintegrating && disintegrateRect && (
        <DisintegrationEffect
          rect={disintegrateRect}
          onComplete={handleDisintegrationComplete}
        />
      )}
      <Item
        ref={itemRef}
        className={`pointer-events-auto transition-all duration-75 ${
          deleting ? 'opacity-0 scale-95' : ''
        } ${selfDestructing ? 'border-orange-300 dark:border-orange-700' : ''}`}
      onClick={onCopy}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onCopy();
        }
        if (e.key === 'Backspace') {
          onDelete();
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
      <ItemContent className={`whitespace-pre-wrap ${selfDestructing ? 'blur-sm hover:blur-none transition-all duration-200' : ''}`}>
        {blurredContent}
      </ItemContent>
      <ItemActions className='opacity-0 group-hover/item:opacity-100 group-focus/item:opacity-100 transition-opacity duration-150 gap-3'>
        {selfDestructing && (
          <div className='flex items-center gap-1 text-orange-500'>
            <ShieldAlert className='size-3' />
          </div>
        )}
        <div className='flex items-center gap-1 text-muted-foreground'>
          <span
            className={`text-xs transition-colors duration-150 ${copied ? 'text-green-600 dark:text-green-400' : ''}`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </span>
          <kbd
            className={`p-1 rounded border transition-colors duration-150 ${
              copied
                ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {copied ? (
              <AnimatedCheck className='text-green-600 dark:text-green-400' size={12} />
            ) : (
              <CornerDownLeft className='size-3' />
            )}
          </kbd>
        </div>
        <div className='flex items-center gap-1 text-muted-foreground'>
          <span className='text-xs'>Delete</span>
          <kbd className='p-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700'>
            <Delete className='size-3' />
          </kbd>
        </div>
      </ItemActions>
      </Item>
    </>
  );
}
