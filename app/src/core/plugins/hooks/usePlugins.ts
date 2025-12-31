/**
 * Plugin Hooks
 * 
 * React hooks for consuming plugin-provided functionality
 */

import { usePluginRegistry } from '../stores'

/**
 * Get all sidebar panel plugins
 */
export function useSidebarPlugins() {
    const getSidebarHooks = usePluginRegistry((state) => state.getSidebarHooks)
    return getSidebarHooks()
}

/**
 * Get all toolbar action plugins
 */
export function useToolbarPlugins() {
    const getToolbarHooks = usePluginRegistry((state) => state.getToolbarHooks)
    return getToolbarHooks()
}

/**
 * Get all project template plugins
 */
export function useProjectTemplatePlugins() {
    const getProjectTemplateHooks = usePluginRegistry((state) => state.getProjectTemplateHooks)
    return getProjectTemplateHooks()
}

/**
 * Get all note template plugins
 */
export function useNoteTemplatePlugins() {
    const getNoteTemplateHooks = usePluginRegistry((state) => state.getNoteTemplateHooks)
    return getNoteTemplateHooks()
}

/**
 * Get all export format plugins
 */
export function useExportFormatPlugins() {
    const getExportFormatHooks = usePluginRegistry((state) => state.getExportFormatHooks)
    return getExportFormatHooks()
}

/**
 * Get all search provider plugins
 */
export function useSearchProviderPlugins() {
    const getSearchProviderHooks = usePluginRegistry((state) => state.getSearchProviderHooks)
    return getSearchProviderHooks()
}

/**
 * Get all editor extension plugins
 */
export function useEditorExtensionPlugins() {
    const getEditorExtensionHooks = usePluginRegistry((state) => state.getEditorExtensionHooks)
    return getEditorExtensionHooks()
}

/**
 * Get all plugins for registry UI
 */
export function useAllPlugins() {
    const getAllPlugins = usePluginRegistry((state) => state.getAllPlugins)
    return getAllPlugins()
}

/**
 * Get enabled plugins
 */
export function useEnabledPlugins() {
    const getEnabledPlugins = usePluginRegistry((state) => state.getEnabledPlugins)
    return getEnabledPlugins()
}

/**
 * Plugin management actions
 */
export function usePluginActions() {
    const enablePlugin = usePluginRegistry((state) => state.enablePlugin)
    const disablePlugin = usePluginRegistry((state) => state.disablePlugin)
    const uninstallPlugin = usePluginRegistry((state) => state.uninstallPlugin)

    return {
        enablePlugin,
        disablePlugin,
        uninstallPlugin,
    }
}
