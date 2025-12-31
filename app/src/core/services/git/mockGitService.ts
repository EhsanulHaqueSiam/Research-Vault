/**
 * Browser-Compatible Git Service Mock
 * 
 * Provides in-memory mock Git operations for browser development
 * Real Git operations only work in Tauri (via Rust backend)
 */

import type {
    Snapshot,
    HistoryNode,
    RepoStatus,
    AutoCommitConfig,
    CommitEvent,
} from './types'
import { DEFAULT_AUTO_COMMIT_CONFIG } from './types'

// ============================================
// In-Memory Storage
// ============================================

interface MockRepo {
    path: string
    isInitialized: boolean
    snapshots: Snapshot[]
    files: Map<string, string>
    currentHead: string | null
}

const mockRepos = new Map<string, MockRepo>()

function getOrCreateRepo(path: string): MockRepo {
    if (!mockRepos.has(path)) {
        mockRepos.set(path, {
            path,
            isInitialized: false,
            snapshots: [],
            files: new Map(),
            currentHead: null,
        })
    }
    return mockRepos.get(path)!
}

// ============================================
// Mock Git Service
// ============================================

export class MockGitService {
    private repoPath: string
    private author: { name: string; email: string }

    constructor(repoPath: string, author?: { name: string; email: string }) {
        this.repoPath = repoPath
        this.author = author || {
            name: 'Research Manager',
            email: 'research@local',
        }
    }

    async initVersion(): Promise<void> {
        const repo = getOrCreateRepo(this.repoPath)
        if (repo.isInitialized) {
            throw new Error('Repository already initialized')
        }
        repo.isInitialized = true

        // Create initial commit
        const snapshot: Snapshot = {
            id: `snap-${Date.now()}`,
            message: 'Initial commit',
            timestamp: new Date(),
            author: this.author.name,
            changedFiles: [],
        }
        repo.snapshots.push(snapshot)
        repo.currentHead = snapshot.id

        console.log('[MockGit] Initialized repository at:', this.repoPath)
    }

    async isVersioned(): Promise<boolean> {
        const repo = mockRepos.get(this.repoPath)
        return repo?.isInitialized ?? false
    }

