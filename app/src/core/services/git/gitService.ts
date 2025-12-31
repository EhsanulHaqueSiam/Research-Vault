/**
 * Git Service
 * 
 * User-friendly Git abstraction layer using isomorphic-git
 * Hides Git terminology and provides intuitive API for version control
 */

import git from 'isomorphic-git'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type {
    Snapshot,
    RepoStatus,
    FileChange,
    FileStatus,
    DiffResult,
    FileDiff,
} from './types'
import { GitOperationError } from './types'

// ============================================
// Git Service Class
// ============================================

/**
 * GitService provides user-friendly version control operations
 * 
 * @example
 * ```ts
 * const git = new GitService('/path/to/project')
 * await git.initVersion()
 * await git.saveSnapshot('Initial setup')
 * const history = await git.getHistory()
 * ```
 */
export class GitService {
    private repoPath: string
    private author: { name: string; email: string }

    constructor(repoPath: string, author?: { name: string; email: string }) {
        this.repoPath = repoPath
        this.author = author || {
            name: 'Research Manager',
            email: 'research@local',
        }
    }

    // ============================================
    // Repository Initialization
    // ============================================

    /**
     * Initialize version control for a project
     * Creates a new Git repository if one doesn't exist
     */
    async initVersion(): Promise<void> {
        try {
            // Check if already a repo
            const isRepo = await this.isVersioned()
            if (isRepo) {
                throw new GitOperationError(
                    'ALREADY_A_REPO',
                    'This project already has version control enabled.',
                    `Repository already exists at ${this.repoPath}`
                )
            }

            await git.init({ fs, dir: this.repoPath })

            // Create initial .gitignore if it doesn't exist
            const gitignorePath = path.join(this.repoPath, '.gitignore')
            if (!fs.existsSync(gitignorePath)) {
                const defaultIgnore = [
                    '# OS files',
                    '.DS_Store',
                    'Thumbs.db',
                    '',
                    '# Temp files',
                    '*.tmp',
                    '*.log',
                    '',
                    '# IDE',
                    '.idea/',
                    '.vscode/',
                    '',
                ].join('\n')
                fs.writeFileSync(gitignorePath, defaultIgnore)
            }
        } catch (error) {
            if (error instanceof GitOperationError) throw error
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to initialize version control.',
                String(error)
            )
        }
    }

    /**
     * Check if the project has version control enabled
     */
    async isVersioned(): Promise<boolean> {
        try {
            const gitDir = path.join(this.repoPath, '.git')
            return fs.existsSync(gitDir)
        } catch {
            return false
        }
    }

    // ============================================
    // Snapshot Operations (Commits)
    // ============================================

    /**
     * Save a snapshot of the current project state
     * This stages all changes and creates a commit
     * 
     * @param message - Description of the changes
     * @returns The created snapshot
     */
    async saveSnapshot(message: string): Promise<Snapshot> {
        try {
            // Verify this is a repo
            if (!(await this.isVersioned())) {
                throw new GitOperationError(
                    'NOT_A_REPO',
                    'Version control is not enabled for this project.',
                    `No git repository at ${this.repoPath}`
                )
            }

            // Stage all changes
            await this.stageAll()

            // Check if there are changes to commit
            const status = await this.getStatus()
            if (!status.isDirty) {
                throw new GitOperationError(
                    'NO_CHANGES',
                    'No changes to save. Your project is up to date.',
                    'Working directory is clean'
                )
            }

            // Create commit
            const sha = await this.commit(message)

            // Get the commit details
            const commit = await git.readCommit({ fs, dir: this.repoPath, oid: sha })

            return {
                id: sha,
                message: commit.commit.message,
                timestamp: new Date(commit.commit.author.timestamp * 1000),
                author: commit.commit.author.name,
                changedFiles: status.changes.map(c => c.path),
            }
        } catch (error) {
            if (error instanceof GitOperationError) throw error
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to save snapshot.',
                String(error)
            )
        }
    }

    /**
     * Stage all changes in the working directory
     */
    private async stageAll(): Promise<void> {
        // Get all files in directory (recursively)
        const files = await this.getAllFiles(this.repoPath)

        for (const filepath of files) {
            const relativePath = path.relative(this.repoPath, filepath)

            // Skip .git directory
            if (relativePath.startsWith('.git')) continue

            await git.add({ fs, dir: this.repoPath, filepath: relativePath })
        }

        // Also handle deleted files
        const status = await git.statusMatrix({ fs, dir: this.repoPath })
        for (const [filepath, head, workdir] of status) {
            // File deleted (was in HEAD, not in workdir)
            if (head === 1 && workdir === 0) {
                await git.remove({ fs, dir: this.repoPath, filepath })
            }
        }
    }

    /**
     * Create a commit with the staged changes
     */
    private async commit(message: string): Promise<string> {
        return await git.commit({
            fs,
            dir: this.repoPath,
            message,
            author: this.author,
        })
    }

    /**
     * Get all files in a directory recursively
     */
    private async getAllFiles(dir: string): Promise<string[]> {
        const files: string[] = []
        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                if (entry.name === '.git') continue // Skip .git
                files.push(...await this.getAllFiles(fullPath))
            } else {
                files.push(fullPath)
            }
        }

        return files
    }

    // ============================================
    // Status Operations
    // ============================================

    /**
     * Get the current status of the repository
     */
    async getStatus(): Promise<RepoStatus> {
        try {
            if (!(await this.isVersioned())) {
                return {
                    isRepo: false,
                    currentBranch: '',
                    headCommit: null,
                    changes: [],
                    isDirty: false,
                    totalCommits: 0,
                }
            }

            // Get current branch
            const currentBranch = await git.currentBranch({
                fs,
                dir: this.repoPath,
                fullname: false,
            }) || 'main'

            // Get HEAD commit
            let headCommit: string | null = null
            try {
                headCommit = await git.resolveRef({
                    fs,
                    dir: this.repoPath,
                    ref: 'HEAD',
                })
            } catch {
                // No commits yet
            }

            // Get file changes
            const statusMatrix = await git.statusMatrix({ fs, dir: this.repoPath })
            const changes: FileChange[] = []

            for (const [filepath, head, workdir, stage] of statusMatrix) {
                let status: FileStatus | null = null
                let staged = stage !== head

                // Determine status
                if (head === 0 && workdir === 2) {
                    status = 'added'
                } else if (head === 1 && workdir === 0) {
                    status = 'deleted'
                } else if (head === 1 && workdir === 2 && stage !== workdir) {
                    status = 'modified'
                }

                if (status) {
                    changes.push({ path: filepath, status, staged })
                }
            }

            // Count total commits
            let totalCommits = 0
            if (headCommit) {
                const commits = await git.log({ fs, dir: this.repoPath })
                totalCommits = commits.length
            }

            return {
                isRepo: true,
                currentBranch,
                headCommit,
                changes,
                isDirty: changes.length > 0,
                totalCommits,
            }
        } catch (error) {
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to check project status.',
                String(error)
            )
        }
    }

    // ============================================
    // History Operations
    // ============================================

    /**
     * Get the history of snapshots (commits)
     * 
     * @param limit - Maximum number of snapshots to return
     */
    async getHistory(limit: number = 50): Promise<Snapshot[]> {
        try {
            if (!(await this.isVersioned())) {
                return []
            }

            const commits = await git.log({
                fs,
                dir: this.repoPath,
                depth: limit,
            })

            return commits.map(commit => ({
                id: commit.oid,
                message: commit.commit.message,
                timestamp: new Date(commit.commit.author.timestamp * 1000),
                author: commit.commit.author.name,
                changedFiles: [], // Would need to compute diff for each
            }))
        } catch (error) {
            // No commits yet
            if (String(error).includes('Could not find')) {
                return []
            }
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to retrieve history.',
                String(error)
            )
        }
    }

    /**
     * Get a specific snapshot by ID
     */
    async getSnapshot(snapshotId: string): Promise<Snapshot | null> {
        try {
            const commit = await git.readCommit({
                fs,
                dir: this.repoPath,
                oid: snapshotId,
            })

            return {
                id: commit.oid,
                message: commit.commit.message,
                timestamp: new Date(commit.commit.author.timestamp * 1000),
                author: commit.commit.author.name,
                changedFiles: [],
            }
        } catch {
            return null
        }
    }

    // ============================================
    // Restore Operations
    // ============================================

    /**
     * Restore the project to a previous snapshot
     * 
     * @param snapshotId - The ID of the snapshot to restore to
     */
    async restoreToPoint(snapshotId: string): Promise<void> {
        try {
            // Verify snapshot exists
            const snapshot = await this.getSnapshot(snapshotId)
            if (!snapshot) {
                throw new GitOperationError(
                    'COMMIT_NOT_FOUND',
                    'The restore point was not found. It may have been removed.',
                    `Commit ${snapshotId} not found`
                )
            }

            // Checkout the commit
            await git.checkout({
                fs,
                dir: this.repoPath,
                ref: snapshotId,
                force: true,
            })
        } catch (error) {
            if (error instanceof GitOperationError) throw error
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to restore to this point.',
                String(error)
            )
        }
    }

    /**
     * Create a new branch from a snapshot
     * This is used when restoring creates a detached HEAD
     */
    async createBranchFromPoint(snapshotId: string, branchName: string): Promise<void> {
        try {
            await git.branch({
                fs,
                dir: this.repoPath,
                ref: branchName,
                object: snapshotId,
            })

            await git.checkout({
                fs,
                dir: this.repoPath,
                ref: branchName,
            })
        } catch (error) {
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to create branch.',
                String(error)
            )
        }
    }

    // ============================================
    // Diff Operations
    // ============================================

    /**
     * Get the diff between two snapshots
     */
    async getChanges(fromId: string, toId: string): Promise<FileDiff[]> {
        try {
            // Get trees for both commits
            const fromCommit = await git.readCommit({ fs, dir: this.repoPath, oid: fromId })
            const toCommit = await git.readCommit({ fs, dir: this.repoPath, oid: toId })

            // Walk both trees and compare
            const changes = await git.walk({
                fs,
                dir: this.repoPath,
                trees: [
                    git.TREE({ ref: fromCommit.oid }),
                    git.TREE({ ref: toCommit.oid }),
                ],
                map: async (filepath, [fromEntry, toEntry]) => {
                    if (!filepath) return null

                    // Determine change type
                    const fromOid = fromEntry ? await fromEntry.oid() : null
                    const toOid = toEntry ? await toEntry.oid() : null

                    if (fromOid === toOid) return null // No change

                    let status: FileStatus
                    if (!fromOid) status = 'added'
                    else if (!toOid) status = 'deleted'
                    else status = 'modified'

                    // Get content for text files
                    let oldContent = ''
                    let newContent = ''

                    try {
                        if (fromEntry && status !== 'added') {
                            const blob = await fromEntry.content()
                            oldContent = blob ? new TextDecoder().decode(blob) : ''
                        }
                        if (toEntry && status !== 'deleted') {
                            const blob = await toEntry.content()
                            newContent = blob ? new TextDecoder().decode(blob) : ''
                        }
                    } catch {
                        // Binary file, skip content
                    }

                    return {
                        path: filepath,
                        oldContent,
                        newContent,
                        diff: { hunks: [], stats: { added: 0, removed: 0, total: 0 } } as DiffResult,
                        isBinary: false,
                        status,
                    } as FileDiff
                },
            })

            return changes.filter((c: FileDiff | null): c is FileDiff => c !== null)
        } catch (error) {
            throw new GitOperationError(
                'UNKNOWN_ERROR',
                'Unable to get changes between versions.',
                String(error)
            )
        }
    }

    // ============================================
    // Utility Methods
    // ============================================

    /**
     * Get the repository path
     */
    getRepoPath(): string {
        return this.repoPath
    }

    /**
     * Set the author for commits
     */
    setAuthor(name: string, email: string): void {
        this.author = { name, email }
    }
}

// ============================================
// Factory Function
// ============================================

/**
 * Create a new GitService instance
 */
export function createGitService(
    repoPath: string,
    author?: { name: string; email: string }
): GitService {
    return new GitService(repoPath, author)
}
