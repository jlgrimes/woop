"use client";

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, PlusIconHandle } from './ui/plus';

export function AddButton() {
  const iconRef = useRef<PlusIconHandle>(null);

  return (
    <Button
      type='submit'
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <PlusIcon ref={iconRef} />
    </Button>
  );
}
