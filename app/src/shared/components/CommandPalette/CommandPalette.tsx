/**
 * Command Palette
 * 
 * Comprehensive universal search and command interface (Cmd+K / Ctrl+K)
 * Can do everything: theme, navigation, create, search, settings
 */

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Command } from 'cmdk'
import {
    Search,
    FolderOpen,
    FileText,
    CheckSquare,
    Plus,
    Settings,
    X,
    Sun,
    Moon,
    Monitor,
    BarChart3,
    History,
    LayoutGrid,
    Download,
    Upload,
    Keyboard,
    Palette,
    Home,
    ArrowRight,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { SearchService, type SearchableItem, type SearchResultType } from '@/core/search'
import { useTheme } from '@/shared/hooks/useTheme'

// ============================================
// Types
// ============================================

export interface CommandPaletteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelectProject?: (id: string) => void
    onSelectNote?: (id: string) => void
    onSelectTask?: (id: string) => void
    onCreateProject?: () => void
    onCreateNote?: () => void
    onCreateTask?: () => void
    onOpenSettings?: () => void
    onNavigate?: (tab: string) => void
    onGoHome?: () => void
}

interface CommandAction {
    id: string
    title: string
    subtitle?: string
    icon: React.ReactNode
    shortcut?: string
    group: 'create' | 'navigate' | 'theme' | 'settings' | 'data'
    action: () => void
    keywords?: string[]
}

// ============================================
// Icons by Type
// ============================================

const typeIcons: Record<SearchResultType, React.ReactNode> = {
    project: <FolderOpen size={16} className="text-blue-500" />,
    note: <FileText size={16} className="text-purple-500" />,
    task: <CheckSquare size={16} className="text-green-500" />,
    action: <Plus size={16} className="text-slate-400" />,
}

// ============================================
// Component
// ============================================

