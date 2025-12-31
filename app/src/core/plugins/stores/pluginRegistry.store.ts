/**
 * Plugin Registry Store
 * 
 * Zustand store for managing installed plugins and their state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
    PluginManifest,
    PluginStatus,
    PluginRegistryEntry,
    SidebarPanelHook,
    ToolbarActionHook,
    ProjectTemplateHook,
    NoteTemplateHook,
    ExportFormatHook,
    SearchProviderHook,
    EditorExtensionHook,
} from '../types'

// ============================================
// Hook Registrations Type
// ============================================

// Generic hook with id property
interface BaseHook {
    id: string
}

type HookMap<T extends BaseHook> = Map<string, T>

interface HookRegistrations {
    sidebar: HookMap<SidebarPanelHook>
    toolbar: HookMap<ToolbarActionHook>
    projectTemplate: HookMap<ProjectTemplateHook>
    noteTemplate: HookMap<NoteTemplateHook>
    exportFormat: HookMap<ExportFormatHook>
    searchProvider: HookMap<SearchProviderHook>
    editorExtension: HookMap<EditorExtensionHook>
}

type HookType = keyof HookRegistrations

// ============================================
// Store State
// ============================================

interface PluginRegistryState {
    // Plugin registry
    plugins: Record<string, PluginRegistryEntry>

    // Hook registrations (not persisted)
    hooks: HookRegistrations

    // Plugin settings storage
    pluginSettings: Record<string, Record<string, unknown>>

    // Actions
    installPlugin: (manifest: PluginManifest) => void
    uninstallPlugin: (pluginId: string) => void
    enablePlugin: (pluginId: string) => void
    disablePlugin: (pluginId: string) => void
    setPluginStatus: (pluginId: string, status: PluginStatus, error?: string) => void

    // Hook management (simplified)
    registerSidebarHook: (pluginId: string, hook: SidebarPanelHook) => void
    registerToolbarHook: (pluginId: string, hook: ToolbarActionHook) => void
    registerProjectTemplateHook: (pluginId: string, hook: ProjectTemplateHook) => void
    registerNoteTemplateHook: (pluginId: string, hook: NoteTemplateHook) => void
    registerExportFormatHook: (pluginId: string, hook: ExportFormatHook) => void
    registerSearchProviderHook: (pluginId: string, hook: SearchProviderHook) => void
    registerEditorExtensionHook: (pluginId: string, hook: EditorExtensionHook) => void

    unregisterHook: (type: HookType, key: string) => void
    unregisterAllPluginHooks: (pluginId: string) => void

    // Hook getters
    getSidebarHooks: () => SidebarPanelHook[]
    getToolbarHooks: () => ToolbarActionHook[]
    getProjectTemplateHooks: () => ProjectTemplateHook[]
    getNoteTemplateHooks: () => NoteTemplateHook[]
    getExportFormatHooks: () => ExportFormatHook[]
    getSearchProviderHooks: () => SearchProviderHook[]
    getEditorExtensionHooks: () => EditorExtensionHook[]

    // Settings
    getPluginSettings: (pluginId: string) => Record<string, unknown> | null
    setPluginSettings: (pluginId: string, settings: Record<string, unknown>) => void

    // Queries
    getPlugin: (pluginId: string) => PluginRegistryEntry | undefined
    getEnabledPlugins: () => PluginRegistryEntry[]
    getAllPlugins: () => PluginRegistryEntry[]
}

// ============================================
// Initial Hook Registrations
// ============================================

const createEmptyHooks = (): HookRegistrations => ({
    sidebar: new Map(),
    toolbar: new Map(),
    projectTemplate: new Map(),
    noteTemplate: new Map(),
    exportFormat: new Map(),
    searchProvider: new Map(),
    editorExtension: new Map(),
})

// ============================================
// Store
// ============================================

export const usePluginRegistry = create<PluginRegistryState>()(
    persist(
        (set, get) => ({
            plugins: {},
            hooks: createEmptyHooks(),
            pluginSettings: {},

            // Install a new plugin
            installPlugin: (manifest) => {
                set((state) => ({
                    plugins: {
                        ...state.plugins,
                        [manifest.id]: {
                            manifest,
                            status: 'installed',
                            enabled: false,
                            installedAt: new Date(),
                            updatedAt: new Date(),
                        },
                    },
                }))
            },

            // Uninstall a plugin
            uninstallPlugin: (pluginId) => {
                get().unregisterAllPluginHooks(pluginId)
                set((state) => {
                    const { [pluginId]: _, ...remainingPlugins } = state.plugins
                    const { [pluginId]: __, ...remainingSettings } = state.pluginSettings
                    return {
                        plugins: remainingPlugins,
                        pluginSettings: remainingSettings,
                    }
                })
            },

            // Enable a plugin
            enablePlugin: (pluginId) => {
                set((state) => ({
                    plugins: {
                        ...state.plugins,
                        [pluginId]: {
                            ...state.plugins[pluginId],
                            enabled: true,
                            status: 'enabled',
                            updatedAt: new Date(),
                        },
                    },
                }))
            },

            // Disable a plugin
            disablePlugin: (pluginId) => {
                get().unregisterAllPluginHooks(pluginId)
                set((state) => ({
                    plugins: {
                        ...state.plugins,
                        [pluginId]: {
                            ...state.plugins[pluginId],
                            enabled: false,
                            status: 'disabled',
                            updatedAt: new Date(),
                        },
                    },
                }))
            },

            // Set plugin status
            setPluginStatus: (pluginId, status, error) => {
                set((state) => ({
                    plugins: {
                        ...state.plugins,
                        [pluginId]: {
                            ...state.plugins[pluginId],
                            status,
                            error,
                            updatedAt: new Date(),
                        },
                    },
                }))
            },

            // Individual hook registration methods
            registerSidebarHook: (pluginId, hook) => {
                set((state) => {
                    const newMap = new Map(state.hooks.sidebar)
                    newMap.set(`${pluginId}:${hook.id}`, hook)
                    return { hooks: { ...state.hooks, sidebar: newMap } }
                })
            },

            registerToolbarHook: (pluginId, hook) => {
                set((state) => {
                    const newMap = new Map(state.hooks.toolbar)
                    newMap.set(`${pluginId}:${hook.id}`, hook)
                    return { hooks: { ...state.hooks, toolbar: newMap } }
                })
            },

            registerProjectTemplateHook: (pluginId, hook) => {
                set((state) => {
                    const newMap = new Map(state.hooks.projectTemplate)
                    newMap.set(`${pluginId}:${hook.id}`, hook)
                    return { hooks: { ...state.hooks, projectTemplate: newMap } }
                })
            },

            registerNoteTemplateHook: (pluginId, hook) => {
                set((state) => {
                    const newMap = new Map(state.hooks.noteTemplate)
                    newMap.set(`${pluginId}:${hook.id}`, hook)
                    return { hooks: { ...state.hooks, noteTemplate: newMap } }
                })
            },

            registerExportFormatHook: (pluginId, hook) => {
                set((state) => {
                    const newMap = new Map(state.hooks.exportFormat)
                    newMap.set(`${pluginId}:${hook.id}`, hook)
                    return { hooks: { ...state.hooks, exportFormat: newMap } }
                })
            },

            registerSearchProviderHook: (pluginId, hook) => {
                set((state) => {
                    const newMap = new Map(state.hooks.searchProvider)
                    newMap.set(`${pluginId}:${hook.id}`, hook)
                    return { hooks: { ...state.hooks, searchProvider: newMap } }
                })
            },

            registerEditorExtensionHook: (pluginId, hook) => {
                set((state) => {
                    const newMap = new Map(state.hooks.editorExtension)
                    newMap.set(`${pluginId}:${hook.id}`, hook)
                    return { hooks: { ...state.hooks, editorExtension: newMap } }
                })
            },

            // Unregister a specific hook by type and key
            unregisterHook: (type, key) => {
                set((state) => {
                    switch (type) {
                        case 'sidebar': {
                            const newMap = new Map(state.hooks.sidebar)
                            newMap.delete(key)
                            return { hooks: { ...state.hooks, sidebar: newMap } }
                        }
                        case 'toolbar': {
                            const newMap = new Map(state.hooks.toolbar)
                            newMap.delete(key)
                            return { hooks: { ...state.hooks, toolbar: newMap } }
                        }
                        case 'projectTemplate': {
                            const newMap = new Map(state.hooks.projectTemplate)
                            newMap.delete(key)
                            return { hooks: { ...state.hooks, projectTemplate: newMap } }
                        }
                        case 'noteTemplate': {
                            const newMap = new Map(state.hooks.noteTemplate)
                            newMap.delete(key)
                            return { hooks: { ...state.hooks, noteTemplate: newMap } }
                        }
                        case 'exportFormat': {
                            const newMap = new Map(state.hooks.exportFormat)
                            newMap.delete(key)
                            return { hooks: { ...state.hooks, exportFormat: newMap } }
                        }
                        case 'searchProvider': {
                            const newMap = new Map(state.hooks.searchProvider)
                            newMap.delete(key)
                            return { hooks: { ...state.hooks, searchProvider: newMap } }
                        }
                        case 'editorExtension': {
                            const newMap = new Map(state.hooks.editorExtension)
                            newMap.delete(key)
                            return { hooks: { ...state.hooks, editorExtension: newMap } }
                        }
                        default:
                            return state
                    }
                })
            },

            // Unregister all hooks for a plugin
            unregisterAllPluginHooks: (pluginId) => {
                const filterMap = <T extends BaseHook>(m: Map<string, T>): Map<string, T> => {
                    const result = new Map<string, T>()
                    for (const [k, v] of m) {
                        if (!k.startsWith(`${pluginId}:`)) result.set(k, v)
                    }
                    return result
                }

                set((state) => ({
                    hooks: {
                        sidebar: filterMap(state.hooks.sidebar),
                        toolbar: filterMap(state.hooks.toolbar),
                        projectTemplate: filterMap(state.hooks.projectTemplate),
                        noteTemplate: filterMap(state.hooks.noteTemplate),
                        exportFormat: filterMap(state.hooks.exportFormat),
                        searchProvider: filterMap(state.hooks.searchProvider),
                        editorExtension: filterMap(state.hooks.editorExtension),
                    }
                }))
            },

            // Hook getters
            getSidebarHooks: () => Array.from(get().hooks.sidebar.values()),
            getToolbarHooks: () => Array.from(get().hooks.toolbar.values()),
            getProjectTemplateHooks: () => Array.from(get().hooks.projectTemplate.values()),
            getNoteTemplateHooks: () => Array.from(get().hooks.noteTemplate.values()),
            getExportFormatHooks: () => Array.from(get().hooks.exportFormat.values()),
            getSearchProviderHooks: () => Array.from(get().hooks.searchProvider.values()),
            getEditorExtensionHooks: () => Array.from(get().hooks.editorExtension.values()),

            // Plugin settings
            getPluginSettings: (pluginId: string) => {
                return get().pluginSettings[pluginId] ?? null
            },

            setPluginSettings: (pluginId, settings) => {
                set((state) => ({
                    pluginSettings: {
                        ...state.pluginSettings,
                        [pluginId]: settings,
                    },
                }))
            },

            // Queries
            getPlugin: (pluginId) => get().plugins[pluginId],
            getEnabledPlugins: () => Object.values(get().plugins).filter(p => p.enabled),
            getAllPlugins: () => Object.values(get().plugins),
        }),
        {
            name: 'plugin-registry',
            // Don't persist hook registrations (they're rebuilt on load)
            partialize: (state) => ({
                plugins: state.plugins,
                pluginSettings: state.pluginSettings,
            }),
        }
    )
)
