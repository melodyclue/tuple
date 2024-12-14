'use server';

import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { db } from '@/db';
import { profile } from '@/db/schema';
import { authGuard } from '@/utils/auth-guard';
import { createProfileSchema, updateProfileSchema } from '@/utils/validation';
import { and, eq, ne } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function createProfile(prevState: unknown, formData: FormData) {
  const user = await authGuard();

  const submission = await parseWithZod(formData, {
    schema: createProfileSchema.superRefine(async (data, ctx) => {
      const existingProfile = await db
        .select()
        .from(profile)
        .where(and(eq(profile.username, data.username), ne(profile.id, user.id)));
      if (existingProfile.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Username already exists',
          path: ['username'],
        });
        return z.NEVER;
      }
    }),
    async: true,
  });

  if (submission.status !== 'success') {
    return { result: submission.reply() };
  }

  const { name, username } = submission.value;

  await db.insert(profile).values({
    id: user.id,
    name,
    username,
  });

  revalidatePath('/settings');
  redirect(`/${username}`);
}

export async function updatProfile(prevState: unknown, formData: FormData) {
  const user = await authGuard();

  const submission = await parseWithZod(formData, {
    schema: updateProfileSchema.superRefine(async (data, ctx) => {
      const existingProfile = await db
        .select()
        .from(profile)
        .where(and(eq(profile.username, data.username), ne(profile.id, user.id)));

      if (existingProfile.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Username already exists',
          path: ['username'],
        });
        return z.NEVER;
      }
    }),
    async: true,
  });

  if (submission.status !== 'success') {
    return { result: submission.reply() };
  }

  const { username } = submission.value;

  await db
    .update(profile)
    .set({
      username,
    })
    .where(eq(profile.id, user.id));

  revalidatePath('/settings');
  return { result: submission.reply() };
}
