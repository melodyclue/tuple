'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { LinkBaseUrlMap, LinkIconMap, LinkOptions } from '@/feature/links';
import type { SelectLink } from '@/db/schema';
import { startTransition, useActionState, useEffect } from 'react';
import { deleteLink } from '@/actions/profile.action';
import { deleteLinkSchema, type deleteLinkSchemaProps } from '@/utils/validation';
import { getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ErrorList } from '@/components/form';
import { SubmitButton } from '@/components/submit-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const DeleteLinkModal = ({ link }: { link: SelectLink | undefined }) => {
  const router = useRouter();
  const [lastResult, action] = useActionState(deleteLink, undefined);

  const [form, fields] = useForm<deleteLinkSchemaProps>({
    id: 'delete-link',
    lastResult: lastResult?.result,
    constraint: getZodConstraint(deleteLinkSchema),
    defaultValue: {
      id: link?.id,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: deleteLinkSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        action(formData);
      });
    },
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (lastResult?.result?.status === 'success') {
      router.back();
    }
  }, [lastResult, router]);

  const icon = link ? (LinkIconMap[link.type] ?? faLink) : faLink;

  return (
    <Dialog
      modal
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogOverlay />
      <DialogContent className="z-50 w-full max-w-xl p-8">
        <div className="mb-6 flex items-center">
          <DialogTitle className="flex w-full items-center justify-center gap-2 text-center">
            <FontAwesomeIcon icon={icon} size="lg" className="h-8 w-8 text-zinc-700" />
            <span className="text-lg font-medium">Delete Link</span>
          </DialogTitle>
        </div>
        <div className="px-8">
          <DialogDescription className="mb-4 text-center">Are you sure you want to delete this link?</DialogDescription>
          <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
            <input {...getInputProps(fields.id, { type: 'hidden' })} />
            <ErrorList errors={form.errors} />
            <div className="flex justify-center">
              <SubmitButton type="submit">Delete Link</SubmitButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
