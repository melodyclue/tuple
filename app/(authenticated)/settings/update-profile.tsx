'use client';

import { SubmitButton } from '@/components/submit-button';
import { getZodConstraint } from '@conform-to/zod';
import { getInputProps, useForm } from '@conform-to/react';
import { startTransition, useActionState } from 'react';
import { parseWithZod } from '@conform-to/zod';
import { FieldWithPrefix } from '@/components/form';
import { updatProfile } from '@/actions/settings.action';
import { updateProfileSchema, type updateProfileSchemaType } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';

type UpdateProfileProps = {
  username: string;
  name: string;
};

export const UpdateProfile = ({ username, name }: UpdateProfileProps) => {
  const [lastResult, action] = useActionState(updatProfile, undefined);
  const { toast } = useToast();

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
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated',
        });
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
              data1pIgnore={true}
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
                spellCheck: 'false',
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
