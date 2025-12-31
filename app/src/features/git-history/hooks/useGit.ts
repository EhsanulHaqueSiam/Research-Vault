/**
 * Git Hooks
 * 
 * React hooks for Git operations with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, useCallback } from 'react'
import {
    GitService,
    HistoryService,
    AutoCommitService,
    createGitService,
    createHistoryService,
    createAutoCommitService,
} from '@/core/services/git'
import type {
    Snapshot,
    HistoryNode,
    RepoStatus,
    AutoCommitConfig,
    CommitEvent,
} from '@/core/services/git'

// ============================================
// Query Keys
// ============================================

export const gitKeys = {
    all: ['git'] as const,
    status: (path: string) => [...gitKeys.all, 'status', path] as const,
    history: (path: string) => [...gitKeys.all, 'history', path] as const,
    tree: (path: string) => [...gitKeys.all, 'tree', path] as const,
    snapshot: (path: string, id: string) => [...gitKeys.all, 'snapshot', path, id] as const,
}

// ============================================
// Environment Detection
// ============================================

// Check if running in Tauri (where we have access to Node.js APIs)
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window

// ============================================
// Service Instance Management
// ============================================

// Cache for service instances
const serviceCache = new Map<string, {
    git: GitService
    history: HistoryService
    autoCommit: AutoCommitService
}>()

// Mock service imports - dynamically imported to avoid Node.js issues
let mockServicesLoaded = false
let MockGitService: any = null
let MockHistoryService: any = null
let MockAutoCommitService: any = null
let initializeMockRepoWithHistory: any = null

async function loadMockServices() {
    if (mockServicesLoaded) return
    try {
        const mocks = await import('@/core/services/git/mockGitService')
        MockGitService = mocks.MockGitService
        MockHistoryService = mocks.MockHistoryService
        MockAutoCommitService = mocks.MockAutoCommitService
        initializeMockRepoWithHistory = mocks.initializeMockRepoWithHistory
        mockServicesLoaded = true
    } catch (error) {
        console.error('Failed to load mock services:', error)
    }
}

// Eagerly load mock services in browser
if (!isTauri) {
    loadMockServices()
}

/**
 * Get or create service instances for a project path
 */
function getServices(projectPath: string) {
    if (!serviceCache.has(projectPath)) {
        if (isTauri) {
            // In Tauri, use real Git services
            const git = createGitService(projectPath)
            const history = createHistoryService(projectPath)
            const autoCommit = createAutoCommitService(git, history)
            serviceCache.set(projectPath, { git, history, autoCommit })
        } else {
            // In browser, use mock services
            if (MockGitService && MockHistoryService && MockAutoCommitService) {
                const git = new MockGitService(projectPath)
                const history = new MockHistoryService(projectPath)
                const autoCommit = new MockAutoCommitService(git, history)

                // Initialize with demo data for testing
                if (initializeMockRepoWithHistory) {
                    initializeMockRepoWithHistory(projectPath)
                }

                serviceCache.set(projectPath, { git, history, autoCommit })
            } else {
                // Fallback: create placeholder services that return empty data
                console.warn('[Git] Mock services not loaded yet, using placeholder')
                const git = {
                    isVersioned: async () => false,
                    getStatus: async () => ({ isRepo: false, currentBranch: '', headCommit: null, changes: [], isDirty: false, totalCommits: 0 }),
                    getHistory: async () => [],
                    saveSnapshot: async (message: string) => ({ id: Date.now().toString(), message, timestamp: new Date(), author: 'Mock', changedFiles: [] }),
                    restoreToPoint: async () => { },
                    getSnapshot: async () => null,
                } as unknown as GitService
                const history = {
                    getTreeStructure: async () => [],
                    clearCache: () => { },
                } as unknown as HistoryService
                const autoCommit = {
                    startWatching: () => { },
                    stopWatching: () => { },
                    enable: () => { },
                    disable: () => { },
                    getConfig: () => ({ enabled: false, debounceMs: 3000, ignorePatterns: [], maxAutoCommits: 100 }),
                    setConfig: () => { },
                    getPendingCount: () => 0,
                    isActive: () => false,
                    forceCommit: async () => null,
                    on: () => { },
                    off: () => { },
                    onFileChange: () => { },
                    setDebounceMs: () => { },
                } as unknown as AutoCommitService
                serviceCache.set(projectPath, { git, history, autoCommit })
            }
        }
    }
    return serviceCache.get(projectPath)!
}

