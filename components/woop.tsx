'use client';

import { Item, ItemContent } from './ui/item';
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
      <ItemContent>{woop}</ItemContent>
    </Item>
  );
}
