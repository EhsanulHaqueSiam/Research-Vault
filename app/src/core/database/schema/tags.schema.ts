import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'
import { projects } from './projects.schema'
import { tasks } from './tasks.schema'
import { notes } from './notes.schema'

/**
 * Tags table schema
 * 
 * Centralized tag management system
 */
export const tags = sqliteTable('tags', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    color: text('color'), // Hex color code for UI
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

/**
 * Project-Tag Junction Table
 * 
 * Many-to-many relationship between projects and tags
 */
export const projectTags = sqliteTable('project_tags', {
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
        .notNull()
        .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.projectId, table.tagId] }),
    }
})

/**
 * Task-Tag Junction Table
 * 
 * Many-to-many relationship between tasks and tags
 */
export const taskTags = sqliteTable('task_tags', {
    taskId: text('task_id')
        .notNull()
        .references(() => tasks.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
        .notNull()
        .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.taskId, table.tagId] }),
    }
})

/**
 * Note-Tag Junction Table
 * 
 * Many-to-many relationship between notes and tags
 */
export const noteTags = sqliteTable('note_tags', {
    noteId: text('note_id')
        .notNull()
        .references(() => notes.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
        .notNull()
        .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.noteId, table.tagId] }),
    }
})

export type Tag = typeof tags.$inferSelect
export type InsertTag = typeof tags.$inferInsert

export type ProjectTag = typeof projectTags.$inferSelect
export type InsertProjectTag = typeof projectTags.$inferInsert

export type TaskTag = typeof taskTags.$inferSelect
export type InsertTaskTag = typeof taskTags.$inferInsert

export type NoteTag = typeof noteTags.$inferSelect
export type InsertNoteTag = typeof noteTags.$inferInsert
