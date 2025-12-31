/**
 * Diff Viewer Feature - Public API
 * 
 * Visual diff viewer for comparing file versions
 */

// Main component
export { DiffViewer } from './components/DiffViewer'

// Sub-components
export { DiffHeader } from './components/DiffHeader'
export { DiffContent } from './components/DiffContent'
export { DiffNavigation } from './components/DiffNavigation'
export { ImageDiff } from './components/ImageDiff'

// Types
export type {
    DiffViewerProps,
    DiffHeaderProps,
    DiffContentProps,
    ImageDiffProps,
    DiffNavigationProps,
    DiffViewMode,
} from './types'
