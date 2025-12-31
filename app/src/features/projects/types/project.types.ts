/**
 * Project Type Definitions with Zod Validation
 */

import { z } from 'zod'

// ============================================
// Enums
// ============================================

export const ProjectStatus = z.enum(['active', 'archived', 'template'])
export type ProjectStatus = z.infer<typeof ProjectStatus>

// ============================================
// Project Schema
// ============================================

export const ProjectSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    description: z.string().nullish(),
    path: z.string().min(1, 'Path is required'),
    status: ProjectStatus,
    color: z.string().nullish(), // Hex color for project tile accent
    createdAt: z.date(),
    lastModifiedAt: z.date(),
    tags: z.array(z.string()).nullish(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
})

export type Project = z.infer<typeof ProjectSchema>

// Theme-compatible preset colors for project tiles
export const PROJECT_COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Amber', value: '#d97706' },
] as const

// ============================================
// DTOs
// ============================================

export const CreateProjectDtoSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    description: z.string().optional(),
    path: z.string().min(1, 'Path is required'),
    template: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>

export const UpdateProjectDtoSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().nullable().optional(),
    status: ProjectStatus.optional(),
    color: z.string().nullable().optional(), // Hex color
    tags: z.array(z.string()).nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>

// ============================================
// Project Metadata (research.json)
// ============================================

export const ProjectMemberSchema = z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.string().email().optional(),
    affiliation: z.string().optional(),
})

export type ProjectMember = z.infer<typeof ProjectMemberSchema>

export const ResearchMetadataSchema = z.object({
    version: z.string().default('1.0.0'),
    title: z.string().min(1),
    description: z.string().optional(),
    members: z.array(ProjectMemberSchema).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    tags: z.array(z.string()).default([]),
    settings: z.object({
        auto_commit: z.boolean().default(true),
        auto_commit_interval: z.number().int().positive().default(30),
        backup_enabled: z.boolean().default(true),
    }),
    statistics: z.object({
        total_files: z.number().int().nonnegative().default(0),
        total_commits: z.number().int().nonnegative().default(0),
        total_tasks: z.number().int().nonnegative().default(0),
        total_notes: z.number().int().nonnegative().default(0),
    }),
})

export type ResearchMetadata = z.infer<typeof ResearchMetadataSchema>

// ============================================
// Query Filters
// ============================================

export const ProjectFilterSchema = z.object({
    status: ProjectStatus.optional(),
    tags: z.array(z.string()).optional(),
    search: z.string().optional(),
})

export type ProjectFilter = z.infer<typeof ProjectFilterSchema>

// ============================================
// Utility Types
// ============================================

export interface ProjectStats {
    total: number
    active: number
    archived: number
    templates: number
}

// ============================================
// Project Templates
// ============================================

export interface ProjectTemplate {
    id: string
    name: string
    description: string
    folders: string[]
    defaultTags: string[]
    defaultNotes: { title: string; template: string }[]
}

export const builtInProjectTemplates: ProjectTemplate[] = [
    {
        id: 'literature-review',
        name: 'Literature Review',
        description: 'Template for conducting systematic literature reviews',
        folders: ['papers', 'notes', 'summaries', 'bibliography'],
        defaultTags: ['literature', 'review'],
        defaultNotes: [
            { title: 'Search Strategy', template: 'literature-review' },
            { title: 'Inclusion Criteria', template: 'blank' },
        ],
    },
    {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'Template for data analysis projects',
        folders: ['data/raw', 'data/processed', 'notebooks', 'reports', 'figures'],
        defaultTags: ['data', 'analysis'],
        defaultNotes: [
            { title: 'Data Dictionary', template: 'blank' },
            { title: 'Analysis Plan', template: 'blank' },
        ],
    },
    {
        id: 'thesis',
        name: 'Thesis/Dissertation',
        description: 'Template for thesis or dissertation writing',
        folders: ['chapters', 'references', 'figures', 'appendices', 'drafts'],
        defaultTags: ['thesis', 'writing'],
        defaultNotes: [
            { title: 'Outline', template: 'blank' },
            { title: 'Timeline', template: 'blank' },
        ],
    },
    {
        id: 'grant-proposal',
        name: 'Grant Proposal',
        description: 'Template for grant proposal preparation',
        folders: ['drafts', 'budget', 'supporting-docs', 'references'],
        defaultTags: ['grant', 'proposal'],
        defaultNotes: [
            { title: 'Specific Aims', template: 'blank' },
            { title: 'Budget Justification', template: 'blank' },
        ],
    },
    {
        id: 'lab-experiment',
        name: 'Lab Experiment',
        description: 'Template for laboratory experiments',
        folders: ['protocols', 'data', 'analysis', 'reports', 'media'],
        defaultTags: ['lab', 'experiment'],
        defaultNotes: [
            { title: 'Protocol', template: 'blank' },
            { title: 'Lab Notebook', template: 'blank' },
        ],
    },
]
