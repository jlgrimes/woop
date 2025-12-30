"use client";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { useRef } from "react";

export function WoopInput() {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <AutosizeTextarea
      ref={ref}
      name="woop"
      placeholder="Add a woop"
      rows={1}
      minRows={1}
      maxRows={6}
      autoFocus
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          ref.current?.form?.requestSubmit();
        }
      }}
    />
  );
}
