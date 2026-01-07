import { headers } from 'next/headers';
import { redis } from '@/lib/redis';
import { hashIP, encrypt } from '@/lib/crypto';
import type { WoopData } from '@/lib/types';

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const DEFAULT_EXPIRATION_MINUTES = 10;

export async function POST(request: Request) {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const body = await request.json();
  const msg = body.msg?.trim();
  const expirationMinutes = body.expirationMinutes ?? DEFAULT_EXPIRATION_MINUTES;

  if (!msg) {
    return new Response('missing msg', { status: 400 });
  }

  const woopData: WoopData = {
    text: msg,
    expiresAt: Date.now() + expirationMinutes * 60 * 1000,
  };

  const hashedKey = hashIP(ip);
  const encryptedText = encrypt(JSON.stringify(woopData), ip);
  await redis.lpush(hashedKey, encryptedText);
  await redis.expire(hashedKey, TTL_SECONDS);

  return new Response('ok');
}
