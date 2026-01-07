'use client';

import { useState, useRef } from 'react';
import { Item, ItemContent, ItemActions } from './ui/item';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

export function Woop({
  woop,
}: {
  woop: string;
  encryptedValue: string;
}) {
  const [copied, setCopied] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const onCopy = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(woop);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Item
      ref={itemRef}
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
      <ItemActions className='gap-1'>
        <Button
          variant='ghost'
          size='icon-sm'
          onClick={onCopy}
          className={copied ? 'text-green-600 dark:text-green-400' : ''}
        >
          {copied ? <Check className='size-4' /> : <Copy className='size-4' />}
        </Button>
      </ItemActions>
    </Item>
  );
}
