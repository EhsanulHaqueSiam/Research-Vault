/**
 * Diff Header Component
 * 
 * Shows file path, status badge, stats, and view mode toggle
 */

import { memo } from 'react'
import { FileText, FilePlus, FileMinus, FileEdit, Columns, AlignLeft } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import type { DiffHeaderProps } from '../types'

/**
 * Get icon and color for file status
 */
function getStatusInfo(status: 'added' | 'modified' | 'deleted' | 'renamed') {
    switch (status) {
        case 'added':
            return { icon: FilePlus, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Added' }
        case 'deleted':
            return { icon: FileMinus, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Deleted' }
        case 'renamed':
            return { icon: FileEdit, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Renamed' }
        default:
            return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Modified' }
    }
}

function DiffHeaderComponent({
    path,
    status,
    stats,
    viewMode,
    onViewModeChange,
    isBinary = false,
}: DiffHeaderProps) {
    const statusInfo = getStatusInfo(status)
    const StatusIcon = statusInfo.icon

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
            {/* Left: File info */}
            <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded ${statusInfo.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-mono truncate" title={path}>
                        {path}
                    </p>
                    {!isBinary && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="text-green-500">+{stats.added}</span>
                            <span className="text-red-500">-{stats.removed}</span>
                            <span>{stats.total} lines</span>
                        </div>
                    )}
                </div>
                <Badge variant="outline" className={`${statusInfo.color} text-xs`}>
                    {statusInfo.label}
                </Badge>
                {isBinary && (
                    <Badge variant="secondary" className="text-xs">
                        Binary
                    </Badge>
                )}
            </div>

            {/* Right: View mode toggle */}
            {!isBinary && (
                <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                    <Button
                        variant={viewMode === 'split' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => onViewModeChange('split')}
                        title="Side-by-side view"
                    >
                        <Columns className="h-3.5 w-3.5 mr-1" />
                        Split
                    </Button>
                    <Button
                        variant={viewMode === 'unified' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => onViewModeChange('unified')}
                        title="Unified view"
                    >
                        <AlignLeft className="h-3.5 w-3.5 mr-1" />
                        Unified
                    </Button>
                </div>
            )}
        </div>
    )
}

export const DiffHeader = memo(DiffHeaderComponent)
