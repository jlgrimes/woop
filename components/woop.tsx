'use client';

import { Item, ItemContent, ItemActions } from './ui/item';
import { CornerDownLeft, Delete, MousePointerClick, MousePointer } from 'lucide-react';

export function Woop({
  woop,
  removeWoop,
}: {
  woop: string;
  removeWoop: (value: string) => Promise<void>;
}) {
  return (
    <Item
      className='pointer-events-auto'
      onClick={() => navigator.clipboard.writeText(woop)}
      onContextMenu={e => {
        e.preventDefault();
        removeWoop(woop);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          navigator.clipboard.writeText(woop);
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
      {/* Hover actions (mouse) */}
      <ItemActions className='opacity-0 group-hover/item:opacity-100 group-focus/item:opacity-0 transition-opacity duration-150 gap-3'>
        <div className='flex items-center gap-1 text-muted-foreground'>
          <span className='text-xs'>Copy</span>
          <kbd className='p-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700'>
            <MousePointerClick className='size-3' />
          </kbd>
        </div>
        <div className='flex items-center gap-1 text-muted-foreground'>
          <span className='text-xs'>Delete</span>
          <kbd className='p-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700'>
            <MousePointer className='size-3' />
          </kbd>
        </div>
      </ItemActions>
      {/* Focus actions (keyboard) */}
      <ItemActions className='opacity-0 group-focus/item:opacity-100 transition-opacity duration-150 gap-3'>
        <div className='flex items-center gap-1 text-muted-foreground'>
          <span className='text-xs'>Copy</span>
          <kbd className='p-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700'>
            <CornerDownLeft className='size-3' />
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
