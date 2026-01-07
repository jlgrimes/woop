import { del } from '@vercel/blob';

export async function deleteBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    // Log but don't throw - blob might already be deleted or not exist
    console.error('Failed to delete blob:', url, error);
  }
}

export async function deleteBlobs(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  try {
    await del(urls);
  } catch (error) {
    console.error('Failed to delete blobs:', error);
  }
}
