/**
 * Quick Access Panel
 * 
 * Recent files, favorites, and breadcrumb navigation
 */

import {
    Clock,
    Star,
    StarOff,
    FolderOpen,
    FileText,
    CheckSquare,
    ChevronRight,
    X,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useQuickAccess, type QuickAccessItem, type Breadcrumb } from '@/shared/stores/quickAccess.store'

// ============================================
// Type Icons
// ============================================

const typeIcons = {
    project: <FolderOpen size={14} className="text-blue-500" />,
    note: <FileText size={14} className="text-purple-500" />,
    task: <CheckSquare size={14} className="text-green-500" />,
    home: <FolderOpen size={14} className="text-slate-500" />,
}

// ============================================
// Quick Access Item Component
// ============================================

interface QuickAccessItemProps {
    item: QuickAccessItem
    onSelect: (item: QuickAccessItem) => void
    showFavoriteToggle?: boolean
}

function QuickAccessItemRow({ item, onSelect, showFavoriteToggle = true }: QuickAccessItemProps) {
    const { addFavorite, removeFavorite, isFavorite } = useQuickAccess()
    const favorite = isFavorite(item.id)

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer',
                'hover:bg-slate-100 dark:hover:bg-slate-800 group'
            )}
            onClick={() => onSelect(item)}
        >
            {typeIcons[item.type]}
            <span className="flex-1 truncate text-sm">{item.title}</span>
            {showFavoriteToggle && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        favorite ? removeFavorite(item.id) : addFavorite(item)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                >
                    {favorite ? (
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    ) : (
                        <StarOff size={14} className="text-slate-400" />
                    )}
                </button>
            )}
        </div>
    )
}

// ============================================
// Breadcrumbs Component
// ============================================

interface BreadcrumbsProps {
    onNavigate: (crumb: Breadcrumb) => void
}

export function Breadcrumbs({ onNavigate }: BreadcrumbsProps) {
    const { breadcrumbs, clearBreadcrumbs } = useQuickAccess()

    if (breadcrumbs.length === 0) return null

    return (
        <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-sm overflow-x-auto">
            {breadcrumbs.map((crumb, index) => (
                <div key={`${crumb.type}-${crumb.id}`} className="flex items-center">
                    {index > 0 && <ChevronRight size={14} className="text-slate-400 mx-1" />}
                    <button
                        onClick={() => onNavigate(crumb)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 truncate max-w-[120px]"
                    >
                        {typeIcons[crumb.type]}
                        <span className="truncate">{crumb.title}</span>
                    </button>
                </div>
            ))}
            <button
                onClick={clearBreadcrumbs}
                className="ml-auto p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
                <X size={14} />
            </button>
        </div>
    )
}

// ============================================
// Quick Access Panel Component
// ============================================

interface QuickAccessPanelProps {
    onSelectItem: (item: QuickAccessItem) => void
}

export function QuickAccessPanel({ onSelectItem }: QuickAccessPanelProps) {
    const { recentItems, favorites, clearRecentItems } = useQuickAccess()

    return (
        <div className="space-y-4">
            {/* Favorites Section */}
            {favorites.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-500 uppercase">
                        <Star size={12} className="text-yellow-500" />
                        Favorites
                    </div>
                    <div className="space-y-0.5">
                        {favorites.map((item) => (
                            <QuickAccessItemRow
                                key={`fav-${item.type}-${item.id}`}
                                item={item}
                                onSelect={onSelectItem}
                                showFavoriteToggle
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Section */}
            {recentItems.length > 0 && (
                <div>
                    <div className="flex items-center justify-between px-3 py-1">
                        <span className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                            <Clock size={12} />
                            Recent
                        </span>
                        <button
                            onClick={clearRecentItems}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {recentItems.slice(0, 10).map((item) => (
                            <QuickAccessItemRow
                                key={`recent-${item.type}-${item.id}`}
                                item={item}
                                onSelect={onSelectItem}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {favorites.length === 0 && recentItems.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400">
                    No recent items yet
                </div>
            )}
        </div>
    )
}

export default QuickAccessPanel
