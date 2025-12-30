// lib/redis.ts
import Redis from 'ioredis';

declare global {
  // Add redis to the globalThis type
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

export const redis = globalThis.redis ?? new Redis(process.env.REDIS_URL!);

if (process.env.NODE_ENV !== 'production') {
  globalThis.redis = redis;
}
