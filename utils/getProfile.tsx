import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { profile } from '@/db/schema';

export const getProfile = async (userId: string) => {
  const data = await db.query.profile.findFirst({
    where: eq(profile.id, userId),
  });
  return data;
};