/**
 * Clear service cache for a project (e.g., when project is closed)
 */
export function clearGitServices(projectPath: string): void {
    const services = serviceCache.get(projectPath)
    if (services) {
        services.autoCommit.stopWatching()
        serviceCache.delete(projectPath)
    }
}

// ============================================
// Status Hook
// ============================================

/**
 * Hook to get and watch repository status
 */
export function useGitStatus(projectPath: string) {
    return useQuery({
        queryKey: gitKeys.status(projectPath),
        queryFn: async (): Promise<RepoStatus> => {
            const { git } = getServices(projectPath)
            return git.getStatus()
        },
        staleTime: 5000,
        refetchInterval: 10000,
        enabled: !!projectPath,
    })
}

// ============================================
// History Hooks
// ============================================

/**
 * Hook to get commit history
 */
export function useGitHistory(projectPath: string, limit: number = 50) {
    return useQuery({
        queryKey: gitKeys.history(projectPath),
        queryFn: async (): Promise<Snapshot[]> => {
            const { git } = getServices(projectPath)
            return git.getHistory(limit)
        },
        staleTime: 30000,
        enabled: !!projectPath,
    })
}

/**
 * Hook to get history as tree structure (for visual undo tree)
 */
export function useGitTree(projectPath: string, limit: number = 100) {
    return useQuery({
        queryKey: gitKeys.tree(projectPath),
        queryFn: async (): Promise<HistoryNode[]> => {
            const { history } = getServices(projectPath)
            return history.getTreeStructure(limit)
        },
        staleTime: 30000,
        enabled: !!projectPath,
    })
}

/**
 * Hook to get a specific snapshot
 */
export function useGitSnapshot(projectPath: string, snapshotId: string) {
    return useQuery({
        queryKey: gitKeys.snapshot(projectPath, snapshotId),
        queryFn: async (): Promise<Snapshot | null> => {
            const { git } = getServices(projectPath)
            return git.getSnapshot(snapshotId)
        },
        staleTime: Infinity,
        enabled: !!projectPath && !!snapshotId,
    })
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook to save a snapshot (manual commit)
 */
export function useSaveSnapshot(projectPath: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ message }: { message: string }): Promise<Snapshot> => {
            const { git, history } = getServices(projectPath)
            const snapshot = await git.saveSnapshot(message)
            history.clearCache()
            return snapshot
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gitKeys.status(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.history(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.tree(projectPath) })
        },
    })
}

/**
 * Hook to restore to a previous snapshot
 */
export function useRestoreSnapshot(projectPath: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ snapshotId }: { snapshotId: string }): Promise<void> => {
            const { git, history } = getServices(projectPath)
            await git.restoreToPoint(snapshotId)
            history.clearCache()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gitKeys.status(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.history(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.tree(projectPath) })
        },
    })
}

/**
 * Hook to initialize version control for a project
 */
export function useInitVersion(projectPath: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (): Promise<void> => {
            const { git } = getServices(projectPath)
            await git.initVersion()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gitKeys.status(projectPath) })
        },
    })
}

// ============================================
// Auto-Commit Hook
// ============================================

/**
 * Hook to control auto-commit feature
 */
