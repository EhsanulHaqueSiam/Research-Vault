/**
 * File Attachment Extension for Tiptap
 * 
 * Embed PDFs, documents, and files with preview
 */

import { Node, mergeAttributes, type NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { useState, useCallback } from 'react'
import {
    FileText,
    FileImage,
    FileArchive,
    File,
    Download,
    Trash2,
    ExternalLink,
} from 'lucide-react'

// ============================================
// Types
// ============================================

export interface AttachmentData {
    id: string
    filename: string
    path: string
    mimeType: string
    size: number
}

// Get icon by mime type
function getFileIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) return <FileImage size={16} className="text-green-500" />
    if (mimeType === 'application/pdf') return <FileText size={16} className="text-red-500" />
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <FileArchive size={16} className="text-yellow-500" />
    return <File size={16} className="text-slate-500" />
}

// Format file size
function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ============================================
// File Attachment Node View
// ============================================

function FileAttachmentNodeView({ node, deleteNode, selected }: NodeViewProps) {
    const [showPreview, setShowPreview] = useState(false)

    const filename = node.attrs.filename as string || 'Unknown file'
    const path = node.attrs.path as string || ''
    const mimeType = node.attrs.mimeType as string || 'application/octet-stream'
    const size = node.attrs.size as number || 0

    const isImage = mimeType.startsWith('image/')
    const isPdf = mimeType === 'application/pdf'

    const handleDownload = useCallback(() => {
        if (path) {
            window.open(path, '_blank')
        }
    }, [path])

    return (
        <NodeViewWrapper className="my-2">
            <div
                className={`file-attachment border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden ${selected ? 'ring-2 ring-blue-500' : ''
                    }`}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800">
                    {getFileIcon(mimeType)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{filename}</p>
                        <p className="text-xs text-slate-500">{formatSize(size)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {(isImage || isPdf) && (
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                                title={showPreview ? 'Hide preview' : 'Show preview'}
                            >
                                <ExternalLink size={14} />
                            </button>
                        )}
                        <button
                            onClick={handleDownload}
                            className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                            title="Download"
                        >
                            <Download size={14} />
                        </button>
                        <button
                            onClick={deleteNode}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Remove"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Preview */}
                {showPreview && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                        {isImage && (
                            <img
                                src={path}
                                alt={filename}
                                className="max-w-full max-h-64 mx-auto rounded"
                            />
                        )}
                        {isPdf && (
                            <iframe
                                src={path}
                                title={filename}
                                className="w-full h-96 rounded"
                            />
                        )}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

// ============================================
// File Attachment Extension
// ============================================

export const FileAttachmentExtension = Node.create({
    name: 'fileAttachment',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: () => crypto.randomUUID() },
            filename: { default: '' },
            path: { default: '' },
            mimeType: { default: 'application/octet-stream' },
            size: { default: 0 },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-type="file-attachment"]' }]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['div', mergeAttributes({ 'data-type': 'file-attachment' }, HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(FileAttachmentNodeView)
    },
})

export default FileAttachmentExtension
