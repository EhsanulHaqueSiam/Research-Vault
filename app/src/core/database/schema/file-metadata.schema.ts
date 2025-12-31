import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { projects } from './projects.schema'

/**
 * File Metadata table schema
 * 
 * Tracks files within research projects for Git integration and search
 */
export const fileMetadata = sqliteTable('file_metadata', {
    id: text('id').primaryKey(),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),

    // File information
    relativePath: text('relative_path').notNull(), // Path relative to project root
    fileName: text('file_name').notNull(),
    fileExtension: text('file_extension'),
    fileSize: integer('file_size'), // Size in bytes
    mimeType: text('mime_type'),

    // Git tracking
    gitHash: text('git_hash'), // Git blob hash
    lastCommitHash: text('last_commit_hash'), // Last commit that modified this file

    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    modifiedAt: integer('modified_at', { mode: 'timestamp' }).notNull(),
    lastIndexedAt: integer('last_indexed_at', { mode: 'timestamp' }),

    // Search optimization
    content: text('content'), // Extracted text content for full-text search
    metadata: text('metadata', { mode: 'json' }).$type<Record<string, any>>(), // Additional file-specific metadata

    // Status
    isDeleted: integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
    isIgnored: integer('is_ignored', { mode: 'boolean' }).notNull().default(false), // Respect .gitignore
})

export type FileMetadata = typeof fileMetadata.$inferSelect
export type InsertFileMetadata = typeof fileMetadata.$inferInsert
