import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const thoughts = pgTable("thoughts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userAddress: text("user_address").notNull(),
  content: text("content").notNull(),
  transactionHash: text("transaction_hash"),
  tipAmount: decimal("tip_amount", { precision: 18, scale: 18 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialShares = pgTable("social_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  thoughtId: varchar("thought_id").references(() => thoughts.id),
  platform: text("platform").notNull(), // twitter, farcaster, instagram
  shareUrl: text("share_url"),
  shared: boolean("shared").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertThoughtSchema = createInsertSchema(thoughts).pick({
  userAddress: true,
  content: true,
  transactionHash: true,
  tipAmount: true,
});

export const insertSocialShareSchema = createInsertSchema(socialShares).pick({
  thoughtId: true,
  platform: true,
  shareUrl: true,
  shared: true,
});

export type InsertThought = z.infer<typeof insertThoughtSchema>;
export type Thought = typeof thoughts.$inferSelect;
export type InsertSocialShare = z.infer<typeof insertSocialShareSchema>;
export type SocialShare = typeof socialShares.$inferSelect;
