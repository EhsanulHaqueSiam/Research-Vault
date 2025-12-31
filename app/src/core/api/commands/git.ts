/**
 * Git Commands
 * 
 * Tauri IPC command wrappers for Git operations
 * Following Command Pattern from ARCHITECTURE.md
 */

import { invoke } from '../tauri-client'

// ============================================
// Types
// ============================================

export interface GitStatus {
    isRepo: boolean
    isDirty: boolean
    branch: string
    changes: GitChange[]
    totalCommits: number
}

export interface GitChange {
    path: string
    status: 'added' | 'modified' | 'deleted' | 'renamed'
}

export interface GitSnapshot {
    id: string
    message: string
    timestamp: string
    author: string
    changedFiles: string[]
}

export interface GitDiff {
    files: GitFileDiff[]
    stats: { added: number; removed: number; total: number }
}

export interface GitFileDiff {
    path: string
    oldContent: string
    newContent: string
    status: 'added' | 'modified' | 'deleted'
}

// ============================================
// Git Commands
// ============================================

export const gitCommands = {
    /**
     * Initialize version control for a project
     */
    init: (projectPath: string) =>
        invoke<void>('git_init', { path: projectPath }),

    /**
     * Check if path is a Git repository
     */
    isRepo: (projectPath: string) =>
        invoke<boolean>('git_is_repo', { path: projectPath }),

    /**
     * Get repository status
     */
    getStatus: (projectPath: string) =>
        invoke<GitStatus>('git_get_status', { path: projectPath }),

    /**
     * Save a snapshot (stage all + commit)
     */
    saveSnapshot: (projectPath: string, message: string) =>
        invoke<GitSnapshot>('git_save_snapshot', { path: projectPath, message }),

    /**
     * Get commit history
     */
    getHistory: (projectPath: string, limit: number = 50) =>
        invoke<GitSnapshot[]>('git_get_history', { path: projectPath, limit }),

    /**
     * Restore to a previous snapshot
     */
    restore: (projectPath: string, snapshotId: string) =>
        invoke<void>('git_restore', { path: projectPath, snapshotId }),

    /**
     * Get diff between two snapshots
     */
    getDiff: (projectPath: string, fromId: string, toId: string) =>
        invoke<GitDiff>('git_get_diff', { path: projectPath, fromId, toId }),

    /**
     * Get file content at a specific snapshot
     */
    getFileAtSnapshot: (projectPath: string, snapshotId: string, filePath: string) =>
        invoke<string>('git_get_file_at_snapshot', { path: projectPath, snapshotId, file: filePath }),
}

// Default export for convenience
export default gitCommands
