import { WoopProvider } from '@/components/woop-provider';
import { headers } from 'next/headers';
import { redis } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { hashIP, encrypt, decrypt } from '@/lib/crypto';
import { WoopForm } from '@/components/woop-form';
import { WoopList } from '@/components/woop-list';
import { EmptyState } from '@/components/empty-state';
import { Header } from '@/components/header';

export default async function Home() {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const hashedIP = hashIP(ip);
  const encryptedWoops = await redis.lrange(hashedIP, 0, -1);
  const woops = encryptedWoops.map(encrypted => ({
    text: decrypt(encrypted, ip),
    encryptedValue: encrypted,
  }));

  async function removeWoop(encryptedValue: string) {
    'use server';
    const hashedKey = hashIP(ip);
    await redis.lrem(hashedKey, 1, encryptedValue);
    revalidatePath('/');
  }

  async function addWoop(text: string) {
    'use server';
    if (!text.trim()) return;
    const hashedKey = hashIP(ip);
    const encryptedText = encrypt(text, ip);
    await redis.lpush(hashedKey, encryptedText);
    revalidatePath('/');
  }

  return (
    <WoopProvider addWoop={addWoop}>
      <div className='min-h-screen bg-zinc-50 font-sans dark:bg-black flex flex-col'>
        <header className='w-full border-b border-border/40 bg-zinc-50 dark:bg-black'>
          <div className='mx-auto max-w-4xl px-6 py-3'>
            <Header />
          </div>
        </header>
        <main className='mx-auto max-w-4xl px-6 py-6 flex-1 w-full overflow-auto'>
          {woops.length > 0 ? (
            <WoopList woops={woops} removeWoop={removeWoop} />
          ) : (
            <EmptyState />
          )}
        </main>
        <div className='w-full bg-zinc-50 dark:bg-black pb-8'>
          <div className='mx-auto max-w-4xl px-6 py-4 space-y-2'>
            <span className='text-xs text-muted-foreground'>Connected to <span className='font-mono'>{ip}</span></span>
            <WoopForm />
          </div>
        </div>
      </div>
    </WoopProvider>
  );
}
