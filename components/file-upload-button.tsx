'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import { Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import { useWoop } from './woop-provider';

export function FileUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addWoopWithFile, isLoading } = useWoop();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await addWoopWithFile(file);
      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          aria-label="Upload file"
          title="Upload file"
        >
          <Paperclip className="size-4" />
        </Button>
      </motion.div>
    </>
  );
}
