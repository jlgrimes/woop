'use client';

import { useState, useRef } from 'react';
import { Item, ItemContent, ItemActions } from './ui/item';
import { ShieldAlert } from 'lucide-react';
import { AnimatedCheck } from './animated-check';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';

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
  const itemRef = useRef<HTMLDivElement>(null);

  const onCopy = () => {
    navigator.clipboard.writeText(woop);
    setCopied(true);

    if (selfDestructing) {
      removeWoop(encryptedValue);
    } else {
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const onDelete = () => {
    const next = itemRef.current?.nextElementSibling as HTMLElement;
    const prev = itemRef.current?.previousElementSibling as HTMLElement;
    removeWoop(encryptedValue);
    (next ?? prev)?.focus();
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Item
            ref={itemRef}
            className={`pointer-events-auto ${selfDestructing ? 'border-orange-300 dark:border-orange-700' : ''}`}
            onClick={onCopy}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onCopy();
              }
            }}
            variant='outline'
            size='sm'
            tabIndex={0}
          >
            <ItemContent className='whitespace-pre-wrap'>
              {woop}
            </ItemContent>
            <ItemActions className='opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 gap-3'>
              {selfDestructing && (
                <div className='flex items-center gap-1 text-orange-500'>
                  <ShieldAlert className='size-3' />
                </div>
              )}
              <div className='flex items-center gap-1'>
                <span
                  className={`text-xs transition-colors duration-150 ${
                    copied
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {copied ? 'Copied!' : 'Click to copy'}
                </span>
                {copied && (
                  <AnimatedCheck className='text-green-600 dark:text-green-400' size={12} />
                )}
              </div>
            </ItemActions>
          </Item>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
