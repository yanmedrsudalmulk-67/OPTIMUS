'use client';

import React from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export default function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  if (!content) return null;

  return (
    <div 
      className={`prose prose-sm dark:prose-invert max-w-none text-justify leading-relaxed break-words prose-ol:list-decimal prose-ul:list-disc prose-li:my-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ 
        textAlign: 'justify', 
        lineHeight: '1.6',
        wordBreak: 'break-word'
      }}
    />
  );
}
