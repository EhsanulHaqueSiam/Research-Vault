/**
 * Diff Viewer Component
 * 
 * Main container for viewing file diffs with multiple view modes
 */

import { useState, useMemo, useCallback } from 'react'
import { DiffHeader } from './DiffHeader'
import { DiffContent } from './DiffContent'
import { DiffNavigation } from './DiffNavigation'
import { ImageDiff } from './ImageDiff'
import { diffService } from '@/core/services/git'
import type { DiffViewerProps, DiffViewMode } from '../types'

/**
 * Check if path is for an image file
 */
function isImagePath(path: string): boolean {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico']
    const ext = path.split('.').pop()?.toLowerCase()
    return ext ? imageExtensions.includes(ext) : false
}

/**
 * DiffViewer - Main diff viewer component
 * 
 * @example
 * ```tsx
 * <DiffViewer
 *   diff={fileDiff}
 *   viewMode="split"
 *   showLineNumbers
 *   syntaxHighlight
 * />
 * ```
 */
export function DiffViewer({
    diff,
    viewMode: initialViewMode = 'split',
    showLineNumbers = true,
    syntaxHighlight = true,
    expandAll: _expandAll = false,
    className = '',
    onViewModeChange,
}: DiffViewerProps) {
    const [viewMode, setViewMode] = useState<DiffViewMode>(initialViewMode)
    const [currentChangeIndex, setCurrentChangeIndex] = useState(0)

    // Check if this is an image diff
    const isImage = useMemo(() => isImagePath(diff.path), [diff.path])

    // Get stats
    const stats = useMemo(() => diffService.getStats(diff.diff), [diff.diff])

    // Count changes (hunks)
    const totalChanges = useMemo(() => diff.diff.hunks.length, [diff.diff.hunks])

    // Handle view mode change
    const handleViewModeChange = useCallback((mode: DiffViewMode) => {
        setViewMode(mode)
        onViewModeChange?.(mode)
    }, [onViewModeChange])

    // Navigation handlers
    const handlePrevious = useCallback(() => {
        setCurrentChangeIndex(prev => Math.max(0, prev - 1))
    }, [])

    const handleNext = useCallback(() => {
        setCurrentChangeIndex(prev => Math.min(totalChanges - 1, prev + 1))
    }, [totalChanges])

    const handleGoTo = useCallback((index: number) => {
        setCurrentChangeIndex(Math.max(0, Math.min(totalChanges - 1, index)))
    }, [totalChanges])

    return (
        <div className={`flex flex-col border rounded-lg overflow-hidden bg-background ${className}`}>
            {/* Header with file info and controls */}
            <DiffHeader
                path={diff.path}
                status={diff.status}
                stats={stats}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                isBinary={diff.isBinary || isImage}
            />

            {/* Content area */}
            <div className="flex-1 overflow-auto">
                {isImage ? (
                    <ImageDiff
                        oldImage={diff.oldContent || null}
                        newImage={diff.newContent || null}
                        viewMode="slider"
                        path={diff.path}
                    />
                ) : diff.isBinary ? (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📦</div>
                            <p>Binary file - cannot show diff</p>
                            <p className="text-sm">{diff.path}</p>
                        </div>
                    </div>
                ) : (
                    <DiffContent
                        diff={diff.diff}
                        viewMode={viewMode}
                        showLineNumbers={showLineNumbers}
                        syntaxHighlight={syntaxHighlight}
                        filePath={diff.path}
                        status={diff.status}
                    />
                )}
            </div>

            {/* Navigation footer */}
            {!isImage && !diff.isBinary && totalChanges > 1 && (
                <DiffNavigation
                    totalChanges={totalChanges}
                    currentIndex={currentChangeIndex}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onGoTo={handleGoTo}
                />
            )}
        </div>
    )
}
