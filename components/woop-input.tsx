'use client';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { forwardRef, useRef, useImperativeHandle } from 'react';

export interface WoopInputHandle {
  getValue: () => string;
}

export const WoopInput = forwardRef<WoopInputHandle>(function WoopInput(
  _props,
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
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          textareaRef.current?.form?.requestSubmit();
        }
      }}
    />
  );
});
