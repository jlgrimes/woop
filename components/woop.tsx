'use client';

import { useState } from 'react';
import { Item, ItemContent, ItemActions } from './ui/item';
import { CornerDownLeft, Delete, Check } from 'lucide-react';

export function Woop({
  woop,
  removeWoop,
}: {
  woop: string;
  removeWoop: (value: string) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(woop);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Item
      className='pointer-events-auto'
      onClick={onCopy}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onCopy();
        }
        if (e.key === 'Backspace') {
          removeWoop(woop);
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
