/**
 * Auto-Commit Service
 * 
 * Automatic versioning system with debouncing
 */

import type {
    AutoCommitConfig,
    Snapshot,
    CommitEvent,
    FileChangeEvent,
} from './types'
import { DEFAULT_AUTO_COMMIT_CONFIG, GitOperationError } from './types'
import { GitService } from './gitService'
import { HistoryService } from './historyService'
import { format } from 'date-fns'

// ============================================
// Auto-Commit Service Class
// ============================================

/**
 * AutoCommitService watches for file changes and automatically
 * creates snapshots after a configurable idle period
 */
export class AutoCommitService {
    private gitService: GitService
    private historyService: HistoryService
    private config: AutoCommitConfig
    private debounceTimer: ReturnType<typeof setTimeout> | null = null
    private pendingChanges: FileChangeEvent[] = []
    private isWatching: boolean = false
    private listeners: Map<string, Set<(event: CommitEvent) => void>> = new Map()

    constructor(
        gitService: GitService,
        historyService: HistoryService,
        config?: Partial<AutoCommitConfig>
    ) {
        this.gitService = gitService
        this.historyService = historyService
        this.config = { ...DEFAULT_AUTO_COMMIT_CONFIG, ...config }
    }

    // ============================================
    // Watching
    // ============================================

    /**
     * Start watching for file changes
     * Note: Actual file system watching should be done via Tauri.
     * This service manages the debouncing and commit logic.
     */
    startWatching(): void {
        if (this.isWatching) return
        this.isWatching = true
        this.pendingChanges = []
    }

