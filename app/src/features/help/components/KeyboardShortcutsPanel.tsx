/**
 * Keyboard Shortcuts Panel Component
 * 
 * Display keyboard shortcuts for the application
 */

import { useState } from 'react'
import { Keyboard, X, Search } from 'lucide-react'

// ============================================
// Types
// ============================================

export interface Shortcut {
    keys: string[]
    description: string
    category: string
}

export interface KeyboardShortcutsPanelProps {
    shortcuts: Shortcut[]
    isOpen: boolean
    onClose: () => void
}

// ============================================
// Component
// ============================================

export function KeyboardShortcutsPanel({ shortcuts, isOpen, onClose }: KeyboardShortcutsPanelProps) {
    const [search, setSearch] = useState('')

    if (!isOpen) return null

    // Group by category
    const grouped = shortcuts.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = []
        acc[s.category].push(s)
        return acc
    }, {} as Record<string, Shortcut[]>)

    // Filter by search
    const filteredCategories = Object.entries(grouped).filter(([, items]) =>
        items.some(s =>
            s.description.toLowerCase().includes(search.toLowerCase()) ||
            s.keys.join(' ').toLowerCase().includes(search.toLowerCase())
        )
    )

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Keyboard size={20} className="text-blue-500" />
                            Keyboard Shortcuts
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search shortcuts..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 space-y-6">
                    {filteredCategories.map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                {category}
                            </h3>
                            <div className="space-y-1">
                                {items.filter(s =>
                                    s.description.toLowerCase().includes(search.toLowerCase()) ||
                                    s.keys.join(' ').toLowerCase().includes(search.toLowerCase())
                                ).map((shortcut, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between py-2 px-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-sm">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, j) => (
                                                <kbd
                                                    key={j}
                                                    className="px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">?</kbd> to toggle this panel
                </div>
            </div>
        </>
    )
}

// ============================================
// Default Shortcuts
// ============================================

export const DEFAULT_SHORTCUTS: Shortcut[] = [
    // Navigation
    { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
    { keys: ['⌘', '/'], description: 'Toggle sidebar', category: 'Navigation' },
    { keys: ['⌘', '\\'], description: 'Toggle focus mode', category: 'Navigation' },

    // Projects
    { keys: ['⌘', 'N'], description: 'New project', category: 'Projects' },
    { keys: ['⌘', 'O'], description: 'Open project', category: 'Projects' },

    // Editor
    { keys: ['⌘', 'S'], description: 'Save', category: 'Editor' },
    { keys: ['⌘', 'B'], description: 'Bold', category: 'Editor' },
    { keys: ['⌘', 'I'], description: 'Italic', category: 'Editor' },
    { keys: ['⌘', 'Shift', 'K'], description: 'Insert code block', category: 'Editor' },

    // Tasks
    { keys: ['⌘', 'Enter'], description: 'Complete task', category: 'Tasks' },
    { keys: ['⌘', 'T'], description: 'New task', category: 'Tasks' },
]

export default KeyboardShortcutsPanel
