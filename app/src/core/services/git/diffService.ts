/**
 * Diff Service
 * 
 * Text diff utilities for comparing file versions
 */

import { diffLines, diffWords, diffChars } from 'diff'
import type { DiffResult, DiffHunk, DiffLine, DiffStats, FileStatus, FileDiff } from './types'

// ============================================
// Diff Service Class
// ============================================

/**
 * DiffService provides text comparison utilities
 */
export class DiffService {
    // ============================================
    // Text Diff
    // ============================================

    /**
     * Get line-by-line diff between two texts
     */
    getLineDiff(oldText: string, newText: string): DiffResult {
        const changes = diffLines(oldText, newText)
        const hunks: DiffHunk[] = []
        const stats: DiffStats = { added: 0, removed: 0, total: 0 }

        let currentHunk: DiffHunk | null = null
        let oldLineNum = 1
        let newLineNum = 1

        for (const change of changes) {
            const lines = change.value.split('\n').filter(l => l !== '' || change.value === '\n')

            for (const line of lines) {
                const diffLine: DiffLine = {
                    content: line,
                    type: 'context',
                }

                if (change.added) {
                    diffLine.type = 'add'
                    diffLine.newLineNumber = newLineNum++
                    stats.added++
                } else if (change.removed) {
                    diffLine.type = 'remove'
                    diffLine.oldLineNumber = oldLineNum++
                    stats.removed++
                } else {
                    diffLine.type = 'context'
                    diffLine.oldLineNumber = oldLineNum++
                    diffLine.newLineNumber = newLineNum++
                }

                // Start new hunk if needed
                if (!currentHunk || (diffLine.type === 'context' && currentHunk.lines.length > 3)) {
                    if (currentHunk && currentHunk.lines.some(l => l.type !== 'context')) {
                        hunks.push(currentHunk)
                    }
                    currentHunk = {
                        oldStart: diffLine.oldLineNumber || oldLineNum,
                        oldLines: 0,
                        newStart: diffLine.newLineNumber || newLineNum,
                        newLines: 0,
                        lines: [],
                    }
                }

                currentHunk.lines.push(diffLine)
                if (diffLine.type === 'remove' || diffLine.type === 'context') {
                    currentHunk.oldLines++
                }
                if (diffLine.type === 'add' || diffLine.type === 'context') {
                    currentHunk.newLines++
                }
            }
        }

        // Add final hunk
        if (currentHunk && currentHunk.lines.some(l => l.type !== 'context')) {
            hunks.push(currentHunk)
        }

        stats.total = stats.added + stats.removed

        return { hunks, stats }
    }

    /**
     * Get word-level diff for inline highlighting
     */
    getWordDiff(oldText: string, newText: string): DiffResult {
        const changes = diffWords(oldText, newText)
        const lines: DiffLine[] = []
        const stats: DiffStats = { added: 0, removed: 0, total: 0 }

        for (const change of changes) {
            const type: DiffLine['type'] = change.added ? 'add' : change.removed ? 'remove' : 'context'
            lines.push({ content: change.value, type })

            if (change.added) stats.added++
            else if (change.removed) stats.removed++
        }

        stats.total = stats.added + stats.removed

        return {
            hunks: [{ oldStart: 1, newStart: 1, oldLines: 1, newLines: 1, lines }],
            stats,
        }
    }

    /**
     * Get character-level diff for fine-grained highlighting
     */
    getCharDiff(oldText: string, newText: string): DiffResult {
        const changes = diffChars(oldText, newText)
        const lines: DiffLine[] = []
        const stats: DiffStats = { added: 0, removed: 0, total: 0 }

        for (const change of changes) {
            const type: DiffLine['type'] = change.added ? 'add' : change.removed ? 'remove' : 'context'
            lines.push({ content: change.value, type })

            if (change.added) stats.added += change.value.length
            else if (change.removed) stats.removed += change.value.length
        }

        stats.total = stats.added + stats.removed

        return {
            hunks: [{ oldStart: 1, newStart: 1, oldLines: 1, newLines: 1, lines }],
            stats,
        }
    }

