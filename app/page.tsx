import { ItemGroup } from '@/components/ui/item';
import { Input } from '@/components/ui/input';
import { headers } from 'next/headers';
import { redis } from '@/lib/redis';
import { Button } from '@/components/ui/button';
import { Woop } from '@/components/woop';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const woops = await redis.lrange(ip, 0, -1);

  async function removeWoop(value: string) {
    'use server';
    await redis.lrem(ip, 1, value);
    revalidatePath('/');
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex p-8 min-h-screen w-full max-w-3xl flex-col items-center justify-between sm:items-start'>
        <div className='w-full flex flex-col gap-2'>
          <div>
            <h1 className='text-2xl font-bold'>woop.foo</h1>
            <h2 className='text-xl font-semibold text-muted-foreground font-mono'>
              {ip}
            </h2>
          </div>
          <ItemGroup className='gap-2'>
            {woops.map((woop, idx) => (
              <Woop key={idx} woop={woop} removeWoop={removeWoop} />
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
        <div className='w-full'>
          <form
            className='flex gap-2 w-full'
            action={async formData => {
              'use server';
              const woop = formData.get('woop');
              if (!woop) return;
              await redis.lpush(ip, woop as string);
              revalidatePath('/');
            }}
          >
            <Input name='woop' placeholder='Add a woop' />
            <Button type='submit'>Add</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
