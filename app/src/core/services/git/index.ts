/**
 * Git Services - Public API
 * 
 * Export all Git-related services and types
 */

// Services
export { GitService, createGitService } from './gitService'
export { HistoryService, createHistoryService } from './historyService'
export { DiffService, createDiffService, diffService } from './diffService'
export { AutoCommitService, createAutoCommitService } from './autoCommitService'
export { ConflictResolver, createConflictResolver, conflictResolver } from './conflictResolver'

// Mock Services (for browser development)
export {
    MockGitService,
    MockHistoryService,
    MockAutoCommitService,
    createMockGitService,
    createMockHistoryService,
    createMockAutoCommitService,
    initializeMockRepoWithHistory,
} from './mockGitService'

// Types
export type {
    // Snapshot types
    Snapshot,
    HistoryNode,

    // Diff types
    DiffResult,
    DiffHunk,
    DiffLine,
    DiffStats,
    FileDiff,
    FileStatus,

    // Status types
    FileChange,
    RepoStatus,

    // Error types
    GitError,
    GitErrorCode,

    // Config types
    AutoCommitConfig,

    // Event types
    FileChangeEvent,
    CommitEvent,
} from './types'

export { GitOperationError, DEFAULT_AUTO_COMMIT_CONFIG } from './types'

// Conflict types
export type { MergeConflict, ConflictMarker, ResolutionChoice } from './conflictResolver'
