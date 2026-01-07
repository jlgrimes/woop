'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';

export type ExpirationMinutes = 5 | 10 | 20;

interface ExpirationSelectorProps {
  value: ExpirationMinutes;
  onChange: (value: ExpirationMinutes) => void;
  disabled?: boolean;
}

export function ExpirationSelector({ value, onChange, disabled }: ExpirationSelectorProps) {
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => onChange(Number(v) as ExpirationMinutes)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[130px] h-full" aria-label="Message expiration time">
        <Clock className="h-4 w-4 opacity-50 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5 minutes</SelectItem>
        <SelectItem value="10">10 minutes</SelectItem>
        <SelectItem value="20">20 minutes</SelectItem>
      </SelectContent>
    </Select>
  );
}
