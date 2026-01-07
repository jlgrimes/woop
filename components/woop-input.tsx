'use client';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { forwardRef, useRef, useImperativeHandle } from 'react';

export interface WoopInputHandle {
  getValue: () => string;
}

interface WoopInputProps {
  disabled?: boolean;
}

export const WoopInput = forwardRef<WoopInputHandle, WoopInputProps>(function WoopInput(
  { disabled },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => textareaRef.current?.value ?? '',
  }));

  return (
    <AutosizeTextarea
      ref={textareaRef}
      name='woop'
      placeholder='Add a woop'
      rows={1}
      minRows={1}
      maxRows={6}
      autoFocus
      disabled={disabled}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          textareaRef.current?.form?.requestSubmit();
        }
      }}
    />
  );
});
