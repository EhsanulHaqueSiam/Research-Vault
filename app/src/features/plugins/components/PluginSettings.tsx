/**
 * Plugin Settings Component
 * 
 * Dynamic settings form for plugin configuration
 */

import { useState, useCallback, useEffect } from 'react'
import {
    Settings,
    Save,
    RotateCcw,
    ArrowLeft,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { usePluginRegistry } from '@/core/plugins/stores/pluginRegistry.store'

// ============================================
// Types
// ============================================

interface SettingField {
    key: string
    type: 'text' | 'number' | 'boolean' | 'select'
    label: string
    description?: string
    default?: unknown
    options?: { value: string; label: string }[]
}

export interface PluginSettingsProps {
    pluginId: string
    onBack: () => void
}

// ============================================
// Component
// ============================================

export function PluginSettings({ pluginId, onBack }: PluginSettingsProps) {
    const { plugins, getPluginSettings, setPluginSettings } = usePluginRegistry()
    const plugin = plugins[pluginId]

    const [settings, setSettings] = useState<Record<string, unknown>>({})
    const [isDirty, setIsDirty] = useState(false)

    // Load current settings
    useEffect(() => {
        const current = getPluginSettings(pluginId)
        setSettings(current || {})
    }, [pluginId, getPluginSettings])

    // Define settings schema (in a real app, this would come from plugin manifest)
    const settingsSchema: SettingField[] = [
        {
            key: 'enabled',
            type: 'boolean',
            label: 'Enable Plugin',
            description: 'Toggle plugin functionality on/off',
            default: true,
        },
        {
            key: 'autoStart',
            type: 'boolean',
            label: 'Auto Start',
            description: 'Start plugin automatically on app launch',
            default: true,
        },
        {
            key: 'logLevel',
            type: 'select',
            label: 'Log Level',
            description: 'Set the verbosity of plugin logs',
            default: 'info',
            options: [
                { value: 'debug', label: 'Debug' },
                { value: 'info', label: 'Info' },
                { value: 'warn', label: 'Warning' },
                { value: 'error', label: 'Error' },
            ],
        },
    ]

    const handleChange = useCallback((key: string, value: unknown) => {
        setSettings(prev => ({ ...prev, [key]: value }))
        setIsDirty(true)
    }, [])

    const handleSave = useCallback(() => {
        setPluginSettings(pluginId, settings)
        setIsDirty(false)
    }, [pluginId, settings, setPluginSettings])

    const handleReset = useCallback(() => {
        const defaults: Record<string, unknown> = {}
        settingsSchema.forEach(field => {
            if (field.default !== undefined) {
                defaults[field.key] = field.default
            }
        })
        setSettings(defaults)
        setIsDirty(true)
    }, [])

    if (!plugin) {
        return (
            <div className="text-center py-12 text-slate-500">
                Plugin not found
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings size={20} className="text-blue-500" />
                        {plugin.manifest.name} Settings
                    </h2>
                    <p className="text-sm text-slate-500">
                        Configure plugin behavior
                    </p>
                </div>
            </div>

            {/* Settings Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                {settingsSchema.map((field) => (
                    <div key={field.key} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="font-medium">{field.label}</label>
                            {field.description && (
                                <p className="text-sm text-slate-500 mt-0.5">{field.description}</p>
                            )}
                        </div>
                        <div className="flex-shrink-0">
                            {field.type === 'boolean' && (
                                <button
                                    onClick={() => handleChange(field.key, !(settings[field.key] ?? field.default))}
                                    className={cn(
                                        'relative w-12 h-6 rounded-full transition-colors',
                                        (settings[field.key] ?? field.default)
                                            ? 'bg-blue-500'
                                            : 'bg-slate-300 dark:bg-slate-600'
                                    )}
                                >
                                    <span className={cn(
                                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                                        (settings[field.key] ?? field.default) ? 'left-7' : 'left-1'
                                    )} />
                                </button>
                            )}
                            {field.type === 'text' && (
                                <input
                                    type="text"
                                    value={(settings[field.key] as string) ?? (field.default as string) ?? ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
                                />
                            )}
                            {field.type === 'number' && (
                                <input
                                    type="number"
                                    value={(settings[field.key] as number) ?? (field.default as number) ?? 0}
                                    onChange={(e) => handleChange(field.key, Number(e.target.value))}
                                    className="w-24 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
                                />
                            )}
                            {field.type === 'select' && field.options && (
                                <select
                                    value={(settings[field.key] as string) ?? (field.default as string) ?? ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
                                >
                                    {field.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    <RotateCcw size={16} />
                    Reset to Defaults
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                        isDirty
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    )}
                >
                    <Save size={16} />
                    Save Changes
                </button>
            </div>
        </div>
    )
}

export default PluginSettings
