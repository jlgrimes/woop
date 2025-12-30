import { Item, ItemGroup } from '@/components/ui/item';
import { Input } from '@/components/ui/input';
import { headers } from 'next/headers';
import { redis } from '@/lib/redis';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const woops = await redis.lrange(ip, 0, -1);

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex p-8 min-h-screen w-full max-w-3xl flex-col items-center justify-between sm:items-start'>
        <ItemGroup>
          {woops.map((woop, idx) => (
            <Item key={idx} className='cursor-pointer'>
              {woop}
            </Item>
          ))}
        </ItemGroup>
        <div>
          <form
            className='flex gap-2 w-full'
            action={async formData => {
              'use server';
              const woop = formData.get('woop');
              console.log(woop);
              if (!woop) return;
              await redis.lpush(ip, woop as string);
            }}
          >
            <Input
              name='woop'
              className='p-2'
              type='text'
              placeholder='Add a woop'
            />
            <Button type='submit'>Add woop</Button>
          </form>
          <h1 className='text-2xl font-bold'>{ip}</h1>
        </div>
      </main>
    </div>
  );
}
