import { put } from '@vercel/blob';
import { headers } from 'next/headers';
import { hashIP } from '@/lib/crypto';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    'unknown';

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Create a unique path using hashed IP to organize files
  const hashedIP = hashIP(ip);
  const timestamp = Date.now();
  const pathname = `woops/${hashedIP}/${timestamp}-${file.name}`;

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return NextResponse.json({
    url: blob.url,
    name: file.name,
    size: file.size,
    contentType: file.type,
  });
}
