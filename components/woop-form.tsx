'use client';

import { useRef } from 'react';
import { WoopInput } from './woop-input';
import { AddButton } from './add-button';
import { useWoop } from './woop-provider';
import { ExpirationSelector } from './expiration-selector';
import { FileUploadButton } from './file-upload-button';

export function WoopForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { addWoop, expirationMinutes, setExpirationMinutes, isLoading } = useWoop();

  const handleSubmit = async (formData: FormData) => {
    const woop = formData.get('woop') as string;
    if (!woop?.trim()) return;
    await addWoop(woop);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} className='flex gap-2 w-full' action={handleSubmit}>
      <WoopInput disabled={isLoading} />
      <FileUploadButton />
      <ExpirationSelector value={expirationMinutes} onChange={setExpirationMinutes} disabled={isLoading} />
      <AddButton />
    </form>
  );
}
