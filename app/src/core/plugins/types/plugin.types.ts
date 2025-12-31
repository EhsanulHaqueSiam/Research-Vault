/**
 * Plugin Type Definitions
 * 
 * Core types and interfaces for the plugin architecture
 */

import { z } from 'zod'

// ============================================
// Plugin Permissions
// ============================================

export const PluginPermissions = [
    'filesystem:read',
    'filesystem:write',
    'network:fetch',
    'database:read',
    'database:write',
    'ui:sidebar',
    'ui:toolbar',
    'ui:dialog',
    'editor:extension',
    'project:template',
    'task:type',
    'note:template',
    'export:format',
    'search:provider',
] as const

export type PluginPermission = typeof PluginPermissions[number]

// ============================================
// Plugin Hook Types
// ============================================

export const PluginHookTypes = [
    'sidebar',
    'toolbar',
    'projectTemplate',
    'taskType',
    'noteTemplate',
    'exportFormat',
    'searchProvider',
    'editorExtension',
] as const

export type PluginHookType = typeof PluginHookTypes[number]

// ============================================
// Plugin Manifest Schema
// ============================================

export const PluginManifestSchema = z.object({
    // Required fields
    id: z.string().regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric with dashes'),
    name: z.string().min(1).max(100),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver format'),
    description: z.string().max(500),

    // Author info
    author: z.object({
        name: z.string(),
        email: z.string().email().optional(),
        url: z.string().url().optional(),
    }),

    // Entry point
    main: z.string().default('index.js'),

    // Capabilities
    permissions: z.array(z.enum(PluginPermissions)).default([]),
    hooks: z.array(z.enum(PluginHookTypes)).default([]),

    // Optional metadata
    icon: z.string().optional(),
    homepage: z.string().url().optional(),
    repository: z.string().url().optional(),
    license: z.string().optional(),
    keywords: z.array(z.string()).optional(),

    // Engine compatibility
    engines: z.object({
        researchManager: z.string().optional(), // e.g., ">=1.0.0"
    }).optional(),
})

export type PluginManifest = z.infer<typeof PluginManifestSchema>

// ============================================
// Plugin Lifecycle
// ============================================

export type PluginStatus = 'installed' | 'enabled' | 'disabled' | 'error'

export interface PluginContext {
    /** Plugin's own storage */
    storage: PluginStorage
    /** Register a hook */
    registerHook: <T extends PluginHookType>(type: T, handler: PluginHookHandler<T>) => void
    /** Unregister a hook */
    unregisterHook: (type: PluginHookType, handlerId: string) => void
    /** Log messages */
    log: PluginLogger
    /** Show notifications */
    notify: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
}

export interface PluginStorage {
    get<T>(key: string): Promise<T | null>
    set<T>(key: string, value: T): Promise<void>
    delete(key: string): Promise<void>
    clear(): Promise<void>
}

export interface PluginLogger {
    debug: (message: string, ...args: unknown[]) => void
    info: (message: string, ...args: unknown[]) => void
    warn: (message: string, ...args: unknown[]) => void
    error: (message: string, ...args: unknown[]) => void
}

// ============================================
// Plugin Interface
// ============================================

export interface Plugin {
    /** Unique plugin ID */
    id: string
    /** Plugin manifest */
    manifest: PluginManifest
    /** Current status */
    status: PluginStatus
    /** Error message if status is 'error' */
    error?: string
    /** Activation function */
    activate: (context: PluginContext) => Promise<void>
    /** Deactivation function */
    deactivate: () => Promise<void>
}

export interface PluginModule {
    activate: (context: PluginContext) => Promise<void>
    deactivate: () => Promise<void>
}

// ============================================
// Plugin Hook Handlers
// ============================================

export interface SidebarPanelHook {
    id: string
    title: string
    icon: string
    component: React.ComponentType
    order?: number
}

export interface ToolbarActionHook {
    id: string
    title: string
    icon: string
    onClick: () => void
    isActive?: () => boolean
    order?: number
}

export interface ProjectTemplateHook {
    id: string
    name: string
    description: string
    icon: string
    create: () => Promise<void>
}

export interface NoteTemplateHook {
    id: string
    name: string
    description: string
    content: string
    tags: string[]
}

export interface ExportFormatHook {
    id: string
    name: string
    extension: string
    mimeType: string
    export: (content: string, title: string) => Promise<Blob | string>
}

export interface SearchProviderHook {
    id: string
    name: string
    search: (query: string) => Promise<SearchResult[]>
}

export interface SearchResult {
    id: string
    title: string
    description?: string
    type: string
    icon?: string
    onSelect: () => void
}

export interface EditorExtensionHook {
    id: string
    name: string
    extension: unknown // Tiptap Extension
}

// Hook handler type mapping
export type PluginHookHandler<T extends PluginHookType> =
    T extends 'sidebar' ? SidebarPanelHook :
    T extends 'toolbar' ? ToolbarActionHook :
    T extends 'projectTemplate' ? ProjectTemplateHook :
    T extends 'noteTemplate' ? NoteTemplateHook :
    T extends 'exportFormat' ? ExportFormatHook :
    T extends 'searchProvider' ? SearchProviderHook :
    T extends 'editorExtension' ? EditorExtensionHook :
    never

// ============================================
// Plugin Registry Entry
// ============================================

export interface PluginRegistryEntry {
    manifest: PluginManifest
    status: PluginStatus
    enabled: boolean
    error?: string
    installedAt: Date
    updatedAt: Date
}