export function CommandPalette({
    open,
    onOpenChange,
    onSelectProject,
    onSelectNote,
    onSelectTask,
    onCreateProject,
    onCreateNote,
    onCreateTask,
    onOpenSettings,
    onNavigate,
    onGoHome,
}: CommandPaletteProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchableItem[]>([])
    const { theme, setTheme } = useTheme()

    // Build comprehensive action list
    const actions = useMemo<CommandAction[]>(() => {
        const list: CommandAction[] = []

        // Create Actions
        if (onCreateProject) {
            list.push({
                id: 'create-project',
                title: 'New Project',
                subtitle: 'Create a new research project',
                icon: <Plus size={16} className="text-blue-500" />,
                shortcut: '⌘N',
                group: 'create',
                action: onCreateProject,
                keywords: ['new', 'create', 'project', 'add'],
            })
        }
        if (onCreateNote) {
            list.push({
                id: 'create-note',
                title: 'New Note',
                subtitle: 'Create a new note',
                icon: <FileText size={16} className="text-purple-500" />,
                group: 'create',
                action: onCreateNote,
                keywords: ['new', 'create', 'note', 'add', 'write'],
            })
        }
        if (onCreateTask) {
            list.push({
                id: 'create-task',
                title: 'New Task',
                subtitle: 'Create a new task',
                icon: <CheckSquare size={16} className="text-green-500" />,
                group: 'create',
                action: onCreateTask,
                keywords: ['new', 'create', 'task', 'add', 'todo'],
            })
        }

        // Navigation Actions
        if (onGoHome) {
            list.push({
                id: 'nav-home',
                title: 'Go to Home',
                subtitle: 'View all projects',
                icon: <Home size={16} className="text-slate-500" />,
                group: 'navigate',
                action: onGoHome,
                keywords: ['home', 'projects', 'list', 'back'],
            })
        }
        if (onNavigate) {
            list.push(
                {
                    id: 'nav-tasks',
                    title: 'Go to Tasks',
                    subtitle: 'View task list',
                    icon: <CheckSquare size={16} className="text-green-500" />,
                    group: 'navigate',
                    action: () => onNavigate('tasks'),
                    keywords: ['tasks', 'list', 'todo'],
                },
                {
                    id: 'nav-kanban',
                    title: 'Go to Kanban',
                    subtitle: 'View Kanban board',
                    icon: <LayoutGrid size={16} className="text-orange-500" />,
                    group: 'navigate',
                    action: () => onNavigate('kanban'),
                    keywords: ['kanban', 'board', 'columns'],
                },
                {
                    id: 'nav-notes',
                    title: 'Go to Notes',
                    subtitle: 'View notes',
                    icon: <FileText size={16} className="text-purple-500" />,
                    group: 'navigate',
                    action: () => onNavigate('notes'),
                    keywords: ['notes', 'documents', 'writing'],
                },
                {
                    id: 'nav-analytics',
                    title: 'Go to Analytics',
                    subtitle: 'View analytics dashboard',
                    icon: <BarChart3 size={16} className="text-cyan-500" />,
                    group: 'navigate',
                    action: () => onNavigate('analytics'),
                    keywords: ['analytics', 'stats', 'dashboard', 'charts'],
                },
                {
                    id: 'nav-history',
                    title: 'Go to Version History',
                    subtitle: 'View version history',
                    icon: <History size={16} className="text-amber-500" />,
                    group: 'navigate',
                    action: () => onNavigate('history'),
                    keywords: ['history', 'version', 'git', 'undo'],
                }
            )
        }

        // Theme Actions
        list.push(
            {
                id: 'theme-light',
                title: 'Switch to Light Mode',
                subtitle: theme === 'light' ? 'Currently active' : undefined,
                icon: <Sun size={16} className="text-yellow-500" />,
                group: 'theme',
                action: () => setTheme('light'),
                keywords: ['light', 'theme', 'bright', 'day'],
            },
            {
                id: 'theme-dark',
                title: 'Switch to Dark Mode',
                subtitle: theme === 'dark' ? 'Currently active' : undefined,
                icon: <Moon size={16} className="text-indigo-500" />,
                group: 'theme',
                action: () => setTheme('dark'),
                keywords: ['dark', 'theme', 'night', 'black'],
            },
            {
                id: 'theme-system',
                title: 'Use System Theme',
                subtitle: theme === 'system' ? 'Currently active' : undefined,
                icon: <Monitor size={16} className="text-slate-500" />,
                group: 'theme',
                action: () => setTheme('system'),
                keywords: ['system', 'theme', 'auto', 'default'],
            }
        )

        // Settings Actions
        if (onOpenSettings) {
            list.push({
                id: 'settings',
                title: 'Open Settings',
                subtitle: 'Configure application preferences',
                icon: <Settings size={16} className="text-slate-400" />,
                shortcut: '⌘,',
                group: 'settings',
                action: onOpenSettings,
                keywords: ['settings', 'preferences', 'options', 'configure'],
            })
        }
        list.push(
            {
                id: 'shortcuts',
                title: 'Keyboard Shortcuts',
                subtitle: 'View all keyboard shortcuts',
                icon: <Keyboard size={16} className="text-slate-400" />,
                group: 'settings',
                action: () => onOpenSettings?.(),
                keywords: ['keyboard', 'shortcuts', 'hotkeys', 'keys'],
            },
            {
                id: 'appearance',
                title: 'Appearance Settings',
                subtitle: 'Customize theme and look',
                icon: <Palette size={16} className="text-pink-500" />,
                group: 'settings',
                action: () => onOpenSettings?.(),
                keywords: ['appearance', 'theme', 'colors', 'look'],
            }
        )

        // Data Actions
        list.push(
            {
                id: 'backup-create',
                title: 'Create Backup',
                subtitle: 'Download a backup of your data',
                icon: <Download size={16} className="text-blue-500" />,
                group: 'data',
                action: () => onOpenSettings?.(),
                keywords: ['backup', 'export', 'download', 'save'],
            },
            {
                id: 'backup-restore',
                title: 'Restore Backup',
                subtitle: 'Import data from a backup',
                icon: <Upload size={16} className="text-green-500" />,
                group: 'data',
                action: () => onOpenSettings?.(),
                keywords: ['restore', 'import', 'upload', 'load'],
            }
        )

        return list
    }, [onCreateProject, onCreateNote, onCreateTask, onOpenSettings, onNavigate, onGoHome, theme, setTheme])

    // Filter actions based on query
    const filteredActions = useMemo(() => {
        if (!query.trim()) return actions
        const q = query.toLowerCase()
        return actions.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.subtitle?.toLowerCase().includes(q) ||
            a.keywords?.some(k => k.includes(q))
        )
    }, [actions, query])

    // Group filtered actions
    const groupedActions = useMemo(() => {
        const groups: Record<string, CommandAction[]> = {}
        filteredActions.forEach(a => {
            if (!groups[a.group]) groups[a.group] = []
            groups[a.group].push(a)
        })
        return groups
    }, [filteredActions])

    const groupLabels: Record<string, string> = {
        create: '✨ Create',
        navigate: '🧭 Navigate',
        theme: '🎨 Theme',
        settings: '⚙️ Settings',
        data: '💾 Data',
    }

    // Search on query change
    useEffect(() => {
        if (query.trim()) {
            const searchResults = SearchService.search(query, 10)
            setResults(searchResults)
        } else {
            const recent = SearchService.getRecent(3)
            setResults(recent)
        }
    }, [query])

    // Handle item selection
    const handleSelect = useCallback((item: SearchableItem) => {
        switch (item.type) {
            case 'project':
                onSelectProject?.(item.id)
                break
            case 'note':
                onSelectNote?.(item.id)
                break
            case 'task':
                onSelectTask?.(item.id)
                break
        }
        onOpenChange(false)
        setQuery('')
    }, [onSelectProject, onSelectNote, onSelectTask, onOpenChange])

    // Handle action selection
    const handleAction = useCallback((action: CommandAction) => {
        action.action()
        onOpenChange(false)
        setQuery('')
    }, [onOpenChange])

    // Group results by type
    const groupedResults = results.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = []
        acc[item.type].push(item)
        return acc
    }, {} as Record<SearchResultType, SearchableItem[]>)

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                onOpenChange(!open)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, onOpenChange])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Palette */}
            <div className="absolute left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl">
                <Command
                    className={cn(
                        'rounded-xl border border-slate-200 dark:border-slate-700',
                        'bg-white dark:bg-slate-900 shadow-2xl',
                        'overflow-hidden'
                    )}
                    loop
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
                        <Search size={18} className="text-slate-400" />
                        <Command.Input
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Type a command or search..."
                            className={cn(
                                'flex-1 py-4 text-base',
                                'bg-transparent outline-none',
                                'placeholder:text-slate-400'
                            )}
                            autoFocus
                        />
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X size={16} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Results */}
                    <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                        <Command.Empty className="py-8 text-center text-sm text-slate-500">
                            No results found.
                        </Command.Empty>

                        {/* Actions by Group */}
                        {Object.entries(groupedActions).map(([group, actions]) => (
                            <Command.Group key={group} heading={groupLabels[group] || group}>
                                {actions.map((action) => (
                                    <Command.Item
                                        key={action.id}
                                        value={`${action.title} ${action.keywords?.join(' ') || ''}`}
                                        onSelect={() => handleAction(action)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            {action.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium">{action.title}</div>
                                            {action.subtitle && (
                                                <div className="text-xs text-slate-500 truncate">{action.subtitle}</div>
                                            )}
                                        </div>
                                        {action.shortcut && (
                                            <kbd className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                {action.shortcut}
                                            </kbd>
                                        )}
                                        <ArrowRight size={14} className="text-slate-300" />
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        ))}

                        {/* Search Results by Type */}
                        {query && groupedResults.project?.length > 0 && (
                            <Command.Group heading="📁 Projects">
                                {groupedResults.project.map((item) => (
                                    <Command.Item
                                        key={`project-${item.id}`}
                                        value={item.title}
                                        onSelect={() => handleSelect(item)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                                    >
                                        {typeIcons.project}
                                        <span className="flex-1 truncate">{item.title}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {query && groupedResults.note?.length > 0 && (
                            <Command.Group heading="📝 Notes">
                                {groupedResults.note.map((item) => (
                                    <Command.Item
                                        key={`note-${item.id}`}
                                        value={item.title}
                                        onSelect={() => handleSelect(item)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                                    >
                                        {typeIcons.note}
                                        <span className="flex-1 truncate">{item.title}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {query && groupedResults.task?.length > 0 && (
                            <Command.Group heading="✅ Tasks">
                                {groupedResults.task.map((item) => (
                                    <Command.Item
                                        key={`task-${item.id}`}
                                        value={item.title}
                                        onSelect={() => handleSelect(item)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                                    >
                                        {typeIcons.task}
                                        <span className="flex-1 truncate">{item.title}</span>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
                    </Command.List>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                        <span>Type to search or run a command</span>
                        <div className="flex items-center gap-3">
                            <span>↑↓ Navigate</span>
                            <span>↵ Select</span>
                            <span>Esc Close</span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    )
}

export default CommandPalette
