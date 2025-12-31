/**
 * Undo Tree Types
 * 
 * Type definitions for the visual undo tree component
 */

import type { HistoryNode } from '@/core/services/git'

/**
 * Extended node data for React Flow
 * Using index signature for React Flow compatibility
 */
export interface SnapshotNodeData {
    [key: string]: unknown
    /** The history node from Git */
    node: HistoryNode
    /** Whether this node is selected */
    isSelected: boolean
    /** Whether this node is the current HEAD */
    isCurrent: boolean
    /** Whether this is a branch point */
    isBranchPoint: boolean
    /** Callback when node is clicked */
    onSelect: (nodeId: string) => void
    /** Callback to restore to this point */
    onRestore: (nodeId: string) => void
    /** Callback to preview changes */
    onPreview: (nodeId: string) => void
}

/**
 * Edge data for connections
 */
export interface SnapshotEdgeData {
    [key: string]: unknown
    /** Whether this is the main branch */
    isMainBranch: boolean
}

/**
 * Props for the UndoTree component
 */
export interface UndoTreeProps {
    /** Project path to load history for */
    projectPath: string
    /** Currently selected snapshot ID */
    selectedId?: string
    /** Callback when a snapshot is selected */
    onSelect?: (snapshotId: string) => void
    /** Callback when restore is requested */
    onRestore?: (snapshotId: string) => void
    /** Optional className */
    className?: string
}

/**
 * Layout configuration
 */
export interface TreeLayoutConfig {
    /** Horizontal spacing between nodes */
    nodeSpacingX: number
    /** Vertical spacing between nodes */
    nodeSpacingY: number
    /** Node width */
    nodeWidth: number
    /** Node height */
    nodeHeight: number
}

export const DEFAULT_LAYOUT_CONFIG: TreeLayoutConfig = {
    nodeSpacingX: 200,
    nodeSpacingY: 100,
    nodeWidth: 220,
    nodeHeight: 80,
}
