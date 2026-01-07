import { WoopProvider } from '@/components/woop-provider';
import { headers } from 'next/headers';
import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { hashIP, encrypt, decrypt } from '@/lib/crypto';
import { WoopForm } from '@/components/woop-form';
import { WoopList } from '@/components/woop-list';
import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';
import { ShortcutHints } from '@/components/shortcut-hints';
import { deleteBlobs } from '@/lib/blob';
import type { WoopData, WoopItem, WoopFile } from '@/lib/types';

function processWoops(encryptedWoops: string[], ip: string): { woops: WoopItem[]; expiredEncrypted: string[]; expiredBlobUrls: string[] } {
  const now = Date.now();
  const woops: WoopItem[] = [];
  const expiredEncrypted: string[] = [];
  const expiredBlobUrls: string[] = [];

  for (const encrypted of encryptedWoops) {
    try {
      const decrypted = decrypt(encrypted, ip);
      try {
        const data: WoopData = JSON.parse(decrypted);
        if (data.expiresAt > now) {
          woops.push({
            text: data.text,
            encryptedValue: encrypted,
            expiresAt: data.expiresAt,
            file: data.file,
          });
        } else {
          expiredEncrypted.push(encrypted);
          if (data.file?.url) {
            expiredBlobUrls.push(data.file.url);
          }
        }
      } catch {
        // Legacy format without expiration - show for backwards compatibility
        woops.push({
          text: decrypted,
          encryptedValue: encrypted,
        });
      }
    } catch {
      // Skip messages that fail to decrypt
    }
  }

  return { woops, expiredEncrypted, expiredBlobUrls };
}

export default async function Home() {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const hashedIP = hashIP(ip);
  const encryptedWoops = await redis.lrange(hashedIP, 0, -1);

  // Process woops and filter expired ones
  const { woops, expiredEncrypted, expiredBlobUrls } = processWoops(encryptedWoops, ip);

  // Clean up expired messages and their blob files
  if (expiredEncrypted.length > 0) {
    const hashedKey = hashIP(ip);
    for (const encrypted of expiredEncrypted) {
      await redis.lrem(hashedKey, 1, encrypted);
    }
    // Delete expired blob files from Vercel Blob storage
    if (expiredBlobUrls.length > 0) {
      await deleteBlobs(expiredBlobUrls);
    }
  }

  async function addWoop(text: string, expirationMinutes: number = 10, file?: WoopFile) {
    'use server';
    if (!text.trim() && !file) return;
    const hashedKey = hashIP(ip);
    const woopData: WoopData = {
      text: text || (file ? file.name : ''),
      expiresAt: Date.now() + expirationMinutes * 60 * 1000,
      file,
    };
    const encryptedText = encrypt(JSON.stringify(woopData), ip);
    await redis.lpush(hashedKey, encryptedText);
    revalidatePath('/');
  }

  return (
    <WoopProvider addWoop={addWoop}>
      <div className='min-h-screen bg-gradient-subtle font-sans flex flex-col'>
        <header className='w-full border-b border-border/40 glass sticky top-0 z-50'>
          <div className='mx-auto max-w-4xl px-6 py-3'>
            <Header />
          </div>
        </header>
        <main id='main-content' className='mx-auto max-w-4xl px-6 py-6 flex-1 w-full overflow-auto'>
          {woops.length > 0 ? (
            <WoopList woops={woops} />
          ) : (
            <EmptyState />
          )}
        </main>
        <div className='w-full glass border-t border-border/40 pb-8 sticky bottom-0'>
          <div className='mx-auto max-w-4xl px-6 py-4 space-y-2'>
            <span className='text-xs text-muted-foreground'>Connected to <span className='font-mono'>{ip}</span></span>
            <WoopForm />
          </div>
        </div>
        <ShortcutHints />
      </div>
    </WoopProvider>
  );
}