    /**
     * Stop watching for file changes
     */
    stopWatching(): void {
        this.isWatching = false
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = null
        }
        this.pendingChanges = []
    }

    /**
     * Check if currently watching
     */
    isActive(): boolean {
        return this.isWatching && this.config.enabled
    }

    // ============================================
    // File Change Handling
    // ============================================

    /**
     * Handle a file change event
     * This should be called by the file system watcher
     */
    onFileChange(event: FileChangeEvent): void {
        if (!this.isActive()) return
        if (this.shouldIgnore(event.path)) return

        this.pendingChanges.push(event)
        this.scheduleCommit()
    }

    /**
     * Check if a file path should be ignored
     */
    private shouldIgnore(path: string): boolean {
        // Always ignore .git directory
        if (path.includes('.git')) return true

        // Check against ignore patterns
        for (const pattern of this.config.ignorePatterns) {
            if (this.matchesPattern(path, pattern)) {
                return true
            }
        }

        return false
    }

    /**
     * Simple glob pattern matching
     */
    private matchesPattern(path: string, pattern: string): boolean {
        // Handle ** (any directory depth)
        if (pattern.includes('**')) {
            const parts = pattern.split('**')
            const start = parts[0].replace(/\*/g, '.*')
            const end = parts[1]?.replace(/\*/g, '.*') || ''
            const regex = new RegExp(`^${start}.*${end}$`)
            return regex.test(path)
        }

        // Handle * (single segment)
        const regex = new RegExp('^' + pattern.replace(/\*/g, '[^/]*').replace(/\./g, '\\.') + '$')
        return regex.test(path) || regex.test(path.split('/').pop() || '')
    }

    // ============================================
    // Debounced Commit
    // ============================================

    /**
     * Schedule a commit after the debounce period
     */
    private scheduleCommit(): void {
        // Clear existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }

        // Set new timer
        this.debounceTimer = setTimeout(async () => {
            await this.commitIfChanged()
        }, this.config.debounceMs)
    }

    /**
     * Check for changes and commit if any exist
     */
    async commitIfChanged(): Promise<Snapshot | null> {
        if (!this.isActive()) return null

        const startTime = Date.now()

        try {
            // Check if there are actual changes
            const status = await this.gitService.getStatus()
            if (!status.isDirty) {
                this.pendingChanges = []
                return null
            }

            // Generate commit message
            const message = this.generateMessage()

            // Create snapshot
            const snapshot = await this.gitService.saveSnapshot(message)

            // Clear cache
            this.historyService.clearCache()

            // Emit event
            const event: CommitEvent = {
                snapshot,
                isAutoCommit: true,
                duration: Date.now() - startTime,
            }
            this.emit('commit', event)

            // Clear pending changes
            this.pendingChanges = []

            return snapshot
        } catch (error) {
            // Ignore "no changes" error
            if (error instanceof GitOperationError && error.code === 'NO_CHANGES') {
                this.pendingChanges = []
                return null
            }
            throw error
        }
    }

    // ============================================
    // Message Generation
    // ============================================

    /**
     * Generate a descriptive commit message based on changes
     */
    private generateMessage(): string {
        const changes = this.pendingChanges

        if (changes.length === 0) {
            return `Auto-save: ${format(new Date(), 'h:mm a')}`
        }

        if (changes.length === 1) {
            const change = changes[0]
            const filename = change.path.split('/').pop() || change.path
            const action = this.getActionVerb(change.type)
            return `${action} ${filename}`
        }

        // Multiple files - group by directory
        const dirs = new Map<string, number>()
        for (const change of changes) {
            const parts = change.path.split('/')
            const dir = parts.length > 1 ? parts[parts.length - 2] : 'root'
            dirs.set(dir, (dirs.get(dir) || 0) + 1)
        }

        // Find most common directory
        let topDir = ''
        let topCount = 0
        for (const [dir, count] of dirs) {
            if (count > topCount) {
                topDir = dir
                topCount = count
            }
        }

        if (topCount === changes.length) {
            return `Updated ${changes.length} files in ${topDir}`
        }

        return `Updated ${changes.length} files`
    }

    /**
     * Get action verb for change type
     */
    private getActionVerb(type: FileChangeEvent['type']): string {
        switch (type) {
            case 'create': return 'Added'
            case 'modify': return 'Updated'
            case 'delete': return 'Removed'
            default: return 'Changed'
        }
    }

    // ============================================
    // Configuration
    // ============================================

    /**
     * Update configuration
     */
    setConfig(config: Partial<AutoCommitConfig>): void {
        this.config = { ...this.config, ...config }
    }

    /**
     * Get current configuration
     */
    getConfig(): AutoCommitConfig {
        return { ...this.config }
    }

    /**
     * Enable auto-commit
     */
    enable(): void {
        this.config.enabled = true
    }

    /**
     * Disable auto-commit
     */
    disable(): void {
        this.config.enabled = false
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = null
        }
    }

    /**
     * Set debounce interval
     */
    setDebounceMs(ms: number): void {
        this.config.debounceMs = Math.max(500, ms) // Minimum 500ms
    }

    // ============================================
    // Events
    // ============================================

    /**
     * Add event listener
     */
    on(event: 'commit', callback: (event: CommitEvent) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(callback)
    }

    /**
     * Remove event listener
     */
    off(event: 'commit', callback: (event: CommitEvent) => void): void {
        this.listeners.get(event)?.delete(callback)
    }

    /**
     * Emit event
     */
    private emit(event: 'commit', data: CommitEvent): void {
        const callbacks = this.listeners.get(event)
        if (callbacks) {
            for (const callback of callbacks) {
                try {
                    callback(data)
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error)
                }
            }
        }
    }

    // ============================================
    // Manual Controls
    // ============================================

    /**
     * Force an immediate commit (bypass debounce)
     */
    async forceCommit(message?: string): Promise<Snapshot | null> {
        // Cancel any pending debounce
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = null
        }

        const startTime = Date.now()

        try {
            const status = await this.gitService.getStatus()
            if (!status.isDirty) {
                return null
            }

            const commitMessage = message || this.generateMessage()
            const snapshot = await this.gitService.saveSnapshot(commitMessage)

            this.historyService.clearCache()

            const event: CommitEvent = {
                snapshot,
                isAutoCommit: false,
                duration: Date.now() - startTime,
            }
            this.emit('commit', event)

            this.pendingChanges = []
            return snapshot
        } catch (error) {
            if (error instanceof GitOperationError && error.code === 'NO_CHANGES') {
                return null
            }
            throw error
        }
    }

    /**
     * Get pending change count
     */
    getPendingCount(): number {
        return this.pendingChanges.length
    }
}

// ============================================
// Factory Function
// ============================================

/**
 * Create a new AutoCommitService instance
 */
export function createAutoCommitService(
    gitService: GitService,
    historyService: HistoryService,
    config?: Partial<AutoCommitConfig>
): AutoCommitService {
    return new AutoCommitService(gitService, historyService, config)
}
