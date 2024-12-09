'use server';

import { revalidatePath } from 'next/cache';

export default async function _revalidatePath(path: string) {
  revalidatePath(path);
}
