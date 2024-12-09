import { boolean, timestamp, pgTable, text, integer, index, uuid, foreignKey, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { authUsers } from 'drizzle-orm/supabase';
import { LINK_TYPES } from './enum';

export const linkTypes = pgEnum('linkType', LINK_TYPES);

export const profile = pgTable(
  'profile',
  {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    username: text('username').notNull(),
    imageUrl: text('imageUrl'),
    bio: text('bio'),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: 'profile_user_id_fk',
    }).onDelete('cascade'),
  ],
).enableRLS();

export const profileRelations = relations(profile, ({ many }) => ({
  links: many(link),
}));

export const link = pgTable(
  'link',
  {
    id: text('id').primaryKey(),
    url: text('url').notNull(),
    type: linkTypes('type').notNull(),
    active: boolean('active').notNull().default(true),
    position: integer('position').notNull(),
    userId: uuid('userId').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profile.id],
      name: 'link_user_id_fk',
    }).onDelete('cascade'),
    index('link_user_id_idx').on(table.userId),
  ],
).enableRLS();

export const linkRelations = relations(link, ({ one }) => ({
  profile: one(profile, {
    fields: [link.userId],
    references: [profile.id],
  }),
}));
