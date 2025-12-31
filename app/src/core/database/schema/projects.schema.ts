import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

/**
 * Projects table schema
 * 
 * Stores research project metadata and configuration
 */
export const projects = sqliteTable('projects', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    path: text('path').notNull().unique(),
    description: text('description'),
    status: text('status', {
        enum: ['active', 'archived', 'template']
    }).notNull().default('active'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    lastModifiedAt: integer('last_modified_at', { mode: 'timestamp' }).notNull(),
    tags: text('tags', { mode: 'json' }).$type<string[]>(),
    metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
})

export type Project = typeof projects.$inferSelect
export type InsertProject = typeof projects.$inferInsert
