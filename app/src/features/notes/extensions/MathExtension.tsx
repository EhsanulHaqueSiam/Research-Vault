/**
 * Math Extension for Tiptap
 * 
 * Renders LaTeX math equations using KaTeX
 * - Inline math: $E=mc^2$
 * - Block math: $$\int_0^\infty f(x) dx$$
 */

import { Node, mergeAttributes, type NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useState, useCallback, useEffect, useRef } from 'react'

// ============================================
// Math Node View Component
// ============================================

function MathNodeView({ node, updateAttributes, selected }: NodeViewProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [latex, setLatex] = useState(node.attrs.latex as string || '')
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const displayMode = node.attrs.displayMode as boolean

    const renderMath = useCallback((formula: string) => {
        try {
            return katex.renderToString(formula, {
                displayMode,
                throwOnError: false,
                errorColor: '#cc0000',
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid LaTeX')
            return ''
        }
    }, [displayMode])

    const handleSave = useCallback(() => {
        updateAttributes({ latex })
        setIsEditing(false)
        setError(null)
    }, [latex, updateAttributes])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handleSave()
        }
        if (e.key === 'Escape') {
            setLatex(node.attrs.latex as string || '')
            setIsEditing(false)
        }
    }, [handleSave, node.attrs.latex])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const renderedMath = renderMath(node.attrs.latex as string || '')

    return (
        <NodeViewWrapper
            className={`math-node ${displayMode ? 'block' : 'inline'} ${selected ? 'selected' : ''}`}
            as={displayMode ? 'div' : 'span'}
        >
            {isEditing ? (
                <div className={`math-editor ${displayMode ? 'block-math' : 'inline-math'}`}>
                    <textarea
                        ref={inputRef}
                        value={latex}
                        onChange={(e) => setLatex(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        placeholder="Enter LaTeX..."
                        className="w-full p-2 font-mono text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded resize-none"
                        rows={displayMode ? 3 : 1}
                    />
                    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
                    <div className="text-xs text-slate-500 mt-1">
                        Press Ctrl+Enter to save, Escape to cancel
                    </div>
                </div>
            ) : (
                <span
                    className={`math-content cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 ${selected ? 'ring-2 ring-blue-500' : ''
                        }`}
                    onClick={() => setIsEditing(true)}
                    dangerouslySetInnerHTML={{ __html: renderedMath || '<span class="text-slate-400">Click to add equation</span>' }}
                />
            )}
        </NodeViewWrapper>
    )
}

// ============================================
// Inline Math Extension
// ============================================

export const InlineMath = Node.create({
    name: 'inlineMath',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            latex: { default: '' },
            displayMode: { default: false },
        }
    },

    parseHTML() {
        return [{ tag: 'span[data-type="inline-math"]' }]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'inline-math' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MathNodeView)
    },
})

// ============================================
// Block Math Extension
// ============================================

export const BlockMath = Node.create({
    name: 'blockMath',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            latex: { default: '' },
            displayMode: { default: true },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-type="block-math"]' }]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'block-math', class: 'text-center my-4' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MathNodeView)
    },
})

// ============================================
// Combined Export
// ============================================

export const MathExtension = { InlineMath, BlockMath }
export default MathExtension
