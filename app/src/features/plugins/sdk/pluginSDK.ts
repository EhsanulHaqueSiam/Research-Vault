/**
 * Plugin SDK
 * 
 * Utilities and helpers for plugin development
 */

import type {
    PluginManifest,
    PluginContext,
    SidebarPanelHook,
    ToolbarActionHook,
    ProjectTemplateHook,
    NoteTemplateHook,
} from '@/core/plugins/types'

// ============================================
// Plugin Lifecycle Type
// ============================================

export interface PluginLifecycle {
    onActivate: (context: PluginContext) => Promise<void>
    onDeactivate: () => Promise<void>
}

// ============================================
// Plugin Builder
// ============================================

export interface PluginBuilder {
    manifest: PluginManifest
    lifecycle: PluginLifecycle
}

/**
 * Create a new plugin with manifest and lifecycle
 */
export function createPlugin(config: {
    id: string
    name: string
    version: string
    description: string
    author: string
}): PluginBuilder {
    return {
        manifest: {
            id: config.id,
            name: config.name,
            version: config.version,
            description: config.description,
            author: { name: config.author },
            main: 'index.js',
            permissions: [],
            hooks: [],
        },
        lifecycle: {
            onActivate: async () => { },
            onDeactivate: async () => { },
        },
    }
}

/**
 * Plugin builder with fluent API
 */
export class PluginSDK {
    private manifest: PluginManifest
    private _lifecycle: PluginLifecycle
    private _hooks: {
        sidebar?: SidebarPanelHook[]
        toolbar?: ToolbarActionHook[]
        projectTemplate?: ProjectTemplateHook[]
        noteTemplate?: NoteTemplateHook[]
    } = {}

    constructor(id: string, name: string, version: string) {
        this.manifest = {
            id,
            name,
            version,
            description: '',
            author: { name: '' },
            main: 'index.js',
            permissions: [],
            hooks: [],
        }
        this._lifecycle = {
            onActivate: async () => { },
            onDeactivate: async () => { },
        }
    }

    description(desc: string): this {
        this.manifest.description = desc
        return this
    }

    author(name: string): this {
        this.manifest.author = { name }
        return this
    }

    homepage(url: string): this {
        this.manifest.homepage = url
        return this
    }

    icon(icon: string): this {
        this.manifest.icon = icon
        return this
    }

    addSidebarPanel(hook: SidebarPanelHook): this {
        if (!this.manifest.hooks.includes('sidebar')) {
            this.manifest.hooks.push('sidebar')
        }
        if (!this._hooks.sidebar) this._hooks.sidebar = []
        this._hooks.sidebar.push(hook)
        return this
    }

    addToolbarAction(hook: ToolbarActionHook): this {
        if (!this.manifest.hooks.includes('toolbar')) {
            this.manifest.hooks.push('toolbar')
        }
        if (!this._hooks.toolbar) this._hooks.toolbar = []
        this._hooks.toolbar.push(hook)
        return this
    }

    onActivate(handler: (context: PluginContext) => Promise<void>): this {
        this._lifecycle.onActivate = handler
        return this
    }

    onDeactivate(handler: () => Promise<void>): this {
        this._lifecycle.onDeactivate = handler
        return this
    }

    build(): { manifest: PluginManifest; lifecycle: PluginLifecycle; hooks: { sidebar?: SidebarPanelHook[], toolbar?: ToolbarActionHook[], projectTemplate?: ProjectTemplateHook[], noteTemplate?: NoteTemplateHook[] } } {
        return {
            manifest: this.manifest,
            lifecycle: this._lifecycle,
            hooks: this._hooks,
        }
    }
}

// ============================================
// Helper Functions
// ============================================

export function generatePluginId(name: string): string {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `plugin-${slug}-${Date.now().toString(36)}`
}

export function validateManifest(manifest: unknown): manifest is PluginManifest {
    if (!manifest || typeof manifest !== 'object') return false
    const m = manifest as Record<string, unknown>
    return (
        typeof m.id === 'string' &&
        typeof m.name === 'string' &&
        typeof m.version === 'string'
    )
}

// ============================================
// Plugin Template
// ============================================

export const PLUGIN_TEMPLATE = `
import { PluginSDK } from '@/features/plugins/sdk'

const myPlugin = new PluginSDK('my-plugin', 'My Plugin', '1.0.0')
    .description('A sample plugin')
    .author('Your Name')
    .icon('🔌')
    .addToolbarAction({
        id: 'my-action',
        title: 'My Action',
        icon: '🎯',
        onClick: () => console.log('Action triggered!'),
    })
    .onActivate(async (context) => {
        console.log('Plugin activated!', context)
    })
    .build()

export default myPlugin
`
