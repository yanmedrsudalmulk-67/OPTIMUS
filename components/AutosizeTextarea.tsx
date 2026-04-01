'use client';

import { useEffect, useRef } from 'react';

interface AutosizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export default function AutosizeTextarea({ value, ...props }: AutosizeTextareaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;

        // We then set the height directly, outside of the render loop
        // Trying to set this with state or a ref will product an incorrect value.
        textAreaRef.style.height = scrollHeight + "px";
      }
    }, [textAreaRef, value]);
  };

  useAutosizeTextArea(textAreaRef.current, value);

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      value={value}
      className={`w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all resize-none overflow-hidden placeholder-[var(--muted-foreground)]/50 ${props.className || ''}`}
    />
  );
}
