'use client';

import { FlipWords } from './ui/flip-words';

export function Header({ ip }: { ip: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center">
        <FlipWords words={['woop']} once className="px-0" />
      </h1>
      <h2 className="text-xl font-semibold text-muted-foreground font-mono">
        {ip}
      </h2>
    </div>
  );
}
