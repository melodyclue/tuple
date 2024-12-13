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
import { LinkBaseUrlMap, LinkIconMap, type LinkOption, LinkOptions } from '@/feature/links';
import type { SelectLink } from '@/db/schema';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { insertNewLink, updateLink } from '@/actions/profile.action';
import { addLinkSchema, type addLinkSchemaProps, editLinkSchema, type editLinkSchemaProps } from '@/utils/validation';
import { getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { faChevronLeft, faChevronRight, faLink } from '@fortawesome/free-solid-svg-icons';
import { ErrorList, Field } from '@/components/form';
import { SubmitButton } from '@/components/submit-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function LinkSelection({ onSelect }: { onSelect: (option: LinkOption) => void }) {
  return (
    <>
      <DialogTitle className="text-center">Select a Link</DialogTitle>
      <div>
        <div className="space-y-1 px-8 py-6">
          {LinkOptions.map((option) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className="flex cursor-pointer items-center justify-between gap-4 rounded-md p-2 px-4 py-3 hover:bg-slate-100"
              key={option.label}
              onClick={() => onSelect(option)}
            >
              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={option.icon} size="lg" className="h-8 w-8 text-zinc-700" />
                <div>{option.label}</div>
              </div>
              <div>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function LinkInput({ selectedLink, onBack }: { selectedLink: LinkOption; onBack: () => void }) {
  const router = useRouter();
  const [lastResult, action] = useActionState(insertNewLink, undefined);
  const [form, fields] = useForm<addLinkSchemaProps>({
    id: 'add-link',
    lastResult: lastResult?.result,
    constraint: getZodConstraint(addLinkSchema),
    defaultValue: {
      url: '',
      type: selectedLink.type,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: addLinkSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        action(formData);
      });
    },
    shouldRevalidate: 'onInput',
  });
  console.log(lastResult);
  useEffect(() => {
    if (lastResult?.result?.status === 'success') {
      router.back();
    }
  }, [lastResult, router]);

  return (
    <>
      <div className="mb-6 flex items-center">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          onClick={onBack}
          className="absolute left-10 flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <DialogTitle className="w-full text-center">
          <FontAwesomeIcon icon={selectedLink.icon} size="lg" className="h-8 w-8 text-zinc-700" />
        </DialogTitle>
      </div>
      <div className="px-8">
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
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
                placeholder: selectedLink.placeholder,
              }}
              errors={fields.url.errors}
            />
          </div>
          <ErrorList errors={form.errors} />
          <div className="flex justify-center">
            <SubmitButton type="submit">Add Link</SubmitButton>
          </div>
        </form>
      </div>
    </>
  );
}

export function AddLinkModal() {
  const router = useRouter();
  const [selectedLink, setSelectedLink] = useState<LinkOption | null>(null);

  const handleLinkSelect = (option: LinkOption) => {
    setSelectedLink(option);
  };

  const handleBack = () => {
    setSelectedLink(null);
  };

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
        {selectedLink ? (
          <LinkInput selectedLink={selectedLink} onBack={handleBack} />
        ) : (
          <LinkSelection onSelect={handleLinkSelect} />
        )}
      </DialogContent>
    </Dialog>
  );
}
