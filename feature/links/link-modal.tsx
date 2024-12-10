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
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { ErrorList, Field } from '@/components/form';
import { addLinkSchema, type addLinkSchemaProps } from '@/utils/validation';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { LinkOptions, type LinkOption } from './index';
import { insertNewLink } from '@/actions/profile.action';
import { SubmitButton } from '@/components/submit-button';

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
                <FontAwesomeIcon icon={option.icon} size="lg" className="h-8 w-8 text-slate-700" />
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

function LinkInput({
  selectedLink,
  onBack,
  onClose,
}: {
  selectedLink: LinkOption;
  onBack: () => void;
  onClose: Dispatch<SetStateAction<boolean>>;
}) {
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

  useEffect(() => {
    if (lastResult?.result?.status === 'success') {
      onClose(false);
    }
  }, [lastResult, onClose]);

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
          <FontAwesomeIcon icon={selectedLink.icon} size="lg" className="h-8 w-8 text-slate-700" />
        </DialogTitle>
      </div>
      <div className="px-8">
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <input key={fields.type.key} name={fields.type.name} defaultValue={fields.type.initialValue} hidden />
          <div className="mb-6 flex flex-col gap-4">
            <Field
              className="w-full"
              labelProps={{
                className: 'hidden',
              }}
              inputProps={{
                ...getInputProps(fields.url, { type: 'text' }),
                className: 'bg-slate-50 w-full',
                placeholder: selectedLink.placeholder,
              }}
              errors={fields.url.errors}
            />

            <Field
              className="w-full"
              labelProps={{
                className: 'hidden',
              }}
              inputProps={{
                ...getInputProps(fields.title, { type: 'text' }),
                className: 'bg-slate-50 w-full',
                placeholder: 'Enter a Title for the Link',
              }}
              errors={fields.title.errors}
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

function SelectLinkModal({
  showSelectLinkModal,
  setShowSelectLinkModal,
}: {
  showSelectLinkModal: boolean;
  setShowSelectLinkModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [selectedLink, setSelectedLink] = useState<LinkOption | null>(null);

  const handleLinkSelect = (option: LinkOption) => {
    setSelectedLink(option);
  };

  const handleBack = () => {
    setSelectedLink(null);
  };

  return (
    <Dialog open={showSelectLinkModal} onOpenChange={setShowSelectLinkModal}>
      <DialogOverlay />
      <DialogContent className="w-full max-w-xl p-8">
        <DialogHeader>
          {selectedLink ? (
            <LinkInput selectedLink={selectedLink} onBack={handleBack} onClose={setShowSelectLinkModal} />
          ) : (
            <LinkSelection onSelect={handleLinkSelect} />
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function useSelectLinkModal() {
  const [showSelectLinkModal, setShowSelectLinkModal] = useState(false);

  const SelectLinkModalCallback = useCallback(
    () => <SelectLinkModal showSelectLinkModal={showSelectLinkModal} setShowSelectLinkModal={setShowSelectLinkModal} />,
    [showSelectLinkModal],
  );

  return {
    setShowSelectLinkModal,
    SelectLinkModal: SelectLinkModalCallback,
  };
}
