/**
 * Git History Feature - Public API
 * 
 * Visual undo tree and version history for projects
 */

// Components
export { UndoTree } from './components/UndoTree'
export { SnapshotNode } from './components/SnapshotNode'
export { TreeControls } from './components/TreeControls'
export { PreviewPanel } from './components/PreviewPanel'

// Hooks
export {
    useGitStatus,
    useGitHistory,
    useGitTree,
    useGitSnapshot,
    useSaveSnapshot,
    useRestoreSnapshot,
    useInitVersion,
    useAutoCommit,
    useProjectGit,
    gitKeys,
    clearGitServices,
} from './hooks/useGit'

// Types
export type {
    UndoTreeProps,
    SnapshotNodeData,
    SnapshotEdgeData,
    TreeLayoutConfig,
} from './components/types'

export { DEFAULT_LAYOUT_CONFIG } from './components/types'
