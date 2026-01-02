'use client';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

/**
 * Generate a deterministic scrambled version of text
 * Same input always produces same output
 */
function scrambleText(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ' || text[i] === '\n') {
      result += text[i];
    } else {
      // Use char code as seed for deterministic output
      const seed = text.charCodeAt(i) * (i + 1);
      result += chars[seed % chars.length];
    }
  }
  return result;
}

export function ScrambledText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const scrambled = scrambleText(children);

  return <span className={className}>{scrambled}</span>;
}
