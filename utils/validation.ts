import { LINK_TYPES } from '@/db/enum';
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

// links
export const addLinkSchema = z.object({
  url: z.string(),
  title: z.string(),
  type: z.enum(LINK_TYPES),
});
export type addLinkSchemaProps = z.infer<typeof addLinkSchema>;

export const updateLinkSchema = z.object({
  ids: z.array(z.string()),
});
export type updateLinkSchemaProps = z.infer<typeof updateLinkSchema>;

export const editLinkSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
});
export type editLinkSchemaProps = z.infer<typeof editLinkSchema>;

export const deleteLinkSchema = z.object({
  id: z.string(),
});
export type deleteLinkSchemaProps = z.infer<typeof deleteLinkSchema>;
