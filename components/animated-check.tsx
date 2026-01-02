'use client';

import { useEffect, useRef } from 'react';
import { CheckIcon, CheckIconHandle } from './ui/check';

interface AnimatedCheckProps {
  className?: string;
  size?: number;
}

export function AnimatedCheck({ className, size = 12 }: AnimatedCheckProps) {
  const checkRef = useRef<CheckIconHandle>(null);

  useEffect(() => {
    // Trigger animation when component mounts
    checkRef.current?.startAnimation();
  }, []);

  return <CheckIcon ref={checkRef} className={className} size={size} />;
}
