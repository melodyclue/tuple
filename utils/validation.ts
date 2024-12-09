import { z } from 'zod';

export const insertProfileSchema = z.object({
  name: z.string().min(1).max(20),
  username: z.string().min(1).max(20),
});
export type insertProfileSchemaType = z.infer<typeof insertProfileSchema>;

export const uploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
});

export type uploadSchemaType = z.infer<typeof uploadSchema>;