    async saveSnapshot(message: string): Promise<Snapshot> {
        const repo = getOrCreateRepo(this.repoPath)
        if (!repo.isInitialized) {
            // Auto-initialize for easier testing
            await this.initVersion()
        }

        const snapshot: Snapshot = {
            id: `snap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message,
            timestamp: new Date(),
            author: this.author.name,
            changedFiles: ['file1.txt', 'file2.md'],
        }

        repo.snapshots.unshift(snapshot) // Add at beginning (newest first)
        repo.currentHead = snapshot.id

        console.log('[MockGit] Saved snapshot:', message)
        return snapshot
    }

    async getStatus(): Promise<RepoStatus> {
        const repo = mockRepos.get(this.repoPath)
        if (!repo?.isInitialized) {
            return {
                isRepo: false,
                currentBranch: '',
                headCommit: null,
                changes: [],
                isDirty: false,
                totalCommits: 0,
            }
        }

        return {
            isRepo: true,
            currentBranch: 'main',
            headCommit: repo.currentHead,
            changes: [],
            isDirty: false,
            totalCommits: repo.snapshots.length,
        }
    }

    async getHistory(limit: number = 50): Promise<Snapshot[]> {
        const repo = mockRepos.get(this.repoPath)
        if (!repo?.isInitialized) {
            return []
        }
        return repo.snapshots.slice(0, limit)
    }

    async getSnapshot(snapshotId: string): Promise<Snapshot | null> {
        const repo = mockRepos.get(this.repoPath)
        return repo?.snapshots.find(s => s.id === snapshotId) ?? null
    }

    async restoreToPoint(snapshotId: string): Promise<void> {
        const repo = mockRepos.get(this.repoPath)
        if (!repo) return

        const snapshot = repo.snapshots.find(s => s.id === snapshotId)
        if (snapshot) {
            repo.currentHead = snapshotId
            console.log('[MockGit] Restored to:', snapshot.message)
        }
    }

    async createBranchFromPoint(snapshotId: string, branchName: string): Promise<void> {
        console.log('[MockGit] Created branch:', branchName, 'from:', snapshotId)
    }

    getRepoPath(): string {
        return this.repoPath
    }

    setAuthor(name: string, email: string): void {
        this.author = { name, email }
    }
}

// ============================================
// Mock History Service
// ============================================

export class MockHistoryService {
    private repoPath: string

    constructor(repoPath: string) {
        this.repoPath = repoPath
    }

    async getTreeStructure(limit: number = 100): Promise<HistoryNode[]> {
        const repo = mockRepos.get(this.repoPath)
        if (!repo?.isInitialized || repo.snapshots.length === 0) {
            return []
        }

        // Convert snapshots to history nodes
        return repo.snapshots.slice(0, limit).map((snapshot, index, arr) => ({
            id: snapshot.id,
            message: snapshot.message,
            timestamp: snapshot.timestamp,
            author: snapshot.author,
            changedFiles: snapshot.changedFiles,
            parentIds: index < arr.length - 1 ? [arr[index + 1].id] : [],
            children: index > 0 ? [arr[index - 1].id] : [],
            isBranchPoint: false,
            isCurrent: snapshot.id === repo.currentHead,
        }))
    }

    async findBranchPoints(): Promise<HistoryNode[]> {
        return []
    }

    async getBranches(): Promise<string[]> {
        const repo = mockRepos.get(this.repoPath)
        return repo?.isInitialized ? ['main'] : []
    }

    async getCurrentBranch(): Promise<string> {
        return 'main'
    }

    async getStats(): Promise<{
        totalSnapshots: number
        branchPoints: number
        branches: number
        firstSnapshot: Date | null
        lastSnapshot: Date | null
    }> {
        const repo = mockRepos.get(this.repoPath)
        if (!repo?.isInitialized) {
            return {
                totalSnapshots: 0,
                branchPoints: 0,
                branches: 0,
                firstSnapshot: null,
                lastSnapshot: null,
            }
        }

        return {
            totalSnapshots: repo.snapshots.length,
            branchPoints: 0,
            branches: 1,
            firstSnapshot: repo.snapshots[repo.snapshots.length - 1]?.timestamp ?? null,
            lastSnapshot: repo.snapshots[0]?.timestamp ?? null,
        }
    }

    clearCache(): void {
        // No-op for mock
    }
}

// ============================================
// Mock Auto-Commit Service
// ============================================

export class MockAutoCommitService {
    private config: AutoCommitConfig = { ...DEFAULT_AUTO_COMMIT_CONFIG }
    private isActive: boolean = false
    private pendingCount: number = 0
    private listeners: Map<string, Set<Function>> = new Map()
    private git: MockGitService

    constructor(git: MockGitService, _history: MockHistoryService) {
        this.git = git
    }

    startWatching(): void {
        this.isActive = true
        console.log('[MockAutoCommit] Started watching')
    }

    stopWatching(): void {
        this.isActive = false
        console.log('[MockAutoCommit] Stopped watching')
    }

    enable(): void {
        this.config.enabled = true
    }

    disable(): void {
        this.config.enabled = false
    }

    setDebounceMs(ms: number): void {
        this.config.debounceMs = ms
    }

    getConfig(): AutoCommitConfig {
        return { ...this.config }
    }

    setConfig(config: Partial<AutoCommitConfig>): void {
        this.config = { ...this.config, ...config }
    }

    getPendingCount(): number {
        return this.pendingCount
    }

    isWatchingActive(): boolean {
        return this.isActive
    }

    onFileChange(event: { type: string; path: string; timestamp: Date }): void {
        this.pendingCount++
        console.log('[MockAutoCommit] File changed:', event.path)
    }

    async forceCommit(message?: string): Promise<Snapshot | null> {
        const snapshot = await this.git.saveSnapshot(message || 'Auto-commit')
        this.pendingCount = 0
        const event: CommitEvent = {
            snapshot,
            isAutoCommit: false,
            duration: 0,
        }
        this.emit('commit', event)
        return snapshot
    }

    on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(callback)
    }

    off(event: string, callback: Function): void {
        this.listeners.get(event)?.delete(callback)
    }

    private emit(event: string, data: any): void {
        this.listeners.get(event)?.forEach(cb => cb(data))
    }
}

// ============================================
// Factory Functions
// ============================================

export function createMockGitService(
    repoPath: string,
    author?: { name: string; email: string }
): MockGitService {
    return new MockGitService(repoPath, author)
}

export function createMockHistoryService(repoPath: string): MockHistoryService {
    return new MockHistoryService(repoPath)
}

export function createMockAutoCommitService(
    git: MockGitService,
    history: MockHistoryService
): MockAutoCommitService {
    return new MockAutoCommitService(git, history)
}

// ============================================
// Demo Data Enhancement
// ============================================

/**
 * Initialize a mock repository with sample history for demo/testing
 */
export function initializeMockRepoWithHistory(path: string): void {
    const repo = getOrCreateRepo(path)
    repo.isInitialized = true

    // Create sample snapshot history
    const now = Date.now()
    repo.snapshots = [
        {
            id: `snap-${now}-001`,
            message: 'Updated research methodology section',
            timestamp: new Date(now - 3600000), // 1 hour ago
            author: 'Research Manager',
            changedFiles: ['methodology.md'],
        },
        {
            id: `snap-${now}-002`,
            message: 'Added literature review notes',
            timestamp: new Date(now - 7200000), // 2 hours ago
            author: 'Research Manager',
            changedFiles: ['notes/lit-review.md'],
        },
        {
            id: `snap-${now}-003`,
            message: 'Initial project setup',
            timestamp: new Date(now - 10800000), // 3 hours ago
            author: 'Research Manager',
            changedFiles: ['README.md', 'config.json'],
        },
    ]
    repo.currentHead = repo.snapshots[0].id

    console.log('[MockGit] Initialized demo repository at:', path)
}
