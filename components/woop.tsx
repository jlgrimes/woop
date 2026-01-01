'use client';

import { useState, useRef } from 'react';
import { Item, ItemContent, ItemActions } from './ui/item';
import { CornerDownLeft, Delete, Check } from 'lucide-react';

export function Woop({
  woop,
  encryptedValue,
  removeWoop,
}: {
  woop: string;
  encryptedValue: string;
  removeWoop: (encryptedValue: string) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const onCopy = () => {
    navigator.clipboard.writeText(woop);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onDelete = () => {
    const next = itemRef.current?.nextElementSibling as HTMLElement;
    const prev = itemRef.current?.previousElementSibling as HTMLElement;
    setDeleting(true);
    removeWoop(encryptedValue);
    (next ?? prev)?.focus();
  };

  return (
    <Item
      ref={itemRef}
      className={`pointer-events-auto transition-all duration-75 ${
        deleting ? 'opacity-0 scale-95' : ''
      }`}
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
          const next = (e.currentTarget.nextElementSibling as HTMLElement);
          next?.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (e.currentTarget.previousElementSibling as HTMLElement);
          prev?.focus();
        }
      }}
      variant='outline'
      size='sm'
      tabIndex={0}
    >
      <ItemContent className='whitespace-pre-wrap'>{woop}</ItemContent>
      <ItemActions className='opacity-0 group-hover/item:opacity-100 group-focus/item:opacity-100 transition-opacity duration-150 gap-3'>
        <div className='flex items-center gap-1 text-muted-foreground'>
          <span className={`text-xs transition-colors duration-150 ${copied ? 'text-green-600 dark:text-green-400' : ''}`}>
            {copied ? 'Copied!' : 'Copy'}
          </span>
          <kbd className={`p-1 rounded border transition-colors duration-150 ${
            copied
              ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
          }`}>
            {copied ? (
              <Check className='size-3 text-green-600 dark:text-green-400' />
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
  );
}
