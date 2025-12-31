/**
 * Diff Content Component
 * 
 * Renders the actual diff content with syntax highlighting
 */

import { memo, useMemo } from 'react'
import { Diff, Hunk } from 'react-diff-view'
import 'react-diff-view/style/index.css'
import type { DiffContentProps } from '../types'
import { diffService } from '@/core/services/git'

// Language map for syntax highlighting - will be used in future
// const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
//     'ts': 'typescript', 'tsx': 'typescript', 'js': 'javascript', 'jsx': 'javascript',
//     'py': 'python', 'rb': 'ruby', 'rs': 'rust', 'go': 'go', 'java': 'java',
//     'kt': 'kotlin', 'swift': 'swift', 'c': 'c', 'cpp': 'cpp', 'h': 'c', 'hpp': 'cpp',
//     'cs': 'csharp', 'php': 'php', 'html': 'html', 'css': 'css', 'scss': 'scss',
//     'json': 'json', 'xml': 'xml', 'yaml': 'yaml', 'yml': 'yaml', 'md': 'markdown',
//     'sql': 'sql', 'sh': 'bash', 'bash': 'bash', 'zsh': 'bash',
// }
// function getLanguageFromPath(path: string): string | undefined {
//     const ext = path.split('.').pop()?.toLowerCase()
//     return ext ? EXTENSION_LANGUAGE_MAP[ext] : undefined
// }

function DiffContentComponent({
    diff,
    viewMode,
    showLineNumbers,
    filePath,
    status,
}: DiffContentProps) {
    // Convert our diff format to react-diff-view format
    const reactDiffViewData = useMemo(() => {
        return diffService.toReactDiffView(diff, filePath, filePath)
    }, [diff, filePath])

    // TODO: Add syntax highlighting using getLanguageFromPath(filePath)

    // Render hunks
    const renderHunks = (hunks: any[]) => {
        if (!hunks || hunks.length === 0) {
            return (
                <div className="p-8 text-center text-muted-foreground">
                    {status === 'added' && 'New file added'}
                    {status === 'deleted' && 'File deleted'}
                    {status === 'modified' && 'No changes to display'}
                </div>
            )
        }

        return hunks.map((hunk, index) => (
            <Hunk key={`hunk-${index}`} hunk={hunk} />
        ))
    }

    // Empty state
    if (diff.hunks.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                    {status === 'added' && (
                        <>
                            <div className="text-4xl mb-2">📄</div>
                            <p>New file - no previous version to compare</p>
                        </>
                    )}
                    {status === 'deleted' && (
                        <>
                            <div className="text-4xl mb-2">🗑️</div>
                            <p>File deleted</p>
                        </>
                    )}
                    {status === 'modified' && (
                        <>
                            <div className="text-4xl mb-2">✓</div>
                            <p>No changes detected</p>
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="diff-content overflow-auto">
            <style>{`
                .diff-content .diff {
                    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
                    font-size: 12px;
                    line-height: 1.5;
                }
                .diff-content .diff-gutter {
                    width: 50px;
                    padding: 0 8px;
                    text-align: right;
                    color: var(--muted-foreground);
                    background: var(--muted);
                    user-select: none;
                }
                .diff-content .diff-code {
                    padding: 0 12px;
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                .diff-content .diff-line-insert {
                    background: rgba(34, 197, 94, 0.15);
                }
                .diff-content .diff-line-delete {
                    background: rgba(239, 68, 68, 0.15);
                }
                .diff-content .diff-line-insert .diff-code-insert {
                    background: rgba(34, 197, 94, 0.25);
                }
                .diff-content .diff-line-delete .diff-code-delete {
                    background: rgba(239, 68, 68, 0.25);
                }
                .diff-content .diff-hunk-header {
                    background: var(--muted);
                    color: var(--muted-foreground);
                    padding: 4px 12px;
                    font-size: 11px;
                }
            `}</style>
            <Diff
                viewType={viewMode}
                diffType={status === 'added' ? 'add' : status === 'deleted' ? 'delete' : 'modify'}
                hunks={reactDiffViewData.hunks as any}
                gutterType={showLineNumbers ? 'default' : 'none'}
            >
                {(hunks: any[]) => renderHunks(hunks)}
            </Diff>
        </div>
    )
}

export const DiffContent = memo(DiffContentComponent)
