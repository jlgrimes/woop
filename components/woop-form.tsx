'use client';

import { useRef } from 'react';
import { WoopInput, WoopInputHandle } from './woop-input';
import { AddButton } from './add-button';
import { useWoop } from './woop-provider';

export function WoopForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<WoopInputHandle>(null);
  const { addWoop } = useWoop();

  const handleSubmit = async (formData: FormData) => {
    const woop = formData.get('woop') as string;
    if (!woop?.trim()) return;
    await addWoop(woop, false);
    formRef.current?.reset();
  };

  const handleAddSensitive = async () => {
    const woop = inputRef.current?.getValue();
    if (!woop?.trim()) return;
    await addWoop(woop, true);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} className='flex gap-2 w-full' action={handleSubmit}>
      <WoopInput ref={inputRef} />
      <AddButton onAddSensitive={handleAddSensitive} />
    </form>
  );
}
