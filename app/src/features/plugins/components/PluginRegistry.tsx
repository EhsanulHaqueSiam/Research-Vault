/**
 * Plugin Registry Component
 * 
 * List view of all installed plugins with management
 */

import { useState, useMemo } from 'react'
import {
    Search,
    Puzzle,
    Plus,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { usePluginRegistry } from '@/core/plugins/stores/pluginRegistry.store'
import { PluginCard } from './PluginCard'

// ============================================
// Props
// ============================================

export interface PluginRegistryProps {
    onPluginSettings: (pluginId: string) => void
}

// ============================================
// Component
// ============================================

export function PluginRegistry({ onPluginSettings }: PluginRegistryProps) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all')

    const plugins = usePluginRegistry((state) => state.plugins)
    const enablePlugin = usePluginRegistry((state) => state.enablePlugin)
    const disablePlugin = usePluginRegistry((state) => state.disablePlugin)

    const pluginList = useMemo(() => {
        let list = Object.values(plugins)

        // Search filter
        if (search) {
            const lower = search.toLowerCase()
            list = list.filter(p =>
                p.manifest.name.toLowerCase().includes(lower) ||
                p.manifest.description?.toLowerCase().includes(lower)
            )
        }

        // Status filter
        if (filter === 'enabled') {
            list = list.filter(p => p.enabled)
        } else if (filter === 'disabled') {
            list = list.filter(p => !p.enabled)
        }

        return list
    }, [plugins, search, filter])

    const handleToggle = (pluginId: string, enabled: boolean) => {
        if (enabled) {
            enablePlugin(pluginId)
        } else {
            disablePlugin(pluginId)
        }
    }

    const handleUninstall = (pluginId: string) => {
        if (confirm('Are you sure you want to uninstall this plugin?')) {
            // Uninstall handled by parent
            console.log('Uninstall:', pluginId)
        }
    }

    const enabledCount = Object.values(plugins).filter(p => p.enabled).length
    const totalCount = Object.values(plugins).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Puzzle size={20} className="text-blue-500" />
                        Plugins
                    </h2>
                    <p className="text-sm text-slate-500">
                        {enabledCount} of {totalCount} plugins enabled
                    </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={16} />
                    Install Plugin
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search plugins..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    {(['all', 'enabled', 'disabled'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                'px-3 py-1 text-sm rounded-md transition-colors capitalize',
                                filter === f
                                    ? 'bg-white dark:bg-slate-700 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plugin Grid */}
            {pluginList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pluginList.map((plugin) => (
                        <PluginCard
                            key={plugin.manifest.id}
                            plugin={plugin}
                            onToggle={handleToggle}
                            onSettings={onPluginSettings}
                            onUninstall={handleUninstall}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <Puzzle size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                        {search ? 'No plugins found' : 'No plugins installed'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {search ? 'Try a different search term' : 'Install plugins to extend functionality'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default PluginRegistry
