import { useInputControl } from '@conform-to/react';
// import { REGEXP_ONLY_DIGITS_AND_CHARS, type OTPInputProps } from "input-otp";
import type React from 'react';
import { useId } from 'react';
import { Checkbox, type CheckboxProps } from './ui/checkbox';
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "./ui/input-otp";
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function ErrorList({ id, errors }: { errors?: ListOfErrors; id?: string }) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) return null;
  return (
    <ul id={id} className="flex flex-col gap-1">
      {errorsToRender.map((e) => (
        <li key={e} className="text-sm">
          {e}
        </li>
      ))}
    </ul>
  );
}

export function Field({
  labelProps,
  inputProps,
  errors,
  className,
  prefix,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors?: ListOfErrors;
  className?: string;
  prefix?: string;
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <div className="flex items-center gap-2">
        {prefix ? <div className="text-sm text-slate-600">{prefix}</div> : null}
        <Input id={id} aria-invalid={errorId ? true : undefined} aria-describedby={errorId} {...inputProps} />
      </div>

      {errorId ? (
        <div className="pb-1 pl-1 pr-4 pt-1 text-rose-700">
          <ErrorList id={errorId} errors={errors} />
        </div>
      ) : null}
    </div>
  );
}

export function FieldWithHiddenLabel({
  inputProps,
  errors,
  className,
}: {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <Input id={id} aria-invalid={errorId ? true : undefined} aria-describedby={errorId} {...inputProps} />

      {errorId ? (
        <div className="pb-1 pl-1 pr-4 pt-1 text-rose-700">
          <ErrorList id={errorId} errors={errors} />
        </div>
      ) : null}
    </div>
  );
}

export function FieldWithPrefix({
  prefix,
  labelProps,
  inputProps,
  errors,
  className,
}: {
  prefix: string;
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} className="mb-1 block tracking-wide text-slate-800" />
      <div className="flex items-stretch overflow-hidden rounded-md border border-input">
        <div className="mr-1 flex items-center bg-slate-100 px-2 text-sm tracking-wide text-slate-700">{prefix}</div>
        <Input
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...inputProps}
          className="w-full border-none"
        />
      </div>
      {errorId ? (
        <div className="pb-1 pl-1 pr-4 pt-1 text-rose-700">
          <ErrorList id={errorId} errors={errors} />
        </div>
      ) : null}
    </div>
  );
}

// export function OTPField({
//   labelProps,
//   inputProps,
//   errors,
//   className,
// }: {
//   labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
//   inputProps: Partial<OTPInputProps & { render: never }>;
//   errors?: ListOfErrors;
//   className?: string;
// }) {
//   const fallbackId = useId();
//   const id = inputProps.id ?? fallbackId;
//   const errorId = errors?.length ? `${id}-error` : undefined;
//   return (
//     <div className={className}>
//       <Label htmlFor={id} {...labelProps} />
//       <InputOTP
//         pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
//         maxLength={6}
//         id={id}
//         aria-invalid={errorId ? true : undefined}
//         aria-describedby={errorId}
//         {...inputProps}
//       >
//         <InputOTPGroup className="w-full">
//           <InputOTPSlot index={0} className="h-10 w-10" />
//           <InputOTPSlot index={1} className="h-10 w-10" />
//           <InputOTPSlot index={2} className="h-10 w-10" />
//           {/* </InputOTPGroup> */}
//           {/* <InputOTPSeparator /> */}
//           {/* <InputOTPGroup> */}
//           <InputOTPSlot index={3} className="h-10 w-10" />
//           <InputOTPSlot index={4} className="h-10 w-10" />
//           <InputOTPSlot index={5} className="h-10 w-10" />
//         </InputOTPGroup>
//       </InputOTP>
//       <div className="pb-1 pl-1 pr-4 pt-1">
//         {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
//       </div>
//     </div>
//   );
// }

export function TextareaField({
  labelProps,
  textareaProps,
  errors,
  className,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  errors?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();
  const id = textareaProps.id ?? textareaProps.name ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <Textarea id={id} aria-invalid={errorId ? true : undefined} aria-describedby={errorId} {...textareaProps} />
      <div className="pb-1 pl-1 pr-4 pt-1">{errorId ? <ErrorList id={errorId} errors={errors} /> : null}</div>
    </div>
  );
}

export function CheckboxField({
  labelProps,
  buttonProps,
  errors,
  className,
}: {
  labelProps: JSX.IntrinsicElements['label'];
  buttonProps: CheckboxProps & {
    name: string;
    form: string;
    value?: string;
  };
  errors?: ListOfErrors;
  className?: string;
}) {
  const { key, defaultChecked, ...checkboxProps } = buttonProps;
  const fallbackId = useId();
  const checkedValue = buttonProps.value ?? 'on';
  const input = useInputControl({
    key,
    name: buttonProps.name,
    formId: buttonProps.form,
    initialValue: defaultChecked ? checkedValue : undefined,
  });
  const id = buttonProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Checkbox
          {...checkboxProps}
          id={id}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          checked={input.value === checkedValue}
          onCheckedChange={(state) => {
            input.change(state.valueOf() ? checkedValue : '');
            buttonProps.onCheckedChange?.(state);
          }}
          onFocus={(event) => {
            input.focus();
            buttonProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            input.blur();
            buttonProps.onBlur?.(event);
          }}
          type="button"
        />
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
        <label htmlFor={id} {...labelProps} className="text-body-xs self-center text-muted-foreground" />
      </div>
      <div className="px-4 pb-3 pt-1">{errorId ? <ErrorList id={errorId} errors={errors} /> : null}</div>
    </div>
  );
}
