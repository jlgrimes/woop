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

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const DEFAULT_EXPIRATION_MINUTES = 10;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB
type WoopType = 'text' | 'image' | 'file';

interface WoopAttachment {
  name: string;
  mimeType: string;
  size: number;
  url: string;
}

interface WoopData {
  text: string;
  expiresAt: number;
  type?: WoopType;
  attachment?: WoopAttachment;
}

interface WoopItem {
  kind: WoopType;
  text: string;
  encryptedValue: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachmentSize?: number;
  expiresAt?: number;
}

function processWoops(encryptedWoops: string[], ip: string): { woops: WoopItem[]; expiredEncrypted: string[] } {
  const now = Date.now();
  const woops: WoopItem[] = [];
  const expiredEncrypted: string[] = [];

  for (const encrypted of encryptedWoops) {
    try {
      const decrypted = decrypt(encrypted, ip);
      try {
        const data: WoopData = JSON.parse(decrypted);
        if (typeof data.expiresAt === 'number' && data.expiresAt > now) {
          if ((data.type === 'image' || data.type === 'file') && data.attachment?.url) {
            woops.push({
              kind: data.type,
              text:
                data.text ||
                `${data.type === 'image' ? 'Image' : 'File'}: ${data.attachment.name || ''}`.trim(),
              encryptedValue: encrypted,
              attachmentUrl: data.attachment.url,
              attachmentName: data.attachment.name || 'attachment',
              attachmentMimeType: data.attachment.mimeType || 'application/octet-stream',
              attachmentSize: typeof data.attachment.size === 'number' ? data.attachment.size : 0,
              expiresAt: data.expiresAt,
            });
          } else {
            woops.push({
              kind: data.type === 'image' || data.type === 'file' ? data.type : 'text',
              text: data.text,
              encryptedValue: encrypted,
              expiresAt: data.expiresAt,
            });
          }
        } else {
          expiredEncrypted.push(encrypted);
        }
      } catch {
        // Legacy format without expiration or schema - show raw text for backwards compatibility
        woops.push({
          kind: 'text',
          text: decrypted,
          encryptedValue: encrypted,
        });
      }
    } catch {
      // Skip messages that fail to decrypt
    }
  }

  return { woops, expiredEncrypted };
}

function getExpirationMinutes(value: string | null): number {
  const parsed = value ? Number(value) : DEFAULT_EXPIRATION_MINUTES;
  if (!Number.isFinite(parsed)) {
    return DEFAULT_EXPIRATION_MINUTES;
  }
  return Math.max(1, Math.round(parsed));
}

async function persistWoop(woopData: WoopData, ip: string) {
  const hashedKey = hashIP(ip);
  const encryptedText = encrypt(JSON.stringify(woopData), ip);
  await redis.lpush(hashedKey, encryptedText);
  await redis.expire(hashedKey, TTL_SECONDS);
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
  const { woops, expiredEncrypted } = processWoops(encryptedWoops, ip);

  // Clean up expired messages
  if (expiredEncrypted.length > 0) {
    const hashedKey = hashIP(ip);
    for (const encrypted of expiredEncrypted) {
      await redis.lrem(hashedKey, 1, encrypted);
    }
  }

  async function addWoop(text: string, expirationMinutes: number = DEFAULT_EXPIRATION_MINUTES) {
    'use server';
    if (!text.trim()) return;
    const woopData: WoopData = {
      text,
      type: 'text',
      expiresAt: Date.now() + expirationMinutes * 60 * 1000,
    };
    await persistWoop(woopData, ip);
    revalidatePath('/');
  }

  async function addWoopFromForm(formData: FormData) {
    'use server';
    const rawText = formData.get('woop');
    const textValue = typeof rawText === 'string' ? rawText.trim() : '';
    const expirationMinutes = getExpirationMinutes(formData.get('expirationMinutes') as string | null);
    const attachmentInput = formData.get('attachment');
    const attachmentFile = attachmentInput instanceof File ? attachmentInput : null;
    const hasAttachment = !!(attachmentFile && attachmentFile.size > 0);
    const expiresAt = Date.now() + expirationMinutes * 60 * 1000;

    if (!textValue && !hasAttachment) return;

    if (hasAttachment && attachmentFile && attachmentFile.size > MAX_ATTACHMENT_BYTES) {
      throw new Error('Attachment exceeds 5MB');
    }

    if (hasAttachment && attachmentFile) {
      const arrayBuffer = await attachmentFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = attachmentFile.type || 'application/octet-stream';
      const isImage = mimeType.startsWith('image/');
      const attachment: WoopAttachment = {
        name: attachmentFile.name || 'attachment',
        mimeType,
        size: attachmentFile.size,
        url: `data:${mimeType};base64,${buffer.toString('base64')}`,
      };

      const woopData: WoopData = {
        type: isImage ? 'image' : 'file',
        text: textValue || `${isImage ? 'Image' : 'File'}: ${attachment.name}`,
        attachment,
        expiresAt,
      };
      await persistWoop(woopData, ip);
      revalidatePath('/');
      return;
    }

    const woopData: WoopData = {
      type: 'text',
      text: textValue,
      expiresAt,
    };
    await persistWoop(woopData, ip);
    revalidatePath('/');
  }

  return (
    <WoopProvider addWoop={addWoop} addWoopFromForm={addWoopFromForm}>
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
