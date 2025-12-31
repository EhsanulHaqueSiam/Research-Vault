/**
 * Settings Panel Component
 * 
 * Global application settings dialog
 */

import { useState } from 'react'
import { Settings, X, Palette, Bell, Database, Keyboard, Info } from 'lucide-react'
import { ThemeSelector } from './ThemeSelector'
import { BackupManager } from '@/features/backup/components/BackupManager'
import { cn } from '@/shared/utils/cn'

interface SettingsPanelProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type SettingsTab = 'appearance' | 'notifications' | 'data' | 'shortcuts' | 'about'

const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'about', label: 'About', icon: Info },
]

/**
 * Settings Panel - Global application settings
 */
export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('appearance')

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-56 bg-muted/50 p-4 border-r">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <Settings className="h-5 w-5" />
                        <h2 className="font-semibold">Settings</h2>
                    </div>

                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                    activeTab === tab.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold capitalize">{activeTab}</h3>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 p-6 overflow-auto">
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium mb-3">Theme</h4>
                                    <ThemeSelector variant="buttons" />
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-3">Font Size</h4>
                                    <select className="px-3 py-2 rounded-lg border bg-background text-foreground">
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-3">Sidebar Position</h4>
                                    <select className="px-3 py-2 rounded-lg border bg-background text-foreground">
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-4">
                                <label className="flex items-center justify-between">
                                    <span>Enable notifications</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Task reminders</span>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span>Auto-save alerts</span>
                                    <input type="checkbox" className="rounded" />
                                </label>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="space-y-8">
                                {/* Backup Manager */}
                                <BackupManager />

                                {/* Separator */}
                                <hr className="border-border" />

                                {/* Other Data Settings */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Auto-save</h4>
                                        <select className="px-3 py-2 rounded-lg border bg-background text-foreground">
                                            <option value="3000">Every 3 seconds</option>
                                            <option value="5000">Every 5 seconds</option>
                                            <option value="10000">Every 10 seconds</option>
                                            <option value="30000">Every 30 seconds</option>
                                        </select>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Data Location</h4>
                                        <p className="text-sm text-muted-foreground">
                                            ~/Documents/Research Manager
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg">
                                        Clear Local Data
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shortcuts' && (
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b">
                                    <span>New Project</span>
                                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+N</kbd>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>Save Checkpoint</span>
                                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>Open Settings</span>
                                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+,</kbd>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>Toggle Theme</span>
                                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+T</kbd>
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h4 className="text-2xl font-bold">Research Manager</h4>
                                    <p className="text-muted-foreground">Version 0.1.0</p>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    A modern research project management application with
                                    version control, tasks, and notes.
                                </p>
                                <div className="text-center text-sm text-muted-foreground">
                                    Built with React, Tauri, and TypeScript
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPanel
