import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { projects } from './projects.schema'

/**
 * Notes table schema
 * 
 * Stores rich text notes with Tiptap content
 */
export const notes = sqliteTable('notes', {
    id: text('id').primaryKey(),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    content: text('content').notNull(), // Tiptap JSON or HTML
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    tags: text('tags', { mode: 'json' }).$type<string[]>(),
    isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
})

export type Note = typeof notes.$inferSelect
export type InsertNote = typeof notes.$inferInsert
