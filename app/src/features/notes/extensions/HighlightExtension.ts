/**
 * Highlight/Annotation Extension for Tiptap
 * 
 * Text highlighting with color picker and annotations
 */

import { Mark, mergeAttributes } from '@tiptap/core'

// ============================================
// Types
// ============================================

export interface HighlightOptions {
    colors: string[]
    defaultColor: string
}

// ============================================
// Highlight Extension
// ============================================

export const HighlightExtension = Mark.create<HighlightOptions>({
    name: 'highlight',

    addOptions() {
        return {
            colors: [
                '#fef08a', // yellow
                '#bbf7d0', // green
                '#bfdbfe', // blue
                '#fecaca', // red
                '#e9d5ff', // purple
                '#fed7aa', // orange
            ],
            defaultColor: '#fef08a',
        }
    },

    addAttributes() {
        return {
            color: {
                default: this.options.defaultColor,
                parseHTML: element => element.getAttribute('data-color') || element.style.backgroundColor,
                renderHTML: attributes => {
                    return {
                        'data-color': attributes.color,
                        style: `background-color: ${attributes.color}`,
                    }
                },
            },
            note: {
                default: null,
                parseHTML: element => element.getAttribute('data-note'),
                renderHTML: attributes => {
                    if (!attributes.note) return {}
                    return { 'data-note': attributes.note }
                },
            },
        }
    },

    parseHTML() {
        return [
            { tag: 'mark' },
            { tag: 'span[data-highlight]' },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['mark', mergeAttributes({ 'data-highlight': '' }, HTMLAttributes), 0]
    },
})

export default HighlightExtension
