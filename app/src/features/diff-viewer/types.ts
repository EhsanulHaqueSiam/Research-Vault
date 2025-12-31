/**
 * Diff Viewer Types
 * 
 * Type definitions for the diff viewer component
 */

import type { FileDiff, DiffResult, DiffStats } from '@/core/services/git'

/**
 * View mode for displaying diffs
 */
export type DiffViewMode = 'unified' | 'split'

/**
 * Props for DiffViewer component
 */
export interface DiffViewerProps {
    /** File diff to display */
    diff: FileDiff
    /** Optional: View mode (default: 'split') */
    viewMode?: DiffViewMode
    /** Optional: Show line numbers */
    showLineNumbers?: boolean
    /** Optional: Enable syntax highlighting */
    syntaxHighlight?: boolean
    /** Optional: Expand all context (show all unchanged lines) */
    expandAll?: boolean
    /** Optional: Custom className */
    className?: string
    /** Callback when view mode changes */
    onViewModeChange?: (mode: DiffViewMode) => void
}

/**
 * Props for DiffHeader component
 */
export interface DiffHeaderProps {
    /** File path */
    path: string
    /** File status */
    status: 'added' | 'modified' | 'deleted' | 'renamed'
    /** Diff statistics */
    stats: DiffStats
    /** Current view mode */
    viewMode: DiffViewMode
    /** Callback when view mode changes */
    onViewModeChange: (mode: DiffViewMode) => void
    /** Whether diff is for binary file */
    isBinary?: boolean
}

/**
 * Props for DiffContent component
 */
export interface DiffContentProps {
    /** The diff result */
    diff: DiffResult
    /** View mode */
    viewMode: DiffViewMode
    /** Show line numbers */
    showLineNumbers: boolean
    /** Enable syntax highlighting */
    syntaxHighlight: boolean
    /** File path (for language detection) */
    filePath: string
    /** File status */
    status: 'added' | 'modified' | 'deleted' | 'renamed'
}

/**
 * Props for ImageDiff component
 */
export interface ImageDiffProps {
    /** Old image content (base64) */
    oldImage: string | null
    /** New image content (base64) */
    newImage: string | null
    /** View mode: 'slider' or 'sideBySide' */
    viewMode: 'slider' | 'sideBySide' | 'onion'
    /** File path */
    path: string
}

/**
 * Props for DiffNavigation component
 */
export interface DiffNavigationProps {
    /** Total number of changes */
    totalChanges: number
    /** Current change index */
    currentIndex: number
    /** Go to previous change */
    onPrevious: () => void
    /** Go to next change */
    onNext: () => void
    /** Go to specific change */
    onGoTo: (index: number) => void
}
