'use client';

export function Header({ ip }: { ip: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center">
        woop
      </h1>
      <h2 className="text-xl font-semibold text-muted-foreground font-mono">
        {ip}
      </h2>
    </div>
  );
}
