/**
 * Plugin Card Component
 * 
 * Displays a single plugin with toggle and actions
 */

import { useState } from 'react'
import {
    Settings,
    Trash2,
    ExternalLink,
    AlertCircle,
    CheckCircle,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { PluginRegistryEntry } from '@/core/plugins/types'

// ============================================
// Props
// ============================================

export interface PluginCardProps {
    plugin: PluginRegistryEntry
    onToggle: (pluginId: string, enabled: boolean) => void
    onSettings: (pluginId: string) => void
    onUninstall: (pluginId: string) => void
}

// ============================================
// Component
// ============================================

export function PluginCard({ plugin, onToggle, onSettings, onUninstall }: PluginCardProps) {
    const [isToggling, setIsToggling] = useState(false)

    const handleToggle = async () => {
        setIsToggling(true)
        try {
            await onToggle(plugin.manifest.id, !plugin.enabled)
        } finally {
            setIsToggling(false)
        }
    }

    const statusColor = plugin.enabled
        ? 'text-green-500'
        : 'text-slate-400'

    return (
        <div className={cn(
            'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
            'p-4 hover:shadow-md transition-shadow',
            !plugin.enabled && 'opacity-60'
        )}>
            {/* Header */}
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                    'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                )}>
                    {plugin.manifest.icon || plugin.manifest.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{plugin.manifest.name}</h3>
                        <span className="text-xs text-slate-500">v{plugin.manifest.version}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {plugin.manifest.description}
                    </p>
                </div>

                {/* Toggle */}
                <button
                    onClick={handleToggle}
                    disabled={isToggling}
                    className={cn(
                        'relative w-12 h-6 rounded-full transition-colors',
                        plugin.enabled
                            ? 'bg-green-500'
                            : 'bg-slate-300 dark:bg-slate-600'
                    )}
                >
                    <span className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                        plugin.enabled ? 'left-7' : 'left-1'
                    )} />
                </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
                <span className={cn('flex items-center gap-1', statusColor)}>
                    {plugin.enabled ? (
                        <>
                            <CheckCircle size={12} />
                            Enabled
                        </>
                    ) : (
                        <>
                            <AlertCircle size={12} />
                            Disabled
                        </>
                    )}
                </span>
                {plugin.manifest.author && (
                    <span>by {plugin.manifest.author.name}</span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
                <button
                    onClick={() => onSettings(plugin.manifest.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                    <Settings size={12} />
                    Settings
                </button>
                {plugin.manifest.homepage && (
                    <a
                        href={plugin.manifest.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                        <ExternalLink size={12} />
                        Website
                    </a>
                )}
                <button
                    onClick={() => onUninstall(plugin.manifest.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ml-auto"
                >
                    <Trash2 size={12} />
                    Uninstall
                </button>
            </div>
        </div>
    )
}

export default PluginCard
