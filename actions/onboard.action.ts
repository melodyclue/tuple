'use server';

import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { db } from '@/db';
import { profile } from '@/db/schema';
import { authGuard } from '@/utils/auth-guard';
import { insertProfileSchema } from '@/utils/validation';

export async function insertNewProfile(prevState: unknown, formData: FormData) {
  const user = await authGuard();

  const submission = await parseWithZod(formData, {
    schema: insertProfileSchema,
    async: true,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { name, username } = submission.value;

  await db.insert(profile).values({
    id: user.id,
    name,
    username,
  });

  redirect('/protected/dashboard');
}
