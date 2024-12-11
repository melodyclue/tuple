'use client';

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
  useEffect,
  useActionState,
  startTransition,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLink } from '@fortawesome/free-solid-svg-icons';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { ErrorList, Field } from '@/components/form';
import { addLinkSchema, editLinkSchema, type editLinkSchemaProps } from '@/utils/validation';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { LinkBaseUrlMap, LinkIconMap, LinkOptions, type LinkOption } from './index';
import { insertNewLink, updateLink } from '@/actions/profile.action';
import { SubmitButton } from '@/components/submit-button';
import type { SelectLink } from '@/db/schema';
import { revalidatePath } from 'next/cache';

function EditLink({
  link,
  setShowEditLinkModal,
  showEditLinkModal,
}: {
  link: SelectLink;
  setShowEditLinkModal: Dispatch<SetStateAction<boolean>>;
  showEditLinkModal: boolean;
}) {
  const baseUrl = LinkBaseUrlMap[link.type] ?? '';
  const [lastResult, action] = useActionState(updateLink, undefined);

  const [form, fields] = useForm<editLinkSchemaProps>({
    id: 'edit-link',
    lastResult: lastResult?.result,
    constraint: getZodConstraint(editLinkSchema),
    defaultValue: {
      id: link.id,
      url: link.url.replace(baseUrl, ''),
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
      setShowEditLinkModal(false);
    }
  }, [lastResult, setShowEditLinkModal]);

  const icon = LinkIconMap[link.type] ?? faLink;
  const placeholder = LinkOptions.find((option) => option.type === link.type)?.placeholder ?? 'Enter a Link';
  return (
    <Dialog open={showEditLinkModal} onOpenChange={setShowEditLinkModal}>
      <DialogOverlay />
      <DialogContent className="z-20 w-full max-w-xl p-8">
        <div className="mb-6 flex items-center">
          <DialogTitle className="flex w-full items-center justify-center gap-2 text-center">
            <FontAwesomeIcon icon={icon} size="lg" className="h-8 w-8 text-slate-700" />
            <span className="text-lg font-medium">Edit Link</span>
          </DialogTitle>
        </div>
        <div className="px-8">
          <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
            <input key={fields.id.key} name={fields.id.name} defaultValue={fields.id.initialValue} hidden />
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
}

export function useEditLinkModal({ link }: { link: SelectLink }) {
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);

  const EditLinkModalCallback = useCallback(
    () => <EditLink link={link} showEditLinkModal={showEditLinkModal} setShowEditLinkModal={setShowEditLinkModal} />,
    [showEditLinkModal, link],
  );

  return {
    setShowEditLinkModal,
    EditLinkModal: EditLinkModalCallback,
  };
}