export function useAutoCommit(projectPath: string) {
    const queryClient = useQueryClient()
    const [isEnabled, setIsEnabled] = useState(true)
    const [isWatching, setIsWatching] = useState(false)
    const [pendingCount, setPendingCount] = useState(0)
    const [lastCommit, setLastCommit] = useState<CommitEvent | null>(null)

    const { autoCommit, history } = getServices(projectPath)

    useEffect(() => {
        setIsEnabled(autoCommit.getConfig().enabled)
        setIsWatching(autoCommit.isActive())
    }, [autoCommit])

    const start = useCallback(() => {
        autoCommit.startWatching()
        setIsWatching(true)
    }, [autoCommit])

    const stop = useCallback(() => {
        autoCommit.stopWatching()
        setIsWatching(false)
    }, [autoCommit])

    const enable = useCallback(() => {
        autoCommit.enable()
        setIsEnabled(true)
    }, [autoCommit])

    const disable = useCallback(() => {
        autoCommit.disable()
        setIsEnabled(false)
    }, [autoCommit])

    const setDebounce = useCallback((ms: number) => {
        autoCommit.setDebounceMs(ms)
    }, [autoCommit])

    const onCommit = useCallback((callback: (event: CommitEvent) => void) => {
        autoCommit.on('commit', callback)
        return () => autoCommit.off('commit', callback)
    }, [autoCommit])

    useEffect(() => {
        const handleCommit = (event: CommitEvent) => {
            setLastCommit(event)
            setPendingCount(0)
            queryClient.invalidateQueries({ queryKey: gitKeys.status(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.history(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.tree(projectPath) })
        }

        autoCommit.on('commit', handleCommit)
        return () => autoCommit.off('commit', handleCommit)
    }, [autoCommit, projectPath, queryClient])

    const reportChange = useCallback((type: 'create' | 'modify' | 'delete', path: string) => {
        autoCommit.onFileChange({ type, path, timestamp: new Date() })
        setPendingCount(autoCommit.getPendingCount())
    }, [autoCommit])

    const forceCommit = useCallback(async (message?: string) => {
        const snapshot = await autoCommit.forceCommit(message)
        if (snapshot) {
            history.clearCache()
            queryClient.invalidateQueries({ queryKey: gitKeys.status(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.history(projectPath) })
            queryClient.invalidateQueries({ queryKey: gitKeys.tree(projectPath) })
        }
        return snapshot
    }, [autoCommit, history, projectPath, queryClient])

    const getConfig = useCallback((): AutoCommitConfig => {
        return autoCommit.getConfig()
    }, [autoCommit])

    const setConfig = useCallback((config: Partial<AutoCommitConfig>) => {
        autoCommit.setConfig(config)
        setIsEnabled(autoCommit.getConfig().enabled)
    }, [autoCommit])

    return {
        isEnabled,
        isWatching,
        pendingCount,
        lastCommit,
        start,
        stop,
        enable,
        disable,
        setDebounce,
        forceCommit,
        reportChange,
        onCommit,
        getConfig,
        setConfig,
    }
}

// ============================================
// Combined Project Git Hook
// ============================================

/**
 * All-in-one hook for project Git operations
 */
export function useProjectGit(projectPath: string) {
    const status = useGitStatus(projectPath)
    const history = useGitHistory(projectPath)
    const tree = useGitTree(projectPath)
    const saveSnapshot = useSaveSnapshot(projectPath)
    const restoreSnapshot = useRestoreSnapshot(projectPath)
    const initVersion = useInitVersion(projectPath)
    const autoCommit = useAutoCommit(projectPath)

    return {
        status,
        history,
        tree,
        save: saveSnapshot.mutateAsync,
        restore: restoreSnapshot.mutateAsync,
        init: initVersion.mutateAsync,
        isSaving: saveSnapshot.isPending,
        isRestoring: restoreSnapshot.isPending,
        isInitializing: initVersion.isPending,
        autoCommit,
        isVersioned: status.data?.isRepo ?? false,
        isDirty: status.data?.isDirty ?? false,
        changesCount: status.data?.changes.length ?? 0,
        snapshotsCount: status.data?.totalCommits ?? 0,
    }
}
