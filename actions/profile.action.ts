'use server';

import { db } from '@/db';
import { link, profile, type SelectLink } from '@/db/schema';
import { and, eq, inArray, max, type SQL, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import DOMPurify from 'isomorphic-dompurify';
import { authGuard } from '@/utils/auth-guard';
import { parseWithZod } from '@conform-to/zod';
import { addLinkSchema, deleteLinkSchema, editLinkSchema, updateLinkSchema } from '@/utils/validation';
import { LinkBaseUrlMap } from '@/feature/links';
import { createId } from '@paralleldrive/cuid2';
import type { SubmissionResult } from '@conform-to/react';
import { redirect } from 'next/navigation';

export async function updateProfileName(userId: string, name: string) {
  await authGuard();

  await db.update(profile).set({ name }).where(eq(profile.id, userId));

  revalidatePath('/protected/dashboard');
}

export async function updateProfileBio(userId: string, bio: string) {
  await authGuard();
  const cleanBio = DOMPurify.sanitize(bio);
  await db.update(profile).set({ bio: cleanBio }).where(eq(profile.id, userId));
  revalidatePath('/protected/dashboard');
}

export async function insertNewLink(prevState: unknown, formData: FormData) {
  const user = await authGuard();

  const submission = await parseWithZod(formData, {
    schema: addLinkSchema,
    async: true,
  });

  if (submission.status !== 'success') {
    return { result: submission.reply(), status: 'error' };
  }

  const { url: username, type, title } = submission.value;

  // up to 10 links
  const links = await db.query.link.findMany({
    where: eq(link.userId, user.id),
  });
  if (links.length >= 10) {
    return {
      result: submission.reply({
        formErrors: ['You can add up to 10 links'],
      }),
      status: 'error',
    };
  }

  // 選択されたリンクタイプに対応するbaseUrlを取得
  const linkBaseUrl = LinkBaseUrlMap[type];
  if (linkBaseUrl === undefined) {
    return {
      result: submission.reply({
        formErrors: ['Invalid link type'],
      }),
      status: 'error',
    };
  }

  // ユーザーネームとbaseUrlを連結
  const fullUrl = `${linkBaseUrl}${username}`;

  // DBに保存する処理
  const result = await db
    .select({ maxPos: max(link.position) })
    .from(link)
    .where(eq(link.userId, user.id));

  const maxPosition = result[0].maxPos;

  await db.insert(link).values({
    id: createId(),
    title,
    type,
    url: fullUrl,
    active: true,
    position: (maxPosition ?? 0) + 1,
    userId: user.id,
  });

  revalidatePath('/protected/dashboard');
  return { result: submission.reply(), status: 'success' };
}

export async function deleteLink(prevState: unknown, formData: FormData) {
  await authGuard();

  const submission = await parseWithZod(formData, {
    schema: deleteLinkSchema,
    async: true,
  });

  if (submission.status !== 'success') {
    return { result: submission.reply(), status: 'error' };
  }

  const { id } = submission.value;

  await db.delete(link).where(eq(link.id, id));

  revalidatePath('/protected/dashboard');
  return { result: submission.reply(), status: 'success' };
}

export async function updateLink(prevState: unknown, formData: FormData) {
  await authGuard();

  const submission = await parseWithZod(formData, {
    schema: editLinkSchema,
    async: true,
  });

  if (submission.status !== 'success') {
    return { result: submission.reply(), status: 'error' };
  }

  const { id, url, title } = submission.value;

  await db.update(link).set({ url, title }).where(eq(link.id, id));

  revalidatePath('/protected/dashboard');
  return { result: submission.reply(), status: 'success' };
}

export async function updateLinkPosition(
  prevState: { result: SubmissionResult<string[]>; links: SelectLink[] },
  formData: FormData,
) {
  const user = await authGuard();

  const submission = await parseWithZod(formData, {
    schema: updateLinkSchema,
    async: true,
  });

  if (submission.status !== 'success') {
    return { result: submission.reply(), links: prevState.links };
  }

  const { ids } = submission.value;

  if (ids.length === 0) {
    return { result: submission.reply(), links: [] };
  }

  const sqlChunks: SQL[] = [];
  sqlChunks.push(sql`(case`);

  for (const [index, id] of ids.entries()) {
    sqlChunks.push(sql`when ${link.id} = ${id} then ${index}`);
  }

  sqlChunks.push(sql`end)`);
  const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));

  await db
    .update(link)
    .set({ position: sql`CAST(${finalSql} AS integer)` }) // Cast CASE to integer
    .where(and(inArray(link.id, ids), eq(link.userId, user.id)));

  // revalidatePath('/protected/dashboard');

  const links = await db.query.link.findMany({
    where: eq(link.userId, user.id),
    orderBy: (link, { asc }) => [asc(link.position)],
  });
  return { result: submission.reply(), links };
}
