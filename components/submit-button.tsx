'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText = 'Submitting...', ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="rounded-3xl border bg-white px-8 py-2 font-medium text-slate-700 shadow-none transition-all disabled:cursor-not-allowed disabled:opacity-50"
      type="submit"
      aria-disabled={pending}
      {...props}
    >
      {pending ? (
        <span className="flex items-center pr-2">
          <i className="i-tabler-loader-2 animate-spin text-slate-700" />
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
