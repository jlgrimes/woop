'use client';

import { Item, ItemContent, ItemTitle } from './ui/item';

export function Woop({ woop }: { woop: string }) {
  return (
    <Item
      className='pointer-events-auto'
      onClick={() => navigator.clipboard.writeText(woop)}
      variant='outline'
      size='sm'
    >
      <ItemContent>
        <ItemTitle>{woop}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
