'use client';

import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

export const ShareButton = ({ username }: { username: string }) => {
  const { toast } = useToast();
  return (
    <Button
      variant="outline"
      className="rounded-3xl"
      onClick={() => {
        navigator.clipboard.writeText(`${window.location.origin}/${username}`);
        toast({
          title: 'Copied to clipboard',
          description: `${window.location.origin}/${username}`,
        });
      }}
    >
      Share
    </Button>
  );
};
