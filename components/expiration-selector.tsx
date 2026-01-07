'use client';

import { Clock, ChevronDown } from 'lucide-react';

export type ExpirationMinutes = 5 | 10 | 20;

interface ExpirationSelectorProps {
  value: ExpirationMinutes;
  onChange: (value: ExpirationMinutes) => void;
  disabled?: boolean;
}

export function ExpirationSelector({ value, onChange, disabled }: ExpirationSelectorProps) {
  return (
    <div className="relative inline-flex items-center">
      <Clock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as ExpirationMinutes)}
        disabled={disabled}
        aria-label="Message expiration time"
        className="h-9 w-[120px] pl-9 pr-8 rounded-md border border-input bg-background text-sm font-medium appearance-none cursor-pointer transition-colors hover:bg-accent hover:border-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
      >
        <option value={5}>5 min</option>
        <option value={10}>10 min</option>
        <option value={20}>20 min</option>
      </select>
      <ChevronDown className="absolute right-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
