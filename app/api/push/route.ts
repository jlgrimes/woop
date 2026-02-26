import { redis } from '@/lib/redis';
import { hashIP, encrypt } from '@/lib/crypto';
import { headers } from 'next/headers';

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const DEFAULT_EXPIRATION_MINUTES = 10;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB
const FORM_DATA_TYPE = 'multipart/form-data';
const JSON_CONTENT_TYPE = 'application/json';

interface WoopData {
  text: string;
  expiresAt: number;
  type?: 'text' | 'image' | 'file';
  attachment?: {
    name: string;
    mimeType: string;
    size: number;
    url: string;
  };
}

function getExpirationMinutes(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_EXPIRATION_MINUTES;
  return Math.max(1, Math.round(parsed));
}

async function buildAttachmentPayload(file: File): Promise<WoopData['attachment']> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error('File too large');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || 'application/octet-stream';
  const name = file.name || 'attachment';
  const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

  return {
    name,
    mimeType,
    size: file.size,
    url: dataUrl,
  };
}

export async function POST(request: Request) {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const contentType = request.headers.get('content-type') ?? '';
  let text = '';
  let expirationMinutes = DEFAULT_EXPIRATION_MINUTES;
  let attachmentPayload: WoopData['attachment'] | undefined;
  let type: WoopData['type'] = 'text';

  if (contentType.includes(FORM_DATA_TYPE)) {
    const formData = await request.formData();
    const rawText = formData.get('woop') ?? formData.get('msg');
    text = typeof rawText === 'string' ? rawText.trim() : '';
    expirationMinutes = getExpirationMinutes(formData.get('expirationMinutes'));
    const file = formData.get('attachment');

    if (file instanceof File && file.size > 0) {
      const mimeType = file.type || 'application/octet-stream';
      const isImage = mimeType.startsWith('image/');
      try {
        attachmentPayload = await buildAttachmentPayload(file);
      } catch {
        return new Response('attachment too large', { status: 413 });
      }
      type = isImage ? 'image' : 'file';
      if (!text) {
        text = `${isImage ? 'Image' : 'File'}: ${file.name || 'attachment'}`;
      }
    }
  } else {
    if (contentType.includes(JSON_CONTENT_TYPE)) {
      const body = await request.json();
      text = body.msg?.trim() ?? '';
      expirationMinutes = getExpirationMinutes(body.expirationMinutes);
    } else {
      const formData = await request.formData();
      const rawText = formData.get('woop') ?? formData.get('msg');
      text = typeof rawText === 'string' ? rawText.trim() : '';
      const file = formData.get('attachment');

      if (file instanceof File && file.size > 0) {
        const mimeType = file.type || 'application/octet-stream';
        const isImage = mimeType.startsWith('image/');
        try {
          attachmentPayload = await buildAttachmentPayload(file);
        } catch {
          return new Response('attachment too large', { status: 413 });
        }
        type = isImage ? 'image' : 'file';
        if (!text) {
          text = `${isImage ? 'Image' : 'File'}: ${file.name || 'attachment'}`;
        }
      }
    }
  }

  if (!text && !attachmentPayload) {
    return new Response('missing msg', { status: 400 });
  }

  const expiresAt = Date.now() + expirationMinutes * 60 * 1000;
  const woopData: WoopData = {
    text,
    expiresAt,
    ...(type !== 'text' && attachmentPayload
      ? { type, attachment: attachmentPayload }
      : undefined),
  };

  const hashedKey = hashIP(ip);
  const encryptedText = encrypt(JSON.stringify(woopData), ip);
  await redis.lpush(hashedKey, encryptedText);
  await redis.expire(hashedKey, TTL_SECONDS);

  return new Response('ok');
}
