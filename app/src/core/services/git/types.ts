/**
 * Git Service Types
 * 
 * Shared type definitions for Git abstraction layer
 */

// ============================================
// Snapshot Types (User-friendly commit representation)
// ============================================

/**
 * A snapshot represents a saved point in project history
 * (User-friendly abstraction over Git commits)
 */
export interface Snapshot {
    /** Unique identifier (commit SHA) */
    id: string
    /** User-provided or auto-generated description */
    message: string
    /** When this snapshot was created */
    timestamp: Date
    /** Who created this snapshot */
    author: string
    /** List of files changed in this snapshot */
    changedFiles: string[]
}

/**
 * Extended snapshot with tree relationship info
 */
export interface HistoryNode extends Snapshot {
    /** Parent snapshot IDs */
    parentIds: string[]
    /** Child snapshot IDs (computed) */
    children: string[]
    /** Whether this is a branch point */
    isBranchPoint: boolean
    /** Whether this is the current HEAD */
    isCurrent: boolean
}

// ============================================
// Diff Types
// ============================================

/**
 * A single change hunk in a diff
 */
export interface DiffHunk {
    /** Starting line in old file */
    oldStart: number
    /** Number of lines in old file */
    oldLines: number
    /** Starting line in new file */
    newStart: number
    /** Number of lines in new file */
    newLines: number
    /** The actual diff lines */
    lines: DiffLine[]
}

/**
 * A single line in a diff
 */
export interface DiffLine {
    /** Type: added, removed, or context */
    type: 'add' | 'remove' | 'context'
    /** The actual content */
    content: string
    /** Line number in old file (for remove/context) */
    oldLineNumber?: number
    /** Line number in new file (for add/context) */
    newLineNumber?: number
}

/**
 * Result of a diff operation
 */
export interface DiffResult {
    /** The diff hunks */
    hunks: DiffHunk[]
    /** Statistics about the diff */
    stats: DiffStats
}

/**
 * Statistics about a diff
 */
export interface DiffStats {
    /** Lines added */
    added: number
    /** Lines removed */
    removed: number
    /** Total lines changed */
    total: number
}

/**
 * Diff for a single file
 */
export interface FileDiff {
    /** File path relative to repo root */
    path: string
    /** Old file content (empty for new files) */
    oldContent: string
    /** New file content (empty for deleted files) */
    newContent: string
    /** The diff result */
    diff: DiffResult
    /** Whether the file is binary */
    isBinary: boolean
    /** File status */
    status: FileStatus
}

/**
 * File status in a snapshot
 */
export type FileStatus = 'added' | 'modified' | 'deleted' | 'renamed'

// ============================================
// Status Types
// ============================================

/**
 * File change in working directory
 */
export interface FileChange {
    /** File path relative to repo root */
    path: string
    /** Type of change */
    status: FileStatus
    /** Whether file is staged */
    staged: boolean
}

/**
 * Repository status
 */
export interface RepoStatus {
    /** Whether this is a valid Git repository */
    isRepo: boolean
    /** Current branch/ref name */
    currentBranch: string
    /** Current HEAD commit SHA */
    headCommit: string | null
    /** List of changed files */
    changes: FileChange[]
    /** Whether there are uncommitted changes */
    isDirty: boolean
    /** Total number of commits */
    totalCommits: number
}

// ============================================
// Error Types
// ============================================

/**
 * Error codes for Git operations
 */
export type GitErrorCode =
    | 'NOT_A_REPO'
    | 'ALREADY_A_REPO'
    | 'COMMIT_NOT_FOUND'
    | 'NO_CHANGES'
    | 'MERGE_CONFLICT'
    | 'INVALID_PATH'
    | 'PERMISSION_DENIED'
    | 'UNKNOWN_ERROR'

/**
 * Git operation error with user-friendly message
 */
export interface GitError {
    /** Error code for programmatic handling */
    code: GitErrorCode
    /** User-friendly error message */
    userMessage: string
    /** Technical error message for debugging */
    technicalMessage: string
}

/**
 * Custom error class for Git operations
 */
export class GitOperationError extends Error {
    code: GitErrorCode
    userMessage: string

    constructor(code: GitErrorCode, userMessage: string, technicalMessage?: string) {
        super(technicalMessage || userMessage)
        this.name = 'GitOperationError'
        this.code = code
        this.userMessage = userMessage
    }
}

// ============================================
// Configuration Types
// ============================================

/**
 * Auto-commit configuration
 */
export interface AutoCommitConfig {
    /** Whether auto-commit is enabled */
    enabled: boolean
    /** Debounce interval in milliseconds */
    debounceMs: number
    /** Patterns to ignore (glob patterns) */
    ignorePatterns: string[]
    /** Maximum number of auto-commits to keep */
    maxAutoCommits: number
}

/**
 * Default auto-commit configuration
 */
export const DEFAULT_AUTO_COMMIT_CONFIG: AutoCommitConfig = {
    enabled: true,
    debounceMs: 3000,
    ignorePatterns: [
        '*.log',
        '*.tmp',
        '.DS_Store',
        'node_modules/**',
        '.git/**',
    ],
    maxAutoCommits: 100,
}

// ============================================
// Event Types
// ============================================

/**
 * File change event from watcher
 */
export interface FileChangeEvent {
    /** Type of change */
    type: 'create' | 'modify' | 'delete'
    /** File path */
    path: string
    /** Timestamp of change */
    timestamp: Date
}

/**
 * Commit event emitted after successful commit
 */
export interface CommitEvent {
    /** The new snapshot */
    snapshot: Snapshot
    /** Whether this was an auto-commit */
    isAutoCommit: boolean
    /** Time taken to commit (ms) */
    duration: number
}
