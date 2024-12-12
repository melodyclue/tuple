'use client';

import { SubmitButton } from '@/components/submit-button';
import { getZodConstraint } from '@conform-to/zod';
import { getInputProps, useForm } from '@conform-to/react';
import { startTransition, useActionState } from 'react';
import { parseWithZod } from '@conform-to/zod';
import { Field, FieldWithPrefix } from '@/components/form';
import { z } from 'zod';
import { updatProfile } from '@/actions/settings.action';
import { updateProfileSchema, type updateProfileSchemaType } from '@/utils/validation';

const insertProfileSchema = z.object({
  name: z.string().min(1).max(20),
  username: z.string().min(1).max(20),
});

type UpdateProfileProps = {
  username: string;
  name: string;
};

export const UpdateProfile = ({ username, name }: UpdateProfileProps) => {
  const [lastResult, action] = useActionState(updatProfile, undefined);

  const [form, fields] = useForm<updateProfileSchemaType>({
    id: 'edit-profile',
    constraint: getZodConstraint(updateProfileSchema),
    lastResult: lastResult?.result,
    defaultValue: {
      username,
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        action(formData);
      });
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateProfileSchema });
    },
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="p-8">
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <div className="mx-auto flex w-full max-w-xs flex-col items-center justify-center gap-8">
          <h2 className="text-2xl font-bold">Update your profile</h2>
          <div className="flex w-full flex-col justify-between gap-5">
            <FieldWithPrefix
              prefix="tuple.link/"
              className="w-full"
              labelProps={{
                children: 'Your profile link',
              }}
              inputProps={{
                ...getInputProps(fields.username, { type: 'text' }),
                className: 'bg-slate-50 w-full',
                placeholder: 'Enter your username',
                autoComplete: 'off',
              }}
              errors={fields.username.errors}
            />
          </div>

          <SubmitButton type="submit">Update profile</SubmitButton>
        </div>
      </form>
    </div>
  );
};
