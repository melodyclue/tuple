'use server';

import { db } from '@/db';
import { profile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import DOMPurify from 'isomorphic-dompurify';

export async function updateProfileName(userId: string, name: string) {
  await db.update(profile).set({ name }).where(eq(profile.id, userId));

  revalidatePath('/protected/dashboard');
}

export async function updateProfileBio(userId: string, bio: string) {
  const cleanBio = DOMPurify.sanitize(bio);
  await db.update(profile).set({ bio: cleanBio }).where(eq(profile.id, userId));
  revalidatePath('/protected/dashboard');
}
