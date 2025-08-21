import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  mobile: text("mobile").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  stars: integer("stars").default(0).notNull(),
  rejections: integer("rejections").default(0).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  topic: text("topic").notNull(),
  language: text("language").notNull(),
  price: integer("price").notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  images: text("images").array().default(sql`'{}'`).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookId: varchar("book_id").references(() => books.id).notNull(),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, rejected
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const helpRequests = pgTable("help_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  issueType: text("issue_type").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, resolved
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  stars: true,
  rejections: true,
  isBanned: true,
  createdAt: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  sellerId: true,
  isAvailable: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;

export type User = typeof users.$inferSelect;
export type Book = typeof books.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type HelpRequest = typeof helpRequests.$inferSelect;
