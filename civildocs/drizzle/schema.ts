import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** One immutable record per project-level Module 2 validation callback. */
export const module2ValidationRuns = mysqlTable("module2_validation_runs", {
  id: int("id").autoincrement().primaryKey(),
  taskUid: varchar("task_uid", { length: 65 }).notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
  status: varchar("status", { length: 48 }).notNull(),
  success: int("success").notNull().default(0),
  lineItemCount: int("line_item_count").notNull().default(0),
  flashcardReviewReady: int("flashcard_review_ready").notNull().default(0),
  pdfHandoffReady: int("pdf_handoff_ready").notNull().default(0),
  detail: text("detail"),
});

/** Per-cron state used to ensure the owner is alerted only after verified success. */
export const module2ValidationState = mysqlTable("module2_validation_state", {
  taskUid: varchar("task_uid", { length: 65 }).primaryKey(),
  firstSuccessAt: timestamp("first_success_at"),
  ownerNotifiedAt: timestamp("owner_notified_at"),
  lastRunAt: timestamp("last_run_at").defaultNow().notNull(),
  lastOutcome: varchar("last_outcome", { length: 48 }).notNull().default("pending"),
});

export type Module2ValidationRun = typeof module2ValidationRuns.$inferSelect;
export type Module2ValidationState = typeof module2ValidationState.$inferSelect;

