'use client';

import { Item, ItemContent } from './ui/item';

export function Woop({ woop }: { woop: string }) {
  return (
    <Item
      className='pointer-events-auto'
      onClick={() => navigator.clipboard.writeText(woop)}
      variant='outline'
      size='sm'
    >
      <ItemContent>{woop}</ItemContent>
    </Item>
  );
}
