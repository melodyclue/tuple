'use client';

import { SubmitButton } from '@/components/submit-button';
import { getZodConstraint } from '@conform-to/zod';
import { getInputProps, useForm } from '@conform-to/react';
import { startTransition, useActionState } from 'react';
import { parseWithZod } from '@conform-to/zod';
import { Field, FieldWithPrefix } from '@/components/form';
import { z } from 'zod';
import { createProfile } from '@/actions/settings.action';
import { createProfileSchema, type createProfileSchemaType } from '@/utils/validation';

const insertProfileSchema = z.object({
  name: z.string().min(1).max(20),
  username: z.string().min(1).max(20),
});

export const CreateProfile = () => {
  const [lastResult, action] = useActionState(createProfile, undefined);

  const [form, fields] = useForm<createProfileSchemaType>({
    id: 'edit-name',
    constraint: getZodConstraint(createProfileSchema),
    lastResult: lastResult?.result,
    defaultValue: {
      name: '',
      username: '',
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        action(formData);
      });
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: insertProfileSchema });
    },
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="p-8">
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <div className="mx-auto flex w-full max-w-xs flex-col items-center justify-center gap-8">
          <h2 className="text-2xl font-bold">Create your profile</h2>
          <div className="flex w-full flex-col justify-between gap-5">
            <Field
              className="w-full"
              labelProps={{
                children: 'Enter your name',
              }}
              inputProps={{
                ...getInputProps(fields.name, { type: 'text' }),
                className: 'bg-slate-50 w-full',
                placeholder: 'Enter your name',
                autoComplete: 'off',
                spellCheck: 'false',
              }}
              errors={fields.name.errors}
              data-1p-ignore
            />

            <FieldWithPrefix
              data1pIgnore={true}
              prefix="tuple.link/"
              className="w-full"
              labelProps={{
                children: 'Claim your unique link',
              }}
              inputProps={{
                ...getInputProps(fields.username, { type: 'text' }),
                className: 'bg-slate-50 w-full',
                placeholder: 'Enter username ',
                autoComplete: 'off',
                spellCheck: 'false',
              }}
              errors={fields.username.errors}
            />
          </div>

          <SubmitButton type="submit">Create profile</SubmitButton>
        </div>
      </form>
    </div>
  );
};
