/**
 * Note Type Definitions with Zod Validation
 */

import { z } from 'zod'

// ============================================
// Note Schema
// ============================================

export const NoteSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string(), // Tiptap JSON or HTML content
    createdAt: z.date(),
    updatedAt: z.date(),
    tags: z.array(z.string()).nullable(),
    isPinned: z.boolean(),
})

export type Note = z.infer<typeof NoteSchema>

// ============================================
// DTOs
// ============================================

export const CreateNoteDtoSchema = z.object({
    projectId: z.string().uuid(),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().optional().default(''),
    tags: z.array(z.string()).optional(),
    isPinned: z.boolean().optional().default(false),
})

export type CreateNoteDto = z.infer<typeof CreateNoteDtoSchema>

export const UpdateNoteDtoSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().optional(),
    tags: z.array(z.string()).nullable().optional(),
    isPinned: z.boolean().optional(),
})

export type UpdateNoteDto = z.infer<typeof UpdateNoteDtoSchema>

// ============================================
// Query Filters
// ============================================

export const NoteFilterSchema = z.object({
    projectId: z.string().uuid(),
    isPinned: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    search: z.string().optional(),
})

export type NoteFilter = z.infer<typeof NoteFilterSchema>

// ============================================
// Utility Types
// ============================================

export interface NoteStats {
    total: number
    pinned: number
    recentlyModified: number
}

// ============================================
// Tiptap Content Types
// ============================================

export interface TiptapContent {
    type: 'doc'
    content: TiptapNode[]
}

export interface TiptapNode {
    type: string
    attrs?: Record<string, any>
    content?: TiptapNode[]
    marks?: TiptapMark[]
    text?: string
}

export interface TiptapMark {
    type: string
    attrs?: Record<string, any>
}

// ============================================
// Note Template
// ============================================

export interface NoteTemplate {
    id: string
    name: string
    description: string
    content: string // Template content (Tiptap JSON)
    tags: string[]
}

export const builtInNoteTemplates: NoteTemplate[] = [
    {
        id: 'blank',
        name: 'Blank Note',
        description: 'Start with an empty note',
        content: '{"type":"doc","content":[{"type":"paragraph"}]}',
        tags: [],
    },
    {
        id: 'meeting',
        name: 'Meeting Notes',
        description: 'Template for meeting notes',
        content: JSON.stringify({
            type: 'doc',
            content: [
                { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Meeting Notes' }] },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Attendees' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Agenda' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Action Items' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
            ],
        }),
        tags: ['meeting'],
    },
    {
        id: 'literature-review',
        name: 'Literature Review',
        description: 'Template for reviewing papers',
        content: JSON.stringify({
            type: 'doc',
            content: [
                { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Paper Title' }] },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Citation' }] },
                { type: 'paragraph' },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Summary' }] },
                { type: 'paragraph' },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Key Findings' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Methodology' }] },
                { type: 'paragraph' },
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Relevance to My Research' }] },
                { type: 'paragraph' },
            ],
        }),
        tags: ['literature', 'paper'],
    },
]
