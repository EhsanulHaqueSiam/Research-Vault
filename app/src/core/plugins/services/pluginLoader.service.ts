/**
 * Plugin Loader Service
 * 
 * Handles plugin discovery, loading, and lifecycle management
 */

import type {
    Plugin,
    PluginManifest,
    PluginModule,
    PluginContext,
    PluginStorage,
    PluginLogger,
} from '../types'
import { PluginManifestSchema } from '../types'
import { usePluginRegistry } from '../stores'
import { toast } from 'sonner'

// ============================================
// Plugin Context Factory
// ============================================

function createPluginContext(pluginId: string): PluginContext {
    const registry = usePluginRegistry.getState()

    // Plugin-scoped storage
    const storage: PluginStorage = {
        async get<T>(key: string): Promise<T | null> {
            const settings = registry.getPluginSettings(pluginId)
            return (settings?.[key] as T) ?? null
        },
        async set<T>(key: string, value: T): Promise<void> {
            const current = registry.getPluginSettings(pluginId) ?? {}
            registry.setPluginSettings(pluginId, { ...current, [key]: value })
        },
        async delete(key: string): Promise<void> {
            const current = registry.getPluginSettings(pluginId) ?? {}
            const { [key]: _, ...rest } = current
            registry.setPluginSettings(pluginId, rest)
        },
        async clear(): Promise<void> {
            registry.setPluginSettings(pluginId, {})
        },
    }

    // Plugin-scoped logger
    const log: PluginLogger = {
        debug: (msg, ...args) => console.debug(`[Plugin:${pluginId}]`, msg, ...args),
        info: (msg, ...args) => console.info(`[Plugin:${pluginId}]`, msg, ...args),
        warn: (msg, ...args) => console.warn(`[Plugin:${pluginId}]`, msg, ...args),
        error: (msg, ...args) => console.error(`[Plugin:${pluginId}]`, msg, ...args),
    }

    // Notification helper
    const notify = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        toast[type](message)
    }

    // Hook registration (using specific methods)
    const registerHook = (type: string, handler: { id: string }) => {
        const reg = usePluginRegistry.getState()
        // Route to specific registration method based on type
        switch (type) {
            case 'sidebar':
                reg.registerSidebarHook(pluginId, handler as any)
                break
            case 'toolbar':
                reg.registerToolbarHook(pluginId, handler as any)
                break
            case 'projectTemplate':
                reg.registerProjectTemplateHook(pluginId, handler as any)
                break
            case 'noteTemplate':
                reg.registerNoteTemplateHook(pluginId, handler as any)
                break
            case 'exportFormat':
                reg.registerExportFormatHook(pluginId, handler as any)
                break
            case 'searchProvider':
                reg.registerSearchProviderHook(pluginId, handler as any)
                break
            case 'editorExtension':
                reg.registerEditorExtensionHook(pluginId, handler as any)
                break
        }
    }

    const unregisterHook = (type: string, handlerId: string) => {
        const hookType = type as 'sidebar' | 'toolbar' | 'projectTemplate' | 'noteTemplate' | 'exportFormat' | 'searchProvider' | 'editorExtension'
        usePluginRegistry.getState().unregisterHook(hookType, `${pluginId}:${handlerId}`)
    }

    return {
        storage,
        log,
        notify,
        registerHook: registerHook as PluginContext['registerHook'],
        unregisterHook: unregisterHook as PluginContext['unregisterHook'],
    }
}

// ============================================
// Plugin Loader Service
// ============================================

class PluginLoaderService {
    private loadedPlugins: Map<string, Plugin> = new Map()

    /**
     * Validate a plugin manifest
     */
    validateManifest(manifest: unknown): PluginManifest {
        return PluginManifestSchema.parse(manifest)
    }

    /**
     * Install a plugin from manifest
     */
    async installPlugin(manifest: PluginManifest): Promise<void> {
        const registry = usePluginRegistry.getState()

        // Check if already installed
        if (registry.getPlugin(manifest.id)) {
            throw new Error(`Plugin '${manifest.id}' is already installed`)
        }

        // Validate manifest
        const validatedManifest = this.validateManifest(manifest)

        // Add to registry
        registry.installPlugin(validatedManifest)

        console.info(`[PluginLoader] Installed plugin: ${manifest.id}`)
    }

    /**
     * Uninstall a plugin
     */
    async uninstallPlugin(pluginId: string): Promise<void> {
        // Deactivate if active
        if (this.loadedPlugins.has(pluginId)) {
            await this.deactivatePlugin(pluginId)
        }

        // Remove from registry
        const registry = usePluginRegistry.getState()
        registry.uninstallPlugin(pluginId)

        console.info(`[PluginLoader] Uninstalled plugin: ${pluginId}`)
    }

    /**
     * Activate a plugin
     */
    async activatePlugin(pluginId: string, module: PluginModule): Promise<void> {
        const registry = usePluginRegistry.getState()
        const entry = registry.getPlugin(pluginId)

        if (!entry) {
            throw new Error(`Plugin '${pluginId}' is not installed`)
        }

        try {
            // Create context
            const context = createPluginContext(pluginId)

            // Activate plugin
            await module.activate(context)

            // Store loaded plugin
            this.loadedPlugins.set(pluginId, {
                id: pluginId,
                manifest: entry.manifest,
                status: 'enabled',
                activate: async () => module.activate(context),
                deactivate: module.deactivate,
            })

            // Update registry
            registry.enablePlugin(pluginId)

            console.info(`[PluginLoader] Activated plugin: ${pluginId}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            registry.setPluginStatus(pluginId, 'error', message)
            console.error(`[PluginLoader] Failed to activate plugin ${pluginId}:`, error)
            throw error
        }
    }

    /**
     * Deactivate a plugin
     */
    async deactivatePlugin(pluginId: string): Promise<void> {
        const plugin = this.loadedPlugins.get(pluginId)

        if (!plugin) {
            console.warn(`[PluginLoader] Plugin '${pluginId}' is not loaded`)
            return
        }

        try {
            // Call deactivate
            await plugin.deactivate()

            // Remove from loaded
            this.loadedPlugins.delete(pluginId)

            // Update registry
            const registry = usePluginRegistry.getState()
            registry.disablePlugin(pluginId)

            console.info(`[PluginLoader] Deactivated plugin: ${pluginId}`)
        } catch (error) {
            console.error(`[PluginLoader] Error deactivating plugin ${pluginId}:`, error)
            throw error
        }
    }

    /**
     * Get loaded plugin
     */
    getLoadedPlugin(pluginId: string): Plugin | undefined {
        return this.loadedPlugins.get(pluginId)
    }

    /**
     * Get all loaded plugins
     */
    getAllLoadedPlugins(): Plugin[] {
        return Array.from(this.loadedPlugins.values())
    }

    /**
     * Check if plugin is loaded
     */
    isPluginLoaded(pluginId: string): boolean {
        return this.loadedPlugins.has(pluginId)
    }
}

// Singleton instance
export const pluginLoader = new PluginLoaderService()
