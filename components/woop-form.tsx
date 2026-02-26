'use client';

import { Paperclip } from 'lucide-react';
import { useRef, useState } from 'react';
import { WoopInput } from './woop-input';
import { AddButton } from './add-button';
import { useWoop } from './woop-provider';
import { ExpirationSelector } from './expiration-selector';
import { Button } from './ui/button';

export function WoopForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const { addWoop, addWoopFromFormData, expirationMinutes, setExpirationMinutes, isLoading } = useWoop();

  const handleSubmit = async (formData: FormData) => {
    const woop = formData.get('woop') as string;

    const attachment = formData.get('attachment');
    const hasAttachment = attachment instanceof File && attachment.size > 0;

    if (!woop?.trim() && !hasAttachment) return;

    if (hasAttachment) {
      await addWoopFromFormData(formData);
    } else {
      await addWoop(woop);
    }

    formRef.current?.reset();
    setSelectedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    setSelectedFileName(file?.name ?? '');
  };

  return (
    <form ref={formRef} className='w-full space-y-2' action={handleSubmit}>
      <div className='flex gap-2'>
        <WoopInput disabled={isLoading} />
        <ExpirationSelector value={expirationMinutes} onChange={setExpirationMinutes} disabled={isLoading} />
        <input type='hidden' name='expirationMinutes' value={expirationMinutes} />
        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          onClick={() => fileInputRef.current?.click()}
          aria-label='Attach file'
          disabled={isLoading}
        >
          <Paperclip className='size-4' />
        </Button>
        <AddButton />
      </div>
      {selectedFileName && (
        <p className='text-xs text-muted-foreground'>Attached: {selectedFileName}</p>
      )}
      <input
        ref={fileInputRef}
        type='file'
        name='attachment'
        onChange={handleFileChange}
        className='sr-only'
      />
    </form>
  );
}
