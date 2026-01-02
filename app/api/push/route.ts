import { headers } from 'next/headers';
import { redis } from '@/lib/redis';
import { hashIP, encrypt } from '@/lib/crypto';

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export async function POST(request: Request) {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const body = await request.json();
  const msg = body.msg?.trim();

  if (!msg) {
    return new Response('missing msg', { status: 400 });
  }

  const hashedKey = hashIP(ip);
  const encryptedText = encrypt(msg, ip);
  await redis.lpush(hashedKey, encryptedText);
  await redis.expire(hashedKey, TTL_SECONDS);

  return new Response('ok');
}
