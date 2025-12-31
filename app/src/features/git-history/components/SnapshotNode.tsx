/**
 * Snapshot Node Component
 * 
 * Custom React Flow node for displaying a snapshot (commit)
 */

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import { GitCommit, Clock, FileText, RotateCcw, Eye } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { formatRelativeTime } from '@/shared/utils/date'
import type { SnapshotNodeData } from './types'

/**
 * Truncate message to max length
 */
function truncateMessage(message: string, maxLength: number = 50): string {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength - 3) + '...'
}

type SnapshotNodeProps = NodeProps & { data: SnapshotNodeData }

/**
 * Snapshot Node - Custom node for the undo tree
 */
function SnapshotNodeComponent({ data, selected }: SnapshotNodeProps) {
    const { node, isSelected, isCurrent, isBranchPoint, onSelect, onRestore, onPreview } = data

    return (
        <div
            className={`
                relative px-4 py-3 rounded-lg border-2 min-w-[200px] max-w-[240px]
                bg-card text-card-foreground shadow-sm
                transition-all duration-200 cursor-pointer
                ${isSelected || selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
                ${isCurrent ? 'ring-2 ring-green-500/30' : ''}
                hover:border-primary/60 hover:shadow-md
            `}
            onClick={() => onSelect(node.id)}
        >
            {/* Connection handles */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-muted-foreground !w-2 !h-2"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-muted-foreground !w-2 !h-2"
            />

            {/* Header row */}
            <div className="flex items-center gap-2 mb-2">
                <div className={`
                    p-1.5 rounded-md
                    ${isCurrent ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary'}
                `}>
                    <GitCommit className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {truncateMessage(node.message, 35)}
                    </p>
                </div>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(node.timestamp)}</span>
                </div>
                {node.changedFiles.length > 0 && (
                    <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{node.changedFiles.length} files</span>
                    </div>
                )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 mb-2">
                {isCurrent && (
                    <Badge variant="default" className="text-[10px] h-5 bg-green-500">
                        HEAD
                    </Badge>
                )}
                {isBranchPoint && (
                    <Badge variant="secondary" className="text-[10px] h-5">
                        Branch
                    </Badge>
                )}
            </div>

            {/* Actions - show on hover/select */}
            <div className={`
                flex items-center gap-1 pt-2 border-t border-border
                ${isSelected || selected ? 'opacity-100' : 'opacity-0'}
                transition-opacity group-hover:opacity-100
            `}
                style={{ opacity: isSelected || selected ? 1 : undefined }}
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                        e.stopPropagation()
                        onPreview(node.id)
                    }}
                >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                </Button>
                {!isCurrent && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-primary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRestore(node.id)
                        }}
                    >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                    </Button>
                )}
            </div>

            {/* Short SHA */}
            <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground/60 font-mono">
                {node.id.substring(0, 7)}
            </div>
        </div>
    )
}

export const SnapshotNode = memo(SnapshotNodeComponent)
