'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ShieldAlert } from 'lucide-react';

interface AddButtonProps {
  onAddSensitive: () => void;
}

export function AddButton({ onAddSensitive }: AddButtonProps) {
  return (
    <div className='flex'>
      <Button type='submit' className='rounded-r-none'>
        Add
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type='button' className='rounded-l-none border-l-0 px-2'>
            <ChevronDown className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={onAddSensitive}>
            <ShieldAlert className='mr-2 h-4 w-4' />
            Add sensitive woop
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
