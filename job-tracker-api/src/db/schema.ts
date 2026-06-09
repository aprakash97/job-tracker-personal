import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  jobDescription: text('job_description'),
  currency: varchar('currency', {
    enum: ['LKR', 'USD', 'AUD', 'CAD', 'INR'],
  }).default('LKR'),
  salary: integer('salary'),
  status: uuid('status')
    .references(() => status.id)
    .notNull(),
  isRemote: boolean('is_remote').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const status = pgTable('status', {
  id: uuid('id').primaryKey().defaultRandom(),
  statusName: uuid('status_name').notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
}))

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
  status: one(status, {
    fields: [jobs.status],
    references: [status.id],
  }),
}))

export const statusRelations = relations(status, ({ many }) => ({
  jobs: many(jobs),
}))

export type User = typeof users.$inferSelect
export type Job = typeof jobs.$inferSelect
export type Status = typeof status.$inferSelect
export type NewUser = typeof users.$inferInsert

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertJobSchema = createInsertSchema(jobs)
export const selectJobSchema = createSelectSchema(jobs)
