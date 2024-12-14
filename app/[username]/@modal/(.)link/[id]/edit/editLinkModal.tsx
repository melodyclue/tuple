'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { LinkBaseUrlMap, LinkIconMap, LinkOptions } from '@/feature/links';
import type { SelectLink } from '@/db/schema';
import { startTransition, useActionState, useEffect } from 'react';
import { updateLink } from '@/actions/profile.action';
import { editLinkSchema, type editLinkSchemaProps } from '@/utils/validation';
import { getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ErrorList, Field } from '@/components/form';
import { SubmitButton } from '@/components/submit-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const EditLinkModal = ({ link }: { link: SelectLink }) => {
  const router = useRouter();
  const baseUrl = LinkBaseUrlMap[link.type] ?? '';
  const [lastResult, action] = useActionState(updateLink, undefined);

  const [form, fields] = useForm<editLinkSchemaProps>({
    id: 'edit-link',
    lastResult: lastResult?.result,
    constraint: getZodConstraint(editLinkSchema),
    defaultValue: {
      id: link.id,
      url: link.url.replace(baseUrl, ''),
      type: link.type,
      title: link.title,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: editLinkSchema });
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

  const icon = LinkIconMap[link.type] ?? faLink;
  const placeholder = LinkOptions.find((option) => option.type === link.type)?.placeholder ?? 'Enter a Link';

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
            <span className="text-lg font-medium">Edit Link</span>
          </DialogTitle>
        </div>
        <div className="px-8">
          <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
            <input key={fields.id.key} name={fields.id.name} defaultValue={fields.id.initialValue} hidden />
            <input key={fields.type.key} name={fields.type.name} defaultValue={fields.type.initialValue} hidden />
            <div className="mb-6 flex flex-col gap-4">
              <Field
                className="w-full"
                labelProps={{
                  className: '',
                  children: 'Title',
                }}
                inputProps={{
                  ...getInputProps(fields.title, { type: 'text' }),
                  className: 'bg-slate-50 w-full',
                  placeholder: 'Enter a title',
                }}
                errors={fields.title.errors}
              />

              <Field
                className="w-full"
                labelProps={{
                  className: '',
                  children: 'Link',
                }}
                inputProps={{
                  ...getInputProps(fields.url, { type: 'text' }),
                  className: 'bg-slate-50 w-full',
                  placeholder,
                }}
                errors={fields.url.errors}
              />
            </div>
            <ErrorList errors={form.errors} />
            <div className="flex justify-center">
              <SubmitButton type="submit">Update Link</SubmitButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
