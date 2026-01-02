/**
 * Calculate Shannon entropy of a string (bits per character)
 * Higher entropy = more random/unpredictable
 */
export function calculateEntropy(str: string): number {
  if (!str || str.length === 0) return 0;

  const freq: Record<string, number> = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropy = 0;
  const len = str.length;
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Detect if a string looks like a randomly generated secret
 * (API key, password, encryption key, etc.)
 */
export function isHighEntropy(str: string): boolean {
  const trimmed = str.trim();

  // Too short to be a meaningful secret
  if (trimmed.length < 8) return false;

  // If it has spaces/newlines, it's probably not a random string
  if (/\s/.test(trimmed)) return false;

  const entropy = calculateEntropy(trimmed);

  // Threshold: ~3.5+ bits per char suggests randomness
  // For reference:
  // - "password" has ~2.75 entropy
  // - "aB3$xK9!mN2@pL5" has ~3.9 entropy
  // - Base64 strings typically have 5-6 entropy
  return entropy >= 3.5;
}
