/**
 * Preview Panel Component
 * 
 * Shows details and changes for a selected snapshot
 */

import { memo, useState } from 'react'
import { X, RotateCcw, Clock, FileText, GitBranch, User, Eye } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { DiffViewer } from '@/features/diff-viewer'
import { diffService } from '@/core/services/git'
import type { HistoryNode, FileDiff } from '@/core/services/git'

interface PreviewPanelProps {
    /** The selected snapshot */
    snapshot: HistoryNode | null
    /** Close the panel */
    onClose: () => void
    /** Restore to this snapshot */
    onRestore: (snapshotId: string) => void
    /** Whether restore is in progress */
    isRestoring: boolean
}

/**
 * Format full date/time
 */
function formatDateTime(date: Date): string {
    return date.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function PreviewPanelComponent({
    snapshot,
    onClose,
    onRestore,
    isRestoring,
}: PreviewPanelProps) {
    const [selectedFileDiff, setSelectedFileDiff] = useState<FileDiff | null>(null)

    const handleFileClick = async (filePath: string) => {
        // Create a demo diff - in real app, this would fetch from Git
        const oldContent = '// Previous version\nfunction example() {\n  return 1;\n}'
        const newContent = '// Updated version\nfunction example() {\n  return 2; // Changed value\n}'
        const mockDiff = diffService.createFileDiff(filePath, oldContent, newContent, 'modified')
        setSelectedFileDiff(mockDiff)
    }

    if (!snapshot) return null

    // Show DiffViewer if a file is selected
    if (selectedFileDiff) {
        return (
            <div className="absolute right-4 top-4 w-[600px] max-h-[80vh] bg-background border rounded-lg shadow-lg overflow-hidden z-10">
                <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFileDiff(null)} className="gap-1">
                        <X className="h-4 w-4" /> Back to Details
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="max-h-[calc(80vh-60px)] overflow-auto">
                    <DiffViewer diff={selectedFileDiff} viewMode="unified" showLineNumbers />
                </div>
            </div>
        )
    }

    return (
        <div className="absolute right-4 top-4 w-80 bg-background border rounded-lg shadow-lg overflow-hidden z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                <h3 className="font-semibold text-sm">Snapshot Details</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-6 w-6"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-4">
                {/* Message */}
                <div>
                    <p className="text-sm font-medium leading-relaxed">
                        {snapshot.message}
                    </p>
                </div>

                {/* Meta info */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDateTime(snapshot.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{snapshot.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
                        <GitBranch className="h-4 w-4" />
                        <span>{snapshot.id}</span>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                    {snapshot.isCurrent && (
                        <Badge variant="default" className="bg-green-500">
                            Current HEAD
                        </Badge>
                    )}
                    {snapshot.isBranchPoint && (
                        <Badge variant="secondary">
                            Branch Point
                        </Badge>
                    )}
                    {snapshot.parentIds.length > 1 && (
                        <Badge variant="outline">
                            Merge Commit
                        </Badge>
                    )}
                </div>

                {/* Changed files */}
                {snapshot.changedFiles.length > 0 && (
                    <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <FileText className="h-3 w-3" />
                            <span>Changed Files ({snapshot.changedFiles.length})</span>
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {snapshot.changedFiles.map((file, idx) => (
                                <button
                                    key={idx}
                                    className="w-full text-left text-xs font-mono bg-muted px-2 py-1 rounded truncate hover:bg-muted/80 flex items-center gap-1"
                                    title={`Click to view diff: ${file}`}
                                    onClick={() => handleFileClick(file)}
                                >
                                    <Eye className="h-3 w-3 shrink-0" />
                                    {file}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Parents */}
                {snapshot.parentIds.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        <span>Parent{snapshot.parentIds.length > 1 ? 's' : ''}: </span>
                        <span className="font-mono">
                            {snapshot.parentIds.map(id => id.substring(0, 7)).join(', ')}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            {!snapshot.isCurrent && (
                <div className="p-3 border-t bg-muted/30">
                    <Button
                        className="w-full"
                        onClick={() => onRestore(snapshot.id)}
                        disabled={isRestoring}
                    >
                        {isRestoring ? (
                            <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <RotateCcw className="h-4 w-4 mr-2" />
                        )}
                        Restore to this point
                    </Button>
                </div>
            )}
        </div>
    )
}

export const PreviewPanel = memo(PreviewPanelComponent)
