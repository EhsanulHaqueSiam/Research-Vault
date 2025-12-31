import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { projects } from './projects.schema'

/**
 * Tasks table schema
 * 
 * Supports hierarchical tasks with parent-child relationships
 */
export const tasks = sqliteTable('tasks', {
    id: text('id').primaryKey(),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'), // Self-reference handled separately
    title: text('title').notNull(),
    description: text('description'),
    status: text('status', {
        enum: ['todo', 'in_progress', 'done']
    }).notNull().default('todo'),
    priority: text('priority', {
        enum: ['low', 'medium', 'high']
    }).notNull().default('medium'),
    dueDate: integer('due_date', { mode: 'timestamp' }),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    order: integer('order').notNull().default(0),
    tags: text('tags', { mode: 'json' }).$type<string[]>(),
})

export type Task = typeof tasks.$inferSelect
export type InsertTask = typeof tasks.$inferInsert
