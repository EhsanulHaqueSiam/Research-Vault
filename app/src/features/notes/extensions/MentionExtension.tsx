/**
 * Mention Extension for Tiptap
 * 
 * @mentions for users, #projects, !tasks
 */

import { Node, mergeAttributes, type NodeViewProps } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'

// ============================================
// Types
// ============================================

export type MentionType = 'user' | 'project' | 'task'

export interface MentionItem {
    id: string
    label: string
    type: MentionType
    icon?: string
}

// ============================================
// Mention Node View
// ============================================

function MentionNodeView({ node }: NodeViewProps) {
    const label = node.attrs.label as string
    const type = node.attrs.type as MentionType

    const bgColor = {
        user: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        project: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        task: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    }[type]

    const prefix = { user: '@', project: '#', task: '!' }[type]

    return (
        <NodeViewWrapper as="span" className="inline">
            <span className={`mention inline-flex items-center px-1.5 py-0.5 rounded text-sm font-medium cursor-pointer hover:opacity-80 ${bgColor}`}>
                {prefix}{label}
            </span>
        </NodeViewWrapper>
    )
}

// ============================================
// Mention Extension
// ============================================

export const MentionExtension = Node.create({
    name: 'mention',
    group: 'inline',
    inline: true,
    selectable: false,
    atom: true,

    addAttributes() {
        return {
            id: { default: null },
            label: { default: null },
            type: { default: 'user' as MentionType },
        }
    },

    parseHTML() {
        return [{ tag: 'span[data-type="mention"]' }]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['span', mergeAttributes({ 'data-type': 'mention' }, HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MentionNodeView)
    },
})

export default MentionExtension
