import { Item, ItemGroup } from '@/components/ui/item';
import { headers } from 'next/headers';
import { redis } from '@/lib/redis';

export default async function Home() {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const woops = await redis.lrange(ip, 0, -1);
  console.log(woops);

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex p-8 min-h-screen w-full max-w-3xl flex-col items-center justify-between sm:items-start'>
        <div>
          <ItemGroup>
            {woops.map((woop, idx) => (
              <Item key={idx}>{woop}</Item>
            ))}
          </ItemGroup>
        </div>
        <h1 className='text-2xl font-bold'>{ip}</h1>
      </main>
    </div>
  );
}
