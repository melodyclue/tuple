import { pgEnum } from "drizzle-orm/pg-core";

// Link Type
export const LINK_TYPE_EMAIL = "email";
export const LINK_TYPE_WEBSITE = "website";
export const LINK_TYPE_X = "x";
export const LINK_TYPE_YOUTUBE = "youtube";
export const LINK_TYPE_INSTAGRAM = "instagram";
export const LINK_TYPE_FACEBOOK = "facebook";
export const LINK_TYPE_LINKEDIN = "linkedin";
export const LINK_TYPE_TIKTOK = "tiktok";
export const LINK_TYPES = [
  LINK_TYPE_EMAIL,
  LINK_TYPE_WEBSITE,
  LINK_TYPE_X,
  LINK_TYPE_YOUTUBE,
  LINK_TYPE_INSTAGRAM,
  LINK_TYPE_FACEBOOK,
  LINK_TYPE_LINKEDIN,
  LINK_TYPE_TIKTOK,
] as const;
export type LinkType = (typeof LINK_TYPES)[number];