    // ============================================
    // File Diff
    // ============================================

    /**
     * Create a FileDiff object from two file contents
     */
    createFileDiff(
        path: string,
        oldContent: string,
        newContent: string,
        status: FileStatus
    ): FileDiff {
        const isBinary = this.isBinaryContent(oldContent) || this.isBinaryContent(newContent)

        let diff: DiffResult
        if (isBinary) {
            diff = { hunks: [], stats: { added: 0, removed: 0, total: 0 } }
        } else {
            diff = this.getLineDiff(oldContent, newContent)
        }

        return {
            path,
            oldContent,
            newContent,
            diff,
            isBinary,
            status,
        }
    }

    /**
     * Check if content appears to be binary
     */
    isBinaryContent(content: string): boolean {
        // Check for null bytes
        if (content.includes('\0')) return true

        // Check for high ratio of non-printable characters
        let nonPrintable = 0
        for (let i = 0; i < Math.min(content.length, 8192); i++) {
            const code = content.charCodeAt(i)
            if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
                nonPrintable++
            }
        }

        return nonPrintable > content.length * 0.1
    }

    /**
     * Check if a file path likely points to a binary file
     */
    isBinaryPath(path: string): boolean {
        const binaryExtensions = [
            '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp',
            '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
            '.zip', '.rar', '.7z', '.tar', '.gz',
            '.exe', '.dll', '.so', '.dylib',
            '.mp3', '.mp4', '.wav', '.avi', '.mov',
            '.ttf', '.otf', '.woff', '.woff2',
        ]

        const ext = path.toLowerCase().slice(path.lastIndexOf('.'))
        return binaryExtensions.includes(ext)
    }

    // ============================================
    // Stats & Formatting
    // ============================================

    /**
     * Get statistics from a diff
     */
    getStats(diff: DiffResult): DiffStats {
        return diff.stats
    }

    /**
     * Format diff for display (unified diff format)
     */
    formatUnifiedDiff(diff: DiffResult, oldPath: string, newPath: string): string {
        const lines: string[] = [
            `--- ${oldPath}`,
            `+++ ${newPath}`,
        ]

        for (const hunk of diff.hunks) {
            lines.push(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`)

            for (const line of hunk.lines) {
                const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '
                lines.push(`${prefix}${line.content}`)
            }
        }

        return lines.join('\n')
    }

    /**
     * Convert DiffResult to react-diff-view compatible format
     */
    toReactDiffView(diff: DiffResult, _oldPath: string, _newPath: string): {
        type: 'unified' | 'split'
        hunks: Array<{
            content: string
            oldStart: number
            newStart: number
            oldLines: number
            newLines: number
            changes: Array<{
                type: 'insert' | 'delete' | 'normal'
                content: string
                lineNumber?: number
                oldLineNumber?: number
                newLineNumber?: number
            }>
        }>
    } {
        return {
            type: 'unified',
            hunks: diff.hunks.map(hunk => ({
                content: `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`,
                oldStart: hunk.oldStart,
                newStart: hunk.newStart,
                oldLines: hunk.oldLines,
                newLines: hunk.newLines,
                changes: hunk.lines.map(line => ({
                    type: line.type === 'add' ? 'insert' : line.type === 'remove' ? 'delete' : 'normal',
                    content: line.content,
                    oldLineNumber: line.oldLineNumber,
                    newLineNumber: line.newLineNumber,
                })),
            })),
        }
    }

    /**
     * Get a summary of changes
     */
    getSummary(diff: DiffResult): string {
        const { added, removed } = diff.stats

        if (added === 0 && removed === 0) {
            return 'No changes'
        }

        const parts: string[] = []
        if (added > 0) parts.push(`+${added}`)
        if (removed > 0) parts.push(`-${removed}`)

        return parts.join(' ')
    }
}

// ============================================
// Factory Function
// ============================================

/**
 * Create a new DiffService instance
 */
export function createDiffService(): DiffService {
    return new DiffService()
}

// Export singleton instance for convenience
export const diffService = new DiffService()
