'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
}

export function InlineEdit({ value: initialValue, onSave, className }: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleBlur = async () => {
    if (!!value && value !== initialValue) {
      await onSave(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        spellCheck={false}
        autoComplete="off"
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="border-none p-2 text-4xl font-bold"
      />
    );
  }

  return (
    <h1
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setIsEditing(true);
        }
      }}
      className="block p-2 text-4xl font-bold transition-all duration-300 hover:bg-slate-50"
    >
      {value}
    </h1>
  );
}
