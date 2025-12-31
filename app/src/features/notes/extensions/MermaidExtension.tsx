/**
 * Mermaid Diagram Extension for Tiptap
 * 
 * Renders Mermaid diagrams (flowcharts, sequence diagrams, etc.)
 */

import { Node, mergeAttributes, type NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import mermaid from 'mermaid'
import { useState, useCallback, useEffect, useRef, useId } from 'react'

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
})

// ============================================
// Mermaid Node View Component
// ============================================

function MermaidNodeView({ node, updateAttributes, selected }: NodeViewProps) {
    const [isEditing, setIsEditing] = useState(!(node.attrs.code as string))
    const [code, setCode] = useState(node.attrs.code as string || '')
    const [svg, setSvg] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const uniqueId = useId().replace(/:/g, '_')

    const renderDiagram = useCallback(async (mermaidCode: string) => {
        if (!mermaidCode.trim()) {
            setSvg('')
            setError(null)
            return
        }
        try {
            const { svg: renderedSvg } = await mermaid.render(`mermaid-${uniqueId}`, mermaidCode)
            setSvg(renderedSvg)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid Mermaid syntax')
            setSvg('')
        }
    }, [uniqueId])

    useEffect(() => {
        if (!isEditing && node.attrs.code) {
            renderDiagram(node.attrs.code as string)
        }
    }, [isEditing, node.attrs.code, renderDiagram])

    const handleSave = useCallback(() => {
        updateAttributes({ code })
        setIsEditing(false)
    }, [code, updateAttributes])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handleSave()
        }
        if (e.key === 'Escape') {
            setCode(node.attrs.code as string || '')
            setIsEditing(false)
        }
    }, [handleSave, node.attrs.code])

    useEffect(() => {
        if (isEditing && textareaRef.current) textareaRef.current.focus()
    }, [isEditing])

    useEffect(() => {
        if (isEditing && code) {
            const debounce = setTimeout(() => renderDiagram(code), 500)
            return () => clearTimeout(debounce)
        }
    }, [code, isEditing, renderDiagram])

    return (
        <NodeViewWrapper className={`mermaid-node my-4 ${selected ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Mermaid Diagram</span>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                        {isEditing ? 'Preview' : 'Edit'}
                    </button>
                </div>

                {isEditing ? (
                    <div className="p-3">
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`flowchart TD\n    A[Start] --> B{Decision}`}
                            className="w-full h-40 p-2 font-mono text-sm bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded resize-none"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">Ctrl+Enter to save</span>
                            <button onClick={handleSave} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                        </div>
                        {svg && !error && (
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="text-xs text-slate-500 mb-2">Preview:</div>
                                <div className="mermaid-preview bg-white dark:bg-slate-900 p-4 rounded flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mermaid-content p-4 bg-white dark:bg-slate-900 flex justify-center cursor-pointer" onClick={() => setIsEditing(true)}>
                        {error ? <div className="text-red-500 text-sm">{error}</div> : svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="text-slate-400 text-sm py-8">Click to add a Mermaid diagram</div>}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

// ============================================
// Mermaid Extension
// ============================================

export const MermaidExtension = Node.create({
    name: 'mermaid',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return { code: { default: '' } }
    },

    parseHTML() {
        return [{ tag: 'div[data-type="mermaid"]' }]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mermaid' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidNodeView)
    },
})

export default MermaidExtension
