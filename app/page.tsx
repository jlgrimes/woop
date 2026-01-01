import { ItemGroup } from '@/components/ui/item';
import { WoopInput } from '@/components/woop-input';
import { WoopProvider } from '@/components/woop-provider';
import { headers } from 'next/headers';
import { redis } from '@/lib/redis';
import { Button } from '@/components/ui/button';
import { Woop } from '@/components/woop';
import { revalidatePath } from 'next/cache';
import { hashIP, encrypt, decrypt } from '@/lib/crypto';

export default async function Home() {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const hashedIP = hashIP(ip);
  const encryptedWoops = await redis.lrange(hashedIP, 0, -1);
  // Create tuples of [decrypted, encrypted] so we can display text but delete by encrypted value
  const woops = encryptedWoops.map(encrypted => ({
    text: decrypt(encrypted, ip),
    encryptedValue: encrypted,
  }));

  async function removeWoop(encryptedValue: string) {
    'use server';
    const hashedKey = hashIP(ip);
    // Use the original encrypted value for deletion (matches exactly in Redis)
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
      <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
        <main className='flex p-8 min-h-screen w-full max-w-3xl flex-col items-center justify-between sm:items-start'>
          <div className='w-full flex flex-col gap-2'>
            <div>
              <h1 className='text-2xl font-bold'>woop.foo</h1>
              <h2 className='text-xl font-semibold text-muted-foreground font-mono'>
                {ip}
              </h2>
            </div>
            <form
              className='flex gap-2 w-full'
              action={async formData => {
                'use server';
                const woop = formData.get('woop');
                if (!woop) return;
                const hashedKey = hashIP(ip);
                const encryptedText = encrypt(woop as string, ip);
                await redis.lpush(hashedKey, encryptedText);
                revalidatePath('/');
              }}
            >
              <WoopInput />
              <Button type='submit'>Add</Button>
            </form>
            <ItemGroup className='gap-2'>
              {woops.map((woop, idx) => (
                <Woop
                  key={`${woop.encryptedValue}-${idx}`}
                  woop={woop.text}
                  encryptedValue={woop.encryptedValue}
                  removeWoop={removeWoop}
                />
              ))}
            </ItemGroup>
            {woops.length === 0 && (
              <div className='text-sm text-muted-foreground'>
                <p>You have no woops.</p>
                <p>
                  Access woops of text from your devices on this network. Try it
                  out!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </WoopProvider>
  );
}
